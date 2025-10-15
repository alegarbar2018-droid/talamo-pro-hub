-- Create function to calculate signals historical performance (last 30 days)
CREATE OR REPLACE FUNCTION public.calculate_signals_performance()
RETURNS TABLE(
  win_rate NUMERIC,
  avg_rr NUMERIC,
  total_signals INTEGER,
  simulated_return NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_count INTEGER;
  win_count INTEGER;
  avg_risk_reward NUMERIC;
  sim_return NUMERIC;
BEGIN
  -- Count total signals in last 30 days
  SELECT COUNT(*) INTO total_count
  FROM signals
  WHERE status = 'published'
    AND published_at >= NOW() - INTERVAL '30 days';

  -- Count winning signals (TP reached)
  SELECT COUNT(*) INTO win_count
  FROM signals
  WHERE status = 'published'
    AND result = 'tp_hit'
    AND published_at >= NOW() - INTERVAL '30 days';

  -- Average R:R ratio
  SELECT AVG(rr) INTO avg_risk_reward
  FROM signals
  WHERE status = 'published'
    AND published_at >= NOW() - INTERVAL '30 days'
    AND rr IS NOT NULL;

  -- Simulated return (assuming 1R per trade, 1% risk per trade)
  -- Return = (wins * avg_rr * 1%) - (losses * 1%)
  sim_return := (win_count * COALESCE(avg_risk_reward, 0) * 0.01) - 
                ((total_count - win_count) * 0.01);

  RETURN QUERY SELECT
    CASE WHEN total_count > 0 
      THEN ROUND((win_count::NUMERIC / total_count::NUMERIC) * 100, 1)
      ELSE 0 
    END,
    ROUND(COALESCE(avg_risk_reward, 0), 2),
    total_count,
    ROUND(sim_return * 100, 2); -- Return as percentage
END;
$$;

COMMENT ON FUNCTION public.calculate_signals_performance() IS 
'Calculate historical performance metrics for published signals in the last 30 days';