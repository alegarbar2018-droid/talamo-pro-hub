-- Add position column to lms_quiz_options for ordering
ALTER TABLE public.lms_quiz_options 
ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;