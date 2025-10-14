-- =============================================
-- FASE 1: BASE DE DATOS PARA TRADING TOOLS
-- =============================================

-- Tabla: contract_specifications
-- Especificaciones técnicas de instrumentos financieros
CREATE TABLE IF NOT EXISTS public.contract_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  name text NOT NULL,
  asset_class text NOT NULL, -- 'forex', 'crypto', 'indices', 'commodities', 'stocks'
  contract_size numeric NOT NULL,
  pip_value numeric NOT NULL,
  pip_position integer NOT NULL DEFAULT 4, -- Decimal position of pip
  min_lot numeric NOT NULL DEFAULT 0.01,
  max_lot numeric NOT NULL DEFAULT 100,
  lot_step numeric NOT NULL DEFAULT 0.01,
  spread_typical numeric,
  margin_percentage numeric,
  leverage_max integer DEFAULT 500,
  trading_hours jsonb, -- { "monday": "00:00-24:00", ... }
  swap_long numeric,
  swap_short numeric,
  status text NOT NULL DEFAULT 'active',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contract_specs_symbol ON public.contract_specifications(symbol);
CREATE INDEX idx_contract_specs_asset_class ON public.contract_specifications(asset_class);
CREATE INDEX idx_contract_specs_status ON public.contract_specifications(status);

-- Tabla: trading_formulas
-- Biblioteca de fórmulas educativas
CREATE TABLE IF NOT EXISTS public.trading_formulas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL, -- 'risk', 'position_sizing', 'profit_loss', 'indicators', 'money_management'
  description text NOT NULL,
  formula_plain text NOT NULL, -- Plain text formula
  formula_latex text, -- LaTeX for beautiful rendering
  variables jsonb NOT NULL, -- [{"name": "balance", "description": "...", "unit": "$"}]
  example_inputs jsonb, -- {"balance": 10000, "risk": 2}
  example_output jsonb, -- {"result": 200, "explanation": "..."}
  explanation text NOT NULL,
  related_calculators text[], -- ['risk-calculator', 'position-sizer']
  difficulty text NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_formulas_slug ON public.trading_formulas(slug);
CREATE INDEX idx_formulas_category ON public.trading_formulas(category);
CREATE INDEX idx_formulas_status ON public.trading_formulas(status);

-- Tabla: calculator_configs
-- Configuración dinámica de calculadoras
CREATE TABLE IF NOT EXISTS public.calculator_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Calculator',
  category text NOT NULL, -- 'risk', 'analysis', 'planning', 'advanced'
  input_fields jsonb NOT NULL, -- [{"id": "balance", "label": "...", "type": "number", "required": true}]
  calculation_logic jsonb NOT NULL, -- Instructions for calculation
  output_format jsonb NOT NULL, -- How to display results
  formula_id uuid REFERENCES public.trading_formulas(id),
  requires_contracts boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_calculator_configs_id ON public.calculator_configs(calculator_id);
CREATE INDEX idx_calculator_configs_status ON public.calculator_configs(status);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_tools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contract_specs_updated_at
  BEFORE UPDATE ON public.contract_specifications
  FOR EACH ROW EXECUTE FUNCTION update_tools_updated_at();

CREATE TRIGGER update_formulas_updated_at
  BEFORE UPDATE ON public.trading_formulas
  FOR EACH ROW EXECUTE FUNCTION update_tools_updated_at();

CREATE TRIGGER update_calculator_configs_updated_at
  BEFORE UPDATE ON public.calculator_configs
  FOR EACH ROW EXECUTE FUNCTION update_tools_updated_at();

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.contract_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculator_configs ENABLE ROW LEVEL SECURITY;

-- Contract Specifications Policies
CREATE POLICY "Anyone authenticated can view active contracts"
  ON public.contract_specifications FOR SELECT
  USING (auth.uid() IS NOT NULL AND (status = 'active' OR has_admin_permission('tools', 'read')));

CREATE POLICY "Admins can manage contracts"
  ON public.contract_specifications FOR ALL
  USING (has_admin_permission('tools', 'manage'));

-- Trading Formulas Policies
CREATE POLICY "Anyone authenticated can view published formulas"
  ON public.trading_formulas FOR SELECT
  USING (auth.uid() IS NOT NULL AND (status = 'published' OR has_admin_permission('tools', 'read')));

CREATE POLICY "Admins can manage formulas"
  ON public.trading_formulas FOR ALL
  USING (has_admin_permission('tools', 'manage'));

-- Calculator Configs Policies
CREATE POLICY "Anyone authenticated can view active calculators"
  ON public.calculator_configs FOR SELECT
  USING (auth.uid() IS NOT NULL AND (status = 'active' OR has_admin_permission('tools', 'read')));

