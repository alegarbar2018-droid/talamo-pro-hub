import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

// Calculate RSI
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50; // Default neutral

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
}

// Calculate volatility (standard deviation)
function calculateVolatility(prices: number[]): number {
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  return Math.sqrt(variance);
}

async function fetchBinanceData(symbol: string): Promise<{ price: number; rsi: number; volatility: number; volume: number }> {
  // Fetch 1-hour klines for RSI calculation
  const klinesResponse = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=20`
  );
  
  if (!klinesResponse.ok) {
    throw new Error(`Binance API error: ${klinesResponse.statusText}`);
  }

  const klines: BinanceKline[] = await klinesResponse.json();
  
  const prices = klines.map(k => parseFloat(k.close));
  const volumes = klines.map(k => parseFloat(k.volume));
  
  const currentPrice = prices[prices.length - 1];
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const volume = volumes[volumes.length - 1];

  return { price: currentPrice, rsi, volatility, volume };
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

    // Get enabled symbols from config
    const { data: configs, error: configError } = await supabaseClient
      .from('signal_automation_config')
      .select('symbol')
      .eq('enabled', true);

    if (configError) {
      console.error('Error fetching configs:', configError);
      return new Response(
        JSON.stringify({ error: configError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Fetch data for each enabled symbol
    for (const config of configs || []) {
      try {
        const data = await fetchBinanceData(config.symbol);
        
        // Store in database
        const { error: insertError } = await supabaseClient
          .from('market_data')
          .insert({
            symbol: config.symbol,
            price: data.price,
            rsi: data.rsi,
            volatility: data.volatility,
            volume: data.volume,
          });

        if (insertError) {
          console.error(`Error inserting data for ${config.symbol}:`, insertError);
        } else {
          results.push({
            symbol: config.symbol,
            price: data.price,
            rsi: data.rsi.toFixed(2),
            volatility: data.volatility.toFixed(4),
            volume: data.volume.toFixed(2),
          });
        }
      } catch (error) {
        console.error(`Error fetching Binance data for ${config.symbol}:`, error);
      }
    }

    console.log('Data collection completed:', results);

    return new Response(
      JSON.stringify({ success: true, collected: results.length, data: results }),
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
