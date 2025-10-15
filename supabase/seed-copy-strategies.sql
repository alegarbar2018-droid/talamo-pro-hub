-- ============================================
-- FASE 11: Seed Data - 6 Estrategias de Ejemplo
-- ============================================

-- Nota: Este script es para desarrollo/testing
-- En producción, las estrategias se crean vía admin panel

-- Limpiar datos existentes (solo para desarrollo)
-- DELETE FROM copy_strategy_orders;
-- DELETE FROM copy_strategies;

-- Estrategia 1: Conservadora - Gold Focus
INSERT INTO copy_strategies (
  slug,
  name,
  description,
  account_type,
  strategy_equity,
  min_investment,
  performance_fee_pct,
  leverage,
  billing_period,
  symbols,
  external_link,
  risk_band,
  profit_factor,
  max_drawdown,
  win_rate,
  cagr,
  total_trades,
  cumulative_return_series,
  status
) VALUES (
  'gold-master-conservative',
  'GoldMaster Conservative',
  'Estrategia conservadora enfocada en oro con gestión de riesgo estricta. Trading diurno con stop-loss ajustado.',
  'Social Standard',
  35000,
  100,
  15,
  50,
  'Monthly',
  ARRAY['XAUUSD', 'XAGUSD'],
  'https://exness.com/strategy/gold-master?utm_source=talamo&utm_medium=copy&utm_campaign=dir',
  'Conservador',
  2.4,
  12.5,
  75,
  28.3,
  342,
  '[
    {"date": "2024-01", "value": 2.1},
    {"date": "2024-02", "value": 5.8},
    {"date": "2024-03", "value": 9.2},
    {"date": "2024-04", "value": 14.6},
    {"date": "2024-05", "value": 19.3},
    {"date": "2024-06", "value": 23.7},
    {"date": "2024-07", "value": 28.3}
  ]'::jsonb,
  'published'
);

-- Estrategia 2: Moderada - Índices US
INSERT INTO copy_strategies (
  slug,
  name,
  description,
  account_type,
  strategy_equity,
  min_investment,
  performance_fee_pct,
  leverage,
  billing_period,
  symbols,
  external_link,
  risk_band,
  profit_factor,
  max_drawdown,
  win_rate,
  cagr,
  total_trades,
  cumulative_return_series,
  status
) VALUES (
  'index-pro-moderate',
  'IndexPro Moderate',
  'Trading sistemático en índices US. Combina análisis técnico y fundamental con gestión activa del riesgo.',
  'Pro',
  120000,
  500,
  25,
  100,
  'Monthly',
  ARRAY['US100', 'US500', 'GER40'],
  'https://exness.com/strategy/index-pro?utm_source=talamo&utm_medium=copy&utm_campaign=dir',
  'Moderado',
  1.9,
  18.2,
  68,
  42.5,
  587,
  '[
    {"date": "2024-01", "value": 3.5},
    {"date": "2024-02", "value": 8.9},
    {"date": "2024-03", "value": 15.2},
    {"date": "2024-04", "value": 22.7},
    {"date": "2024-05", "value": 31.8},
    {"date": "2024-06", "value": 37.4},
    {"date": "2024-07", "value": 42.5}
  ]'::jsonb,
  'published'
);

-- Estrategia 3: Conservadora - Forex Multi-Par
INSERT INTO copy_strategies (
  slug,
  name,
  description,
  account_type,
  strategy_equity,
  min_investment,
  performance_fee_pct,
  leverage,
  billing_period,
  symbols,
  external_link,
  risk_band,
  profit_factor,
  max_drawdown,
  win_rate,
  cagr,
  total_trades,
  cumulative_return_series,
  status
) VALUES (
  'forex-stable-conservative',
  'ForexStable',
  'Estrategia multi-par ultra conservadora. Diversificación de divisas con análisis de correlación y límites estrictos.',
  'Social Standard',
  28000,
  150,
  18,
  30,
  'Quarterly',
  ARRAY['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'],
  'https://exness.com/strategy/forex-stable?utm_source=talamo&utm_medium=copy&utm_campaign=dir',
  'Conservador',
  2.7,
  8.5,
  82,
  21.4,
  412,
  '[
    {"date": "2024-01", "value": 1.8},
    {"date": "2024-02", "value": 4.5},
    {"date": "2024-03", "value": 8.1},
    {"date": "2024-04", "value": 12.3},
    {"date": "2024-05", "value": 16.7},
    {"date": "2024-06", "value": 19.2},
    {"date": "2024-07", "value": 21.4}
  ]'::jsonb,
  'published'
);

