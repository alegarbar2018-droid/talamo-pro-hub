-- Update copy_strategies status constraint to allow 'published'
ALTER TABLE copy_strategies DROP CONSTRAINT IF EXISTS copy_strategies_status_check;

ALTER TABLE copy_strategies 
ADD CONSTRAINT copy_strategies_status_check 
CHECK (status IN ('draft', 'published', 'archived'));