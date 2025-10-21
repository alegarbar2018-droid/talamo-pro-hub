-- Add logic_summary field to signals table for AI-synthesized version
ALTER TABLE signals 
ADD COLUMN IF NOT EXISTS logic_summary TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN signals.logic_summary IS 'AI-synthesized user-friendly version of the technical analysis logic';