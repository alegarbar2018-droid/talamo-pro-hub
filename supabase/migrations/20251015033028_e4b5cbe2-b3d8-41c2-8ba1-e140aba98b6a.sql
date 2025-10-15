-- Create copy_strategies table
CREATE TABLE public.copy_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información del Trader
  trader_name TEXT NOT NULL,
  trader_bio TEXT,
  trader_avatar_url TEXT,
  
  -- Tipo de cuenta y equity
  account_type TEXT NOT NULL CHECK (account_type IN ('social', 'standard', 'pro')),
  strategy_equity NUMERIC NOT NULL,
  
  -- Requisitos de inversión
  min_investment NUMERIC NOT NULL,
  performance_fee NUMERIC NOT NULL CHECK (performance_fee >= 0 AND performance_fee <= 100),
  leverage INTEGER NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('daily', 'weekly', 'monthly', 'quarterly')),
  
  -- Performance y métricas
  symbols_traded TEXT[] NOT NULL,
  cumulative_return_data JSONB,
  
  -- Métricas de rendimiento
  total_return_percentage NUMERIC,
  monthly_return_percentage NUMERIC,
  win_rate NUMERIC,
  profit_factor NUMERIC,
  max_drawdown NUMERIC,
  total_trades INTEGER,
  
  -- Link y estado
  strategy_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create copy_strategy_orders table
CREATE TABLE public.copy_strategy_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES public.copy_strategies(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('buy', 'sell')),
  open_price NUMERIC NOT NULL,
  close_price NUMERIC,
  volume NUMERIC NOT NULL,
  profit_loss NUMERIC,
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.copy_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_strategy_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for copy_strategies
CREATE POLICY "Anyone authenticated can view active strategies"
ON public.copy_strategies
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  (status = 'active' OR has_admin_permission('copy', 'manage'))
);

CREATE POLICY "Admins can manage strategies"
ON public.copy_strategies
FOR ALL
USING (has_admin_permission('copy', 'manage'));

-- RLS Policies for copy_strategy_orders
CREATE POLICY "Anyone authenticated can view orders of active strategies"
ON public.copy_strategy_orders
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.copy_strategies 
    WHERE id = copy_strategy_orders.strategy_id 
    AND status = 'active'
  )
);

CREATE POLICY "Admins can manage strategy orders"
ON public.copy_strategy_orders
FOR ALL
USING (has_admin_permission('copy', 'manage'));

-- Create storage bucket for trader avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('copy-trading-avatars', 'copy-trading-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can view trader avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'copy-trading-avatars');

CREATE POLICY "Admins can upload trader avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'copy-trading-avatars' AND
  has_admin_permission('copy', 'manage')
);

CREATE POLICY "Admins can update trader avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'copy-trading-avatars' AND
  has_admin_permission('copy', 'manage')
);

CREATE POLICY "Admins can delete trader avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'copy-trading-avatars' AND
  has_admin_permission('copy', 'manage')
);