CREATE POLICY "Admins can manage calculators"
  ON public.calculator_configs FOR ALL
  USING (has_admin_permission('tools', 'manage'));

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Contratos Forex principales
INSERT INTO public.contract_specifications (symbol, name, asset_class, contract_size, pip_value, pip_position, spread_typical, margin_percentage, leverage_max) VALUES
('EURUSD', 'Euro vs US Dollar', 'forex', 100000, 10, 4, 0.00015, 0.2, 500),
('GBPUSD', 'British Pound vs US Dollar', 'forex', 100000, 10, 4, 0.00020, 0.2, 500),
('USDJPY', 'US Dollar vs Japanese Yen', 'forex', 100000, 9.09, 2, 0.015, 0.2, 500),
('AUDUSD', 'Australian Dollar vs US Dollar', 'forex', 100000, 10, 4, 0.00020, 0.2, 500),
('USDCHF', 'US Dollar vs Swiss Franc', 'forex', 100000, 10, 4, 0.00020, 0.2, 500);

-- Contratos Crypto
INSERT INTO public.contract_specifications (symbol, name, asset_class, contract_size, pip_value, pip_position, spread_typical, margin_percentage, leverage_max) VALUES
('BTCUSD', 'Bitcoin vs US Dollar', 'crypto', 1, 1, 0, 50, 1, 100),
('ETHUSD', 'Ethereum vs US Dollar', 'crypto', 1, 0.1, 1, 5, 1, 100),
('XRPUSD', 'Ripple vs US Dollar', 'crypto', 1, 0.00001, 5, 0.0001, 1, 50);

-- Índices
INSERT INTO public.contract_specifications (symbol, name, asset_class, contract_size, pip_value, pip_position, spread_typical, margin_percentage, leverage_max) VALUES
('US30', 'Dow Jones Industrial Average', 'indices', 10, 1, 0, 2, 0.5, 200),
('NAS100', 'Nasdaq 100', 'indices', 10, 1, 0, 2, 0.5, 200),
('SPX500', 'S&P 500', 'indices', 50, 1, 0, 0.5, 0.5, 200);

-- Fórmulas de Trading
INSERT INTO public.trading_formulas (name, slug, category, description, formula_plain, variables, explanation, difficulty) VALUES
('Risk per Trade', 'risk-per-trade', 'risk', 'Calcula el monto en dinero a arriesgar por operación', 'Risk Amount = Account Balance × (Risk Percentage / 100)', 
'[{"name":"balance","description":"Saldo de la cuenta","unit":"$"},{"name":"risk_percentage","description":"Porcentaje de riesgo","unit":"%"}]',
'Esta fórmula te ayuda a determinar cuánto dinero deberías arriesgar en cada operación basándote en tu capital total y tu tolerancia al riesgo.', 'beginner'),

('Position Size (Forex)', 'position-size-forex', 'position_sizing', 'Calcula el tamaño de posición en lotes para forex', 'Position Size = (Risk Amount / Stop Loss in Pips) / Pip Value', 
'[{"name":"risk_amount","description":"Monto a arriesgar","unit":"$"},{"name":"stop_loss_pips","description":"Distancia del Stop Loss","unit":"pips"},{"name":"pip_value","description":"Valor del pip","unit":"$"}]',
'Determina el tamaño correcto de tu posición para mantener tu riesgo controlado según la distancia de tu stop loss.', 'beginner'),

('Risk-Reward Ratio', 'risk-reward-ratio', 'risk', 'Calcula la relación riesgo/beneficio de una operación', 'R:R = (Take Profit - Entry) / (Entry - Stop Loss)', 
'[{"name":"entry","description":"Precio de entrada","unit":""},{"name":"take_profit","description":"Precio objetivo","unit":""},{"name":"stop_loss","description":"Precio de stop loss","unit":""}]',
'Una relación mínima de 1:2 significa que buscas ganar el doble de lo que arriesgas.', 'beginner'),

('Break-even Analysis', 'break-even', 'money_management', 'Calcula las operaciones ganadoras necesarias para alcanzar break-even', 'Win Rate Needed = 100 / (1 + Risk:Reward Ratio)', 
'[{"name":"risk_reward","description":"Relación riesgo:beneficio","unit":""}]',
'Te muestra qué porcentaje de operaciones ganadoras necesitas para no perder dinero.', 'intermediate'),

('Compound Growth', 'compound-growth', 'money_management', 'Proyecta el crecimiento de tu cuenta con capitalización', 'Final Balance = Initial Balance × (1 + Return Rate)^Periods', 
'[{"name":"initial_balance","description":"Saldo inicial","unit":"$"},{"name":"return_rate","description":"Rendimiento por período","unit":"%"},{"name":"periods","description":"Número de períodos","unit":""}]',
'Muestra el poder del interés compuesto en tu trading a largo plazo.', 'intermediate');

