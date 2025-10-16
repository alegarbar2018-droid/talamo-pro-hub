import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calculateStats = (trades: any[]) => {
  const closedTrades = trades.filter(t => t.close_time !== null && t.profit !== null);
  
  if (closedTrades.length === 0) {
    return {
      win_rate: 0,
      max_dd: 0,
      profit_factor: 0,
      gross_profit: 0,
      gross_loss: 0,
      total_trades: 0,
      avg_win: 0,
      avg_loss: 0,
    };
  }

  const wins = closedTrades.filter(t => t.profit > 0);
  const losses = closedTrades.filter(t => t.profit < 0);

  const grossProfit = wins.reduce((sum, t) => sum + t.profit, 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.profit, 0));
  
  const winRate = (wins.length / closedTrades.length) * 100;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 999 : 0);
  
  const avgWin = wins.length > 0 ? grossProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0;

  // Max Drawdown simplificado
  let maxDD = 0;
  let peak = 0;
  let equity = 0;
  
  closedTrades.sort((a, b) => new Date(a.close_time).getTime() - new Date(b.close_time).getTime());
  
  closedTrades.forEach(trade => {
    equity += trade.profit;
    if (equity > peak) peak = equity;
    const dd = peak > 0 ? ((peak - equity) / peak) * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  });

  return {
    win_rate: winRate,
    max_dd: maxDD,
    profit_factor: profitFactor,
    gross_profit: grossProfit,
    gross_loss: grossLoss,
    total_trades: closedTrades.length,
    avg_win: avgWin,
    avg_loss: avgLoss,
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { account_id } = await req.json();
    
    console.log(`🔄 Syncing account: ${account_id}`);

    const { data: account, error: accountError } = await supabase
      .from('audit_accounts')
      .select('*')
      .eq('id', account_id)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    if (!account.metaapi_account_id) {
      throw new Error('MetaAPI account ID not found. Please reconnect your account.');
    }

    const metaapiToken = Deno.env.get('METAAPI_TOKEN');
    if (!metaapiToken) {
      throw new Error('MetaAPI token not configured');
    }

    console.log(`📡 Fetching data from MetaAPI for account: ${account.metaapi_account_id}`);

    // Get account information from MetaAPI
    const accountInfoResponse = await fetch(
      `https://mt-client-api-v1.london.agiliumtrade.ai/users/current/accounts/${account.metaapi_account_id}/account-information`,
      {
        headers: {
          'auth-token': metaapiToken,
        },
      }
    );

    if (!accountInfoResponse.ok) {
      const errorText = await accountInfoResponse.text();
      console.error('❌ MetaAPI account info error:', errorText);
      throw new Error(`MetaAPI error: ${accountInfoResponse.status} - ${errorText}`);
    }

    const accountInfo = await accountInfoResponse.json();
    console.log(`💰 Balance: ${accountInfo.balance}, Equity: ${accountInfo.equity}`);

    // Get history deals (closed trades) from MetaAPI
    const historyResponse = await fetch(
      `https://mt-client-api-v1.london.agiliumtrade.ai/users/current/accounts/${account.metaapi_account_id}/history-deals/time/${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}/${new Date().toISOString()}`,
      {
        headers: {
          'auth-token': metaapiToken,
        },
      }
    );

    let newTrades = [];
    if (historyResponse.ok) {
      const historyDeals = await historyResponse.json();
      console.log(`📊 Found ${historyDeals.length} history deals`);

      // Process deals and insert new trades
      for (const deal of historyDeals) {
        if (deal.type === 'DEAL_TYPE_BUY' || deal.type === 'DEAL_TYPE_SELL') {
          // Check if trade already exists
          const { data: existingTrade } = await supabase
            .from('audit_trades')
            .select('id')
            .eq('account_id', account.id)
            .eq('ticket', deal.positionId || deal.id)
            .single();

          if (!existingTrade) {
            const tradeData = {
              account_id: account.id,
              ticket: deal.positionId || deal.id,
              symbol: deal.symbol,
              type: deal.type === 'DEAL_TYPE_BUY' ? 'buy' : 'sell',
              volume: deal.volume,
              open_price: deal.price,
              close_price: deal.price,
              open_time: deal.time,
              close_time: deal.time,
              profit: deal.profit || 0,
              commission: deal.commission || 0,
              swap: deal.swap || 0,
            };

            const { error: insertError } = await supabase
              .from('audit_trades')
              .insert(tradeData);

            if (!insertError) {
              newTrades.push(tradeData);
            }
          }
        }
      }

      console.log(`✨ Inserted ${newTrades.length} new trades`);
    } else {
      console.warn('⚠️ Could not fetch history deals:', await historyResponse.text());
    }

    // Save equity snapshot
    await supabase
      .from('audit_equity')
      .insert({
        account_id: account.id,
        time: new Date().toISOString(),
        balance: accountInfo.balance,
        equity: accountInfo.equity,
      });

    // Get all trades for stats calculation
    const { data: allTrades } = await supabase
      .from('audit_trades')
      .select('*')
      .eq('account_id', account.id);

    const stats = calculateStats(allTrades || []);

    // Save daily stats
    await supabase
      .from('audit_stats_daily')
      .upsert({
        account_id: account.id,
        date: new Date().toISOString().split('T')[0],
        ...stats,
      }, { onConflict: 'account_id,date' });

    // Update last_sync_at and clear any errors
    await supabase
      .from('audit_accounts')
      .update({
        last_sync_at: new Date().toISOString(),
        status: 'connected',
        sync_error: null,
      })
      .eq('id', account.id);

    console.log(`✅ Sync completed for account ${account.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats,
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        new_trades: newTrades.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Sync error:', error);
    
    // Save error to account
    try {
      const { account_id } = await req.json();
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      await supabase
        .from('audit_accounts')
        .update({
          sync_error: error.message,
          status: 'error',
        })
        .eq('id', account_id);
    } catch (e) {
      console.error('Failed to save error:', e);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
