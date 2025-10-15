-- Actualizar tabla copy_strategies con campos requeridos
ALTER TABLE copy_strategies
  DROP COLUMN IF EXISTS account_type,
  DROP COLUMN IF EXISTS strategy_equity,
  DROP COLUMN IF EXISTS leverage,
  DROP COLUMN IF EXISTS billing_period,
  DROP COLUMN IF EXISTS performance_fee,
  DROP COLUMN IF EXISTS external_link,
  DROP COLUMN IF EXISTS strategy_link;

-- Agregar campos nuevos/renombrados
ALTER TABLE copy_strategies
  ADD COLUMN account_type text NOT NULL DEFAULT 'Social Standard' CHECK (account_type IN ('Social Standard', 'Pro')),
  ADD COLUMN strategy_equity numeric NOT NULL DEFAULT 0,
  ADD COLUMN leverage integer NOT NULL DEFAULT 100,
  ADD COLUMN billing_period text NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('weekly', 'monthly', 'quarterly')),
  ADD COLUMN performance_fee_pct numeric NOT NULL DEFAULT 20 CHECK (performance_fee_pct >= 0 AND performance_fee_pct <= 100),
  ADD COLUMN strategy_link text NOT NULL DEFAULT '',
  ADD COLUMN risk_band text GENERATED ALWAYS AS (
    CASE
      WHEN max_drawdown <= 15 THEN 'conservative'
      WHEN max_drawdown <= 25 THEN 'moderate'
      ELSE 'aggressive'
    END
  ) STORED;

-- Actualizar RLS policies
DROP POLICY IF EXISTS "Anyone authenticated can view active strategies" ON copy_strategies;

CREATE POLICY "Anyone can view published strategies"
ON copy_strategies FOR SELECT
USING (status = 'published' OR has_admin_permission('copy', 'manage'));

-- Comentarios para documentación
COMMENT ON COLUMN copy_strategies.account_type IS 'Tipo de cuenta del trader en Exness: Social Standard o Pro';
COMMENT ON COLUMN copy_strategies.strategy_equity IS 'Equity actual del trader en USD';
COMMENT ON COLUMN copy_strategies.leverage IS 'Apalancamiento utilizado por la estrategia';
COMMENT ON COLUMN copy_strategies.billing_period IS 'Periodo de facturación del performance fee';
COMMENT ON COLUMN copy_strategies.performance_fee_pct IS 'Porcentaje de fee sobre ganancias (0-100)';
COMMENT ON COLUMN copy_strategies.strategy_link IS 'Link para acceder a la estrategia en Exness';
COMMENT ON COLUMN copy_strategies.risk_band IS 'Banda de riesgo calculada automáticamente basada en max_drawdown';