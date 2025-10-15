-- Add source enum type and dedup_key column to signals table
-- This enables MT5 EA signal ingestion with idempotency

-- Create source enum if not exists
DO $$ BEGIN
  CREATE TYPE signal_source AS ENUM ('manual', 'mt5_ea', 'api');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add source column (default 'manual' for existing records)
ALTER TABLE public.signals 
ADD COLUMN IF NOT EXISTS source signal_source NOT NULL DEFAULT 'manual';

-- Add dedup_key column for idempotency
ALTER TABLE public.signals 
ADD COLUMN IF NOT EXISTS dedup_key TEXT;

-- Create unique index on dedup_key for idempotency enforcement
CREATE UNIQUE INDEX IF NOT EXISTS signals_dedup_key_idx 
ON public.signals(dedup_key) 
WHERE dedup_key IS NOT NULL;

-- Add index on source for filtering
CREATE INDEX IF NOT EXISTS signals_source_idx 
ON public.signals(source);

-- Comment for documentation
COMMENT ON COLUMN public.signals.dedup_key IS 'Idempotency key from MT5 EA or external systems';
COMMENT ON COLUMN public.signals.source IS 'Origin of the signal: manual (admin), mt5_ea (Expert Advisor), or api (external)';