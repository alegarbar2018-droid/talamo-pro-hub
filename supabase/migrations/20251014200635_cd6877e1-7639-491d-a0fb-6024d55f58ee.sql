-- Add missing fields to contract_specifications
ALTER TABLE contract_specifications
ADD COLUMN IF NOT EXISTS underlying_asset TEXT,
ADD COLUMN IF NOT EXISTS base_currency TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS quote_currency TEXT;

-- Add comment for trading_hours structure
COMMENT ON COLUMN contract_specifications.trading_hours IS 
'JSON format: {"timezone": "GMT", "open": "00:00", "close": "23:59", "days": "Monday-Friday", "closed_days": []}';

-- Update existing records to have proper base_currency based on asset_class
UPDATE contract_specifications
SET base_currency = CASE
  WHEN asset_class = 'forex' THEN SUBSTRING(symbol, 1, 3)
  WHEN asset_class = 'crypto' THEN SUBSTRING(symbol, 1, 3)
  ELSE 'USD'
END
WHERE base_currency = 'USD' AND symbol IS NOT NULL;

-- Set quote_currency for forex pairs
UPDATE contract_specifications
SET quote_currency = SUBSTRING(symbol, 4, 3)
WHERE asset_class = 'forex' AND LENGTH(symbol) >= 6 AND quote_currency IS NULL;