-- Estrategia 4: Agresiva - Crypto Focus
INSERT INTO copy_strategies (
  slug,
  name,
  description,
  account_type,
  strategy_equity,
  min_investment,
  performance_fee_pct,
  leverage,
  billing_period,
  symbols,
  external_link,
  risk_band,
  profit_factor,
  max_drawdown,
  win_rate,
  cagr,
  total_trades,
  cumulative_return_series,
  status
) VALUES (
  'crypto-momentum-aggressive',
  'CryptoMomentum',
  'Estrategia agresiva de momentum en criptomonedas. Alto potencial de retorno con drawdowns controlados. Solo para inversores experimentados.',
  'Pro',
  95000,
  1000,
  30,
  200,
  'Weekly',
  ARRAY['BTCUSD', 'ETHUSD', 'BNBUSD'],
  'https://exness.com/strategy/crypto-momentum?utm_source=talamo&utm_medium=copy&utm_campaign=dir',
  'Agresivo',
  1.6,
  32.8,
  58,
  87.3,
  923,
  '[
    {"date": "2024-01", "value": 12.5},
    {"date": "2024-02", "value": 28.3},
    {"date": "2024-03", "value": 41.7},
    {"date": "2024-04", "value": 58.9},
    {"date": "2024-05", "value": 69.2},
    {"date": "2024-06", "value": 78.1},
    {"date": "2024-07", "value": 87.3}
  ]'::jsonb,
  'published'
);

-- Estrategia 5: Moderada - Commodities Diversificada
INSERT INTO copy_strategies (
  slug,
  name,
  description,
  account_type,
  strategy_equity,
  min_investment,
  performance_fee_pct,
  leverage,
  billing_period,
  symbols,
  external_link,
  risk_band,
  profit_factor,
  max_drawdown,
  win_rate,
  cagr,
  total_trades,
  cumulative_return_series,
  status
) VALUES (
  'commodities-blend-moderate',
  'CommoditiesBlend',
  'Cartera diversificada de commodities. Incluye metales, energía y agricultura con rebalanceo mensual.',
  'Social Standard',
  62000,
  300,
  22,
  75,
  'Monthly',
  ARRAY['XAUUSD', 'XBRUSD', 'XNGUSD', 'WHEUSD'],
  'https://exness.com/strategy/commodities-blend?utm_source=talamo&utm_medium=copy&utm_campaign=dir',
  'Moderado',
  2.1,
  16.7,
  71,
  34.8,
  468,
  '[
    {"date": "2024-01", "value": 2.9},
    {"date": "2024-02", "value": 7.6},
    {"date": "2024-03", "value": 13.2},
    {"date": "2024-04", "value": 19.8},
    {"date": "2024-05", "value": 26.1},
    {"date": "2024-06", "value": 30.7},
    {"date": "2024-07", "value": 34.8}
  ]'::jsonb,
  'published'
);

-- Estrategia 6: Agresiva - Scalping Multi-Market
INSERT INTO copy_strategies (
  slug,
  name,
  description,
  account_type,
  strategy_equity,
  min_investment,
  performance_fee_pct,
  leverage,
  billing_period,
  symbols,
  external_link,
  risk_band,
  profit_factor,
  max_drawdown,
  win_rate,
  cagr,
  total_trades,
  cumulative_return_series,
  status
) VALUES (
  'scalp-master-aggressive',
  'ScalpMaster',
  'Scalping de alta frecuencia en múltiples mercados. Requiere capital alto y tolerancia a volatilidad intradía.',
  'Pro',
  145000,
  800,
  28,
  150,
  'Weekly',
  ARRAY['EURUSD', 'GBPJPY', 'XAUUSD', 'US30'],
  'https://exness.com/strategy/scalp-master?utm_source=talamo&utm_medium=copy&utm_campaign=dir',
  'Agresivo',
  1.7,
  27.3,
  62,
  65.2,
  1547,
  '[
    {"date": "2024-01", "value": 8.7},
    {"date": "2024-02", "value": 19.4},
    {"date": "2024-03", "value": 31.2},
    {"date": "2024-04", "value": 42.8},
    {"date": "2024-05", "value": 52.1},
    {"date": "2024-06", "value": 59.3},
    {"date": "2024-07", "value": 65.2}
  ]'::jsonb,
  'published'
);

-- Verificar inserción
SELECT 
  name,
  risk_band,
  min_investment,
  profit_factor,
  max_drawdown,
  status
FROM copy_strategies
ORDER BY created_at DESC;
