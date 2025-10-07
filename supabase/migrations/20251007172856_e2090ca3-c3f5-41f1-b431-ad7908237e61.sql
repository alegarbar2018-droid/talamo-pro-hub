-- Create user_progress table for tracking student completion
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.lms_courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.lms_modules(id) ON DELETE CASCADE,
  item_kind TEXT NOT NULL CHECK (item_kind IN ('lesson', 'quiz')),
  item_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_kind, item_id)
);

-- Create lms_answers table for storing individual quiz answers
CREATE TABLE IF NOT EXISTS public.lms_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.lms_quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.lms_quiz_questions(id) ON DELETE CASCADE,
  option_id UUID REFERENCES public.lms_quiz_options(id),
  text_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add attempt_limit and shuffle_questions to lms_quizzes if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lms_quizzes' AND column_name='attempt_limit') THEN
    ALTER TABLE public.lms_quizzes ADD COLUMN attempt_limit INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lms_quizzes' AND column_name='shuffle_questions') THEN
    ALTER TABLE public.lms_quizzes ADD COLUMN shuffle_questions BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON public.user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_answers_attempt ON public.lms_answers(attempt_id);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
ON public.user_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON public.user_progress FOR SELECT
TO authenticated
USING (has_admin_permission('lms', 'read'));

-- RLS Policies for lms_answers
CREATE POLICY "Users can view their own answers"
ON public.lms_answers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.lms_quiz_attempts
    WHERE lms_quiz_attempts.id = lms_answers.attempt_id
    AND lms_quiz_attempts.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert answers"
ON public.lms_answers FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.lms_quiz_attempts
    WHERE lms_quiz_attempts.id = lms_answers.attempt_id
    AND lms_quiz_attempts.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all answers"
ON public.lms_answers FOR SELECT
TO authenticated
USING (has_admin_permission('lms', 'read'));

-- Function to get next item in course
CREATE OR REPLACE FUNCTION public.get_next_item(
  p_course_id UUID,
  p_current_module_id UUID,
  p_current_position INTEGER,
  p_current_kind TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_item JSONB;
  current_module_position INTEGER;
BEGIN
  -- Get current module position
  SELECT position INTO current_module_position
  FROM lms_modules
  WHERE id = p_current_module_id;

  -- Try to find next item in same module
  IF p_current_kind = 'lesson' THEN
    SELECT jsonb_build_object(
      'kind', 'lesson',
      'id', l.id,
      'module_id', l.module_id,
      'position', l.position
    ) INTO next_item
    FROM lms_lessons l
    WHERE l.module_id = p_current_module_id
    AND l.position > p_current_position
    ORDER BY l.position ASC
    LIMIT 1;
  END IF;

  -- If no next lesson, try first quiz or lesson in next module
  IF next_item IS NULL THEN
    SELECT jsonb_build_object(
      'kind', 'lesson',
      'id', l.id,
      'module_id', m.id,
      'position', l.position
    ) INTO next_item
    FROM lms_modules m
    JOIN lms_lessons l ON l.module_id = m.id
    WHERE m.course_id = p_course_id
    AND m.position > current_module_position
    ORDER BY m.position ASC, l.position ASC
    LIMIT 1;
  END IF;

  RETURN next_item;
END;
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_user_progress_updated_at();