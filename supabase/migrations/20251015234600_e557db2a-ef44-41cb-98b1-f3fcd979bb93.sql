-- Add direction column to signals table
ALTER TABLE public.signals 
ADD COLUMN direction TEXT 
CHECK (direction IN ('long', 'short'));

-- Create index for performance
CREATE INDEX idx_signals_direction ON public.signals(direction);

-- Populate existing records from audit_trail
UPDATE public.signals 
SET direction = CASE 
  WHEN audit_trail->>'action' = 'BUY' THEN 'long'
  WHEN audit_trail->>'action' = 'SELL' THEN 'short'
  ELSE NULL
END
WHERE direction IS NULL AND audit_trail IS NOT NULL;