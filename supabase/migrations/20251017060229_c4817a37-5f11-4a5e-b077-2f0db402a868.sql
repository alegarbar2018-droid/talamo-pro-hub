-- Tabla para videos tutoriales del onboarding
CREATE TABLE IF NOT EXISTS onboarding_tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutorial_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE onboarding_tutorials ENABLE ROW LEVEL SECURITY;

-- Public puede leer videos activos
CREATE POLICY "Public can view active tutorials"
  ON onboarding_tutorials
  FOR SELECT
  USING (is_active = true);

-- Solo admins pueden gestionar
CREATE POLICY "Admins can manage tutorials"
  ON onboarding_tutorials
  FOR ALL
  USING (get_current_admin_role() = 'ADMIN');

-- Índices
CREATE INDEX idx_onboarding_tutorials_key ON onboarding_tutorials(tutorial_key);
CREATE INDEX idx_onboarding_tutorials_active ON onboarding_tutorials(is_active);

-- Trigger para updated_at
CREATE TRIGGER update_onboarding_tutorials_updated_at
  BEFORE UPDATE ON onboarding_tutorials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabla para tracking de eventos del onboarding
CREATE TABLE IF NOT EXISTS onboarding_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  step_name TEXT NOT NULL,
  step_number INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX idx_onboarding_analytics_session ON onboarding_analytics(session_id);
CREATE INDEX idx_onboarding_analytics_user ON onboarding_analytics(user_id);
CREATE INDEX idx_onboarding_analytics_step ON onboarding_analytics(step_name);
CREATE INDEX idx_onboarding_analytics_event ON onboarding_analytics(event_type);
CREATE INDEX idx_onboarding_analytics_created ON onboarding_analytics(created_at DESC);

-- RLS: Solo admins pueden ver
ALTER TABLE onboarding_analytics ENABLE ROW LEVEL SECURITY;

-- Admins pueden ver analytics
CREATE POLICY "Admins can view analytics"
  ON onboarding_analytics
  FOR SELECT
  USING (get_current_admin_role() = 'ADMIN');

-- Cualquier usuario puede insertar sus propios eventos
CREATE POLICY "Users can insert own analytics"
  ON onboarding_analytics
  FOR INSERT
  WITH CHECK (true);

-- Función para obtener métricas agregadas eficientemente
CREATE OR REPLACE FUNCTION get_onboarding_step_metrics()
RETURNS TABLE (
  step_name TEXT,
  step_number INTEGER,
  total_views BIGINT,
  total_completes BIGINT,
  total_exits BIGINT,
  avg_time_spent_seconds NUMERIC,
  completion_rate NUMERIC,
  drop_off_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH step_stats AS (
    SELECT 
      oa.step_name,
      oa.step_number,
      COUNT(*) FILTER (WHERE oa.event_type = 'step_view') AS views,
      COUNT(*) FILTER (WHERE oa.event_type = 'step_complete') AS completes,
      COUNT(*) FILTER (WHERE oa.event_type = 'step_exit') AS exits,
      AVG(CAST(oa.metadata->>'time_spent_ms' AS NUMERIC)) / 1000 AS avg_time
    FROM onboarding_analytics oa
    WHERE oa.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY oa.step_name, oa.step_number
  )
  SELECT
    ss.step_name,
    ss.step_number,
    ss.views,
    ss.completes,
    ss.exits,
    COALESCE(ss.avg_time, 0),
    CASE WHEN ss.views > 0 THEN (ss.completes::NUMERIC / ss.views::NUMERIC) * 100 ELSE 0 END AS completion_rate,
    CASE WHEN ss.views > 0 THEN (ss.exits::NUMERIC / ss.views::NUMERIC) * 100 ELSE 0 END AS drop_off_rate
  FROM step_stats ss
  ORDER BY ss.step_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;