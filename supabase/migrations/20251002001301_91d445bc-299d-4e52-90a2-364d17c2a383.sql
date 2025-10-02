-- Create market_data table for storing Binance data
CREATE TABLE IF NOT EXISTS public.market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price decimal NOT NULL,
  rsi decimal,
  volatility decimal,
  volume decimal,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_market_data_symbol_timestamp ON public.market_data(symbol, timestamp DESC);

-- RLS policies
CREATE POLICY "Anyone authenticated can view market data"
  ON public.market_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only system can insert market data"
  ON public.market_data
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Add source field to signals table to track manual vs automated
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual' CHECK (source IN ('manual', 'automated'));
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS entry_price decimal;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS stop_loss decimal;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS take_profit decimal;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS result text CHECK (result IN ('win', 'loss', 'pending'));

-- Create signal_automation_config table
CREATE TABLE IF NOT EXISTS public.signal_automation_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  enabled boolean DEFAULT true,
  rsi_oversold decimal DEFAULT 30,
  rsi_overbought decimal DEFAULT 70,
  volatility_threshold decimal DEFAULT 2.0,
  cooldown_minutes integer DEFAULT 60,
  last_signal_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.signal_automation_config ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins and analysts can manage automation config"
  ON public.signal_automation_config
  FOR ALL
  TO authenticated
  USING (has_admin_permission('signals', 'manage'));

CREATE POLICY "Anyone authenticated can view automation config"
  ON public.signal_automation_config
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default config for BTCUSDT
INSERT INTO public.signal_automation_config (symbol, enabled)
VALUES ('BTCUSDT', true)
ON CONFLICT (symbol) DO NOTHING;