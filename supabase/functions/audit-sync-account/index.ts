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

    // Simulación de datos - en producción conectar a MetaApi
    const accountInfo = {
      balance: 10000 + Math.random() * 5000,
      equity: 10000 + Math.random() * 5000,
    };

    console.log(`💰 Balance: ${accountInfo.balance}, Equity: ${accountInfo.equity}`);

    // Guardar equity snapshot
    await supabase
      .from('audit_equity')
      .insert({
        account_id: account.id,
        time: new Date().toISOString(),
        balance: accountInfo.balance,
        equity: accountInfo.equity,
      });

    // Obtener trades existentes
    const { data: allTrades } = await supabase
      .from('audit_trades')
      .select('*')
      .eq('account_id', account.id);

    const stats = calculateStats(allTrades || []);

    // Guardar stats diarias
    await supabase
      .from('audit_stats_daily')
      .upsert({
        account_id: account.id,
        date: new Date().toISOString().split('T')[0],
        ...stats,
      }, { onConflict: 'account_id,date' });

    // Actualizar last_sync_at
    await supabase
      .from('audit_accounts')
      .update({
        last_sync_at: new Date().toISOString(),
        status: account.verified_at ? 'verified' : 'connected',
      })
      .eq('id', account.id);

    console.log(`✅ Sync completed for account ${account.id}`);

    return new Response(
      JSON.stringify({ success: true, stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
