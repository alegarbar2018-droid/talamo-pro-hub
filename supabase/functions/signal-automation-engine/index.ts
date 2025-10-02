import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  symbol: string;
  price: number;
  rsi: number;
  volatility: number;
  volume: number;
  timestamp: string;
}

interface AutomationConfig {
  symbol: string;
  enabled: boolean;
  rsi_oversold: number;
  rsi_overbought: number;
  volatility_threshold: number;
  cooldown_minutes: number;
  last_signal_at: string | null;
}

async function shouldGenerateSignal(
  marketData: MarketData,
  config: AutomationConfig
): Promise<{ generate: boolean; type: 'LONG' | 'SHORT' | null; reason: string }> {
  // Check cooldown
  if (config.last_signal_at) {
    const lastSignal = new Date(config.last_signal_at).getTime();
    const now = new Date().getTime();
    const minutesSinceLastSignal = (now - lastSignal) / (1000 * 60);
    
    if (minutesSinceLastSignal < config.cooldown_minutes) {
      return {
        generate: false,
        type: null,
        reason: `Cooldown active (${minutesSinceLastSignal.toFixed(0)} minutes since last signal)`
      };
    }
  }

  // Check volatility
  if (marketData.volatility < config.volatility_threshold) {
    return {
      generate: false,
      type: null,
      reason: `Low volatility (${marketData.volatility.toFixed(2)} < ${config.volatility_threshold})`
    };
  }

  // Check RSI conditions (CORRECTED: oversold = LONG, overbought = SHORT)
  if (marketData.rsi > config.rsi_overbought) {
    return {
      generate: true,
      type: 'SHORT',
      reason: `RSI overbought (${marketData.rsi.toFixed(2)} > ${config.rsi_overbought}) with high volatility`
    };
  }

  if (marketData.rsi < config.rsi_oversold) {
    return {
      generate: true,
      type: 'LONG',
      reason: `RSI oversold (${marketData.rsi.toFixed(2)} < ${config.rsi_oversold}) with high volatility`
    };
  }

  return {
    generate: false,
    type: null,
    reason: `RSI in neutral zone (${marketData.rsi.toFixed(2)})`
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get automation configs
    const { data: configs, error: configError } = await supabaseClient
      .from('signal_automation_config')
      .select('*')
      .eq('enabled', true);

    if (configError) {
      console.error('Error fetching configs:', configError);
      return new Response(
        JSON.stringify({ error: configError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedSignals = [];

    for (const config of configs || []) {
      // Get latest market data
      const { data: marketData, error: dataError } = await supabaseClient
        .from('market_data')
        .select('*')
        .eq('symbol', config.symbol)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (dataError || !marketData) {
        console.log(`No market data for ${config.symbol}`);
        continue;
      }

      // Check if should generate signal
      const decision = await shouldGenerateSignal(marketData, config);
      
      console.log(`${config.symbol}: ${decision.reason}`);

      if (decision.generate && decision.type) {
        // Calculate TP and SL based on volatility
        const entryPrice = marketData.price;
        const stopLossDistance = marketData.volatility * 2;
        const riskReward = 2.0;

        let stopLoss, takeProfit;
        
        if (decision.type === 'LONG') {
          stopLoss = entryPrice - stopLossDistance;
          takeProfit = entryPrice + (stopLossDistance * riskReward);
        } else {
          stopLoss = entryPrice + stopLossDistance;
          takeProfit = entryPrice - (stopLossDistance * riskReward);
        }

        // Create signal
        const { data: signal, error: signalError } = await supabaseClient
          .from('signals')
          .insert({
            title: `${decision.type} ${config.symbol}`,
            instrument: config.symbol,
            timeframe: '1H',
            logic: decision.reason,
            invalidation: `Price crosses ${decision.type === 'LONG' ? 'below' : 'above'} ${stopLoss.toFixed(2)}`,
            rr: riskReward,
            entry_price: entryPrice,
            stop_loss: stopLoss,
            take_profit: takeProfit,
            source: 'automated',
            status: 'published',
            published_at: new Date().toISOString(),
            author_id: '00000000-0000-0000-0000-000000000000', // System user
          })
          .select()
          .single();

        if (signalError) {
          console.error('Error creating signal:', signalError);
        } else {
          // Update last_signal_at
          await supabaseClient
            .from('signal_automation_config')
            .update({ last_signal_at: new Date().toISOString() })
            .eq('symbol', config.symbol);

          generatedSignals.push({
            symbol: config.symbol,
            type: decision.type,
            entry: entryPrice,
            sl: stopLoss,
            tp: takeProfit,
            signal_id: signal.id,
          });

          console.log(`✅ Generated ${decision.type} signal for ${config.symbol}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated: generatedSignals.length,
        signals: generatedSignals 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
