import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const SYMBOLS = (Deno.env.get('BINANCE_SYMBOLS') ?? 'BTCUSDT').split(',').map(s => s.trim());
const BINANCE_BASE = 'https://api.binance.com';
const INTERVAL = '1m';
const LIMIT = 120;

// Calculate RSI(14) with proper smoothing
function calculateRSI(closes: number[], period: number = 14): number | null {
  if (closes.length < period + 1) return null;

  // First average gain/loss
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smooth with remaining closes
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (change < 0 ? -change : 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// Calculate volatility (standard deviation)
function calculateVolatility(prices: number[]): number {
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  return Math.sqrt(variance);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log(`🚀 Binance data collector started for symbols: ${SYMBOLS.join(', ')}`);
  const results = [];

  for (const symbol of SYMBOLS) {
    const symbolUpper = symbol.toUpperCase();
    try {
      console.log(`📊 Fetching ${symbolUpper} klines...`);
      const url = `${BINANCE_BASE}/api/v3/klines?symbol=${symbolUpper}&interval=${INTERVAL}&limit=${LIMIT}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
      }

      const klines = await response.json();
      if (!Array.isArray(klines) || klines.length < 2) {
        throw new Error('Insufficient kline data from Binance');
      }

      // Use second-to-last candle (last closed candle)
      const lastClosedCandle = klines[klines.length - 2];
      const close = parseFloat(lastClosedCandle[4]);
      const volume = parseFloat(lastClosedCandle[5]);
      const closeTimeMs = lastClosedCandle[6];
      const timestamp = new Date(closeTimeMs).toISOString();

      // Calculate RSI and volatility from all closes
      const closes = klines.map((k: any) => parseFloat(k[4]));
      const rsi = calculateRSI(closes);
      const volatility = calculateVolatility(closes.slice(-20));

      console.log(`📈 ${symbolUpper}: price=${close}, rsi=${rsi?.toFixed(2)}, vol=${volatility.toFixed(4)}, timestamp=${timestamp}`);

      // Upsert to market_data with composite PK (symbol, timestamp)
      const { error } = await supabaseClient
        .from('market_data')
        .upsert({
          symbol: symbolUpper,
          price: close,
          rsi: rsi ?? null,
          volatility: volatility,
          volume: volume,
          timestamp: timestamp,
        }, {
          onConflict: 'symbol,timestamp'
        });

      if (error) {
        console.error(`❌ Error upserting ${symbolUpper}:`, error);
        throw error;
      }

      results.push({
        symbol: symbolUpper,
        ok: true,
        timestamp: timestamp,
        price: close,
        rsi: rsi?.toFixed(2),
        volatility: volatility.toFixed(4),
      });

      console.log(`✅ ${symbolUpper} data saved successfully`);
    } catch (error: any) {
      console.error(`❌ Error processing ${symbolUpper}:`, error.message);
      results.push({
        symbol: symbolUpper,
        ok: false,
        error: error.message,
      });
    }
  }

  console.log(`✨ Data collection completed: ${results.filter(r => r.ok).length}/${results.length} successful`);

  return new Response(
    JSON.stringify({ ok: true, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
