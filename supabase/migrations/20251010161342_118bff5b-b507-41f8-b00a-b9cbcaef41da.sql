-- Add position column to lms_quizzes
ALTER TABLE public.lms_quizzes 
ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;

-- Add module_id to lms_quizzes if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lms_quizzes' AND column_name='module_id') THEN
    ALTER TABLE public.lms_quizzes 
    ADD COLUMN module_id UUID REFERENCES public.lms_modules(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add status to lms_quizzes if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lms_quizzes' AND column_name='status') THEN
    ALTER TABLE public.lms_quizzes 
    ADD COLUMN status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
  END IF;
END $$;