-- Configuración de Calculadoras
INSERT INTO public.calculator_configs (calculator_id, name, description, icon, category, input_fields, calculation_logic, output_format, position) VALUES
('risk-calculator', 'Calculadora de Riesgo', 'Determina el tamaño óptimo de posición', 'Calculator', 'risk',
'[{"id":"balance","label":"Saldo de cuenta","type":"number","required":true,"min":100,"defaultValue":10000,"suffix":"$"},{"id":"risk_percent","label":"Riesgo por trade","type":"number","required":true,"min":0.1,"max":10,"step":0.1,"defaultValue":1,"suffix":"%"},{"id":"stop_loss_pips","label":"Stop Loss","type":"number","required":true,"min":1,"defaultValue":50,"suffix":"pips"},{"id":"pip_value","label":"Valor del pip","type":"number","required":true,"defaultValue":10,"suffix":"$"}]',
'{"formula":"(balance * (risk_percent / 100)) / (stop_loss_pips * pip_value)","validation":{"min":0.01,"max":100}}',
'{"primary":{"value":"result","label":"Tamaño de posición","unit":"lotes","decimals":2},"secondary":[{"label":"Riesgo en $","formula":"balance * (risk_percent / 100)","unit":"$"}]}',
1),

('pip-calculator', 'Calculadora de Pips', 'Calcula el valor monetario de los pips', 'TrendingUp', 'risk',
'[{"id":"instrument","label":"Instrumento","type":"select","required":true,"options":"contracts"},{"id":"lots","label":"Tamaño posición","type":"number","required":true,"min":0.01,"step":0.01,"defaultValue":1,"suffix":"lotes"},{"id":"pips","label":"Pips ganados/perdidos","type":"number","required":true,"defaultValue":50,"suffix":"pips"}]',
'{"formula":"pips * pip_value * lots","requiresContract":true}',
'{"primary":{"value":"result","label":"Valor en dinero","unit":"$","decimals":2},"secondary":[{"label":"Por lote","formula":"pips * pip_value","unit":"$"}]}',
2),

('margin-calculator', 'Calculadora de Margen', 'Calcula el margen requerido', 'Shield', 'risk',
'[{"id":"instrument","label":"Instrumento","type":"select","required":true,"options":"contracts"},{"id":"lots","label":"Tamaño posición","type":"number","required":true,"min":0.01,"step":0.01,"defaultValue":1},{"id":"leverage","label":"Apalancamiento","type":"select","required":true,"options":[{"value":50,"label":"1:50"},{"value":100,"label":"1:100"},{"value":200,"label":"1:200"},{"value":500,"label":"1:500"}],"defaultValue":100}]',
'{"formula":"(lots * contract_size * current_price) / leverage","requiresContract":true}',
'{"primary":{"value":"result","label":"Margen requerido","unit":"$","decimals":2},"secondary":[{"label":"Apalancamiento","value":"leverage","prefix":"1:"}]}',
3),

('profit-loss-calculator', 'Calculadora P/L', 'Calcula ganancias y pérdidas', 'DollarSign', 'analysis',
'[{"id":"instrument","label":"Instrumento","type":"select","required":true,"options":"contracts"},{"id":"direction","label":"Dirección","type":"select","required":true,"options":[{"value":"long","label":"Compra (Long)"},{"value":"short","label":"Venta (Short)"}]},{"id":"entry_price","label":"Precio entrada","type":"number","required":true,"step":0.00001},{"id":"exit_price","label":"Precio salida","type":"number","required":true,"step":0.00001},{"id":"lots","label":"Lotes","type":"number","required":true,"min":0.01,"step":0.01,"defaultValue":1}]',
'{"formula":"(exit_price - entry_price) * pip_multiplier * lots * direction_multiplier","requiresContract":true}',
'{"primary":{"value":"result","label":"P/L Total","unit":"$","decimals":2,"colorize":true},"secondary":[{"label":"P/L en pips","formula":"(exit_price - entry_price) * pip_multiplier"},{"label":"ROI","formula":"(result / margin) * 100","unit":"%"}]}',
4);

COMMENT ON TABLE public.contract_specifications IS 'Especificaciones técnicas de instrumentos financieros para calculadoras';
COMMENT ON TABLE public.trading_formulas IS 'Biblioteca educativa de fórmulas de trading';
COMMENT ON TABLE public.calculator_configs IS 'Configuración dinámica de calculadoras para el frontend';