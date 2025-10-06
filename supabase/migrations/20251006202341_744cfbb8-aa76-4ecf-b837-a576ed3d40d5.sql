-- ============================================================================
-- LMS COMPLETE SYSTEM: Courses, Modules, Lessons, Quizzes
-- ============================================================================

-- 1. STORAGE BUCKET para videos y recursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lms',
  'lms',
  true,
  104857600, -- 100MB
  ARRAY['video/mp4', 'video/webm', 'application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies para bucket lms
CREATE POLICY "Public can view published LMS files"
ON storage.objects FOR SELECT
USING (bucket_id = 'lms');

CREATE POLICY "Admins can upload LMS files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lms' AND
  has_admin_permission('lms', 'manage')
);

CREATE POLICY "Admins can update LMS files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lms' AND
  has_admin_permission('lms', 'manage')
);

CREATE POLICY "Admins can delete LMS files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lms' AND
  has_admin_permission('lms', 'manage')
);

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Cursos (conectados a course_items)
CREATE TABLE public.lms_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL UNIQUE REFERENCES public.course_items(id) ON DELETE CASCADE,
  slug text UNIQUE,
  level integer DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Módulos/Temas
CREATE TABLE public.lms_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.lms_courses(id) ON DELETE CASCADE,
  item_id uuid NOT NULL UNIQUE REFERENCES public.course_items(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Lecciones/Subtemas
CREATE TABLE public.lms_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.lms_modules(id) ON DELETE CASCADE,
  item_id uuid NOT NULL UNIQUE REFERENCES public.course_items(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  video_storage_key text,
  video_external_url text,
  resources jsonb DEFAULT '[]'::jsonb,
  quiz_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Quizzes
CREATE TABLE public.lms_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  pass_score integer NOT NULL DEFAULT 70,
  time_limit_sec integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Preguntas de quiz
CREATE TABLE public.lms_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.lms_quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Opciones de preguntas
CREATE TABLE public.lms_quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.lms_quiz_questions(id) ON DELETE CASCADE,
  text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Intentos de quiz
CREATE TABLE public.lms_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_id uuid NOT NULL REFERENCES public.lms_quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Agregar foreign key para quiz en lessons
ALTER TABLE public.lms_lessons
ADD CONSTRAINT fk_lms_lessons_quiz
FOREIGN KEY (quiz_id) REFERENCES public.lms_quizzes(id) ON DELETE SET NULL;

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX idx_lms_courses_status ON public.lms_courses(status);
CREATE INDEX idx_lms_courses_level ON public.lms_courses(level);
CREATE INDEX idx_lms_modules_course ON public.lms_modules(course_id, position);
CREATE INDEX idx_lms_lessons_module ON public.lms_lessons(module_id, position);
CREATE INDEX idx_lms_quiz_questions_quiz ON public.lms_quiz_questions(quiz_id, position);
CREATE INDEX idx_lms_quiz_options_question ON public.lms_quiz_options(question_id);
CREATE INDEX idx_lms_quiz_attempts_user ON public.lms_quiz_attempts(user_id, quiz_id);

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================

-- lms_courses
ALTER TABLE public.lms_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
ON public.lms_courses FOR SELECT
USING (status = 'published' OR has_admin_permission('lms', 'read'));

CREATE POLICY "Admins can manage courses"
ON public.lms_courses FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- lms_modules
ALTER TABLE public.lms_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published modules"
ON public.lms_modules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lms_courses
    WHERE id = lms_modules.course_id
    AND status = 'published'
  ) OR has_admin_permission('lms', 'read')
);

CREATE POLICY "Admins can manage modules"
ON public.lms_modules FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- lms_lessons
ALTER TABLE public.lms_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published lessons"
ON public.lms_lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lms_modules m
    JOIN public.lms_courses c ON c.id = m.course_id
    WHERE m.id = lms_lessons.module_id
    AND c.status = 'published'
  ) OR has_admin_permission('lms', 'read')
);

CREATE POLICY "Admins can manage lessons"
ON public.lms_lessons FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- lms_quizzes
ALTER TABLE public.lms_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quizzes"
ON public.lms_quizzes FOR SELECT
USING (true);

CREATE POLICY "Admins can manage quizzes"
ON public.lms_quizzes FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- lms_quiz_questions
ALTER TABLE public.lms_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
ON public.lms_quiz_questions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage quiz questions"
ON public.lms_quiz_questions FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- lms_quiz_options
ALTER TABLE public.lms_quiz_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz options"
ON public.lms_quiz_options FOR SELECT
USING (true);

CREATE POLICY "Admins can manage quiz options"
ON public.lms_quiz_options FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- lms_quiz_attempts
ALTER TABLE public.lms_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts"
ON public.lms_quiz_attempts FOR SELECT
USING (auth.uid() = user_id OR has_admin_permission('lms', 'read'));

CREATE POLICY "Users can create their own attempts"
ON public.lms_quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts"
ON public.lms_quiz_attempts FOR ALL
USING (has_admin_permission('lms', 'manage'));

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

CREATE TRIGGER update_lms_courses_updated_at
BEFORE UPDATE ON public.lms_courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lms_modules_updated_at
BEFORE UPDATE ON public.lms_modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lms_lessons_updated_at
BEFORE UPDATE ON public.lms_lessons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lms_quizzes_updated_at
BEFORE UPDATE ON public.lms_quizzes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Obtener árbol completo de un curso con progreso del usuario
CREATE OR REPLACE FUNCTION public.get_course_tree(course_slug_or_id text, requesting_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_data jsonb;
  modules_data jsonb;
BEGIN
  -- Get course info
  SELECT jsonb_build_object(
    'id', c.id,
    'slug', c.slug,
    'level', c.level,
    'status', c.status,
    'title', ci.title,
    'duration_min', ci.duration_min,
    'tags', ci.tags,
    'created_at', c.created_at
  )
  INTO course_data
  FROM public.lms_courses c
  JOIN public.course_items ci ON ci.id = c.item_id
  WHERE c.slug = course_slug_or_id OR c.id::text = course_slug_or_id;

  IF course_data IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get modules with lessons
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'title', mi.title,
      'position', m.position,
      'lessons', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', l.id,
            'title', li.title,
            'duration_min', li.duration_min,
            'position', l.position,
            'video_storage_key', l.video_storage_key,
            'video_external_url', l.video_external_url,
            'resources', l.resources,
            'quiz_id', l.quiz_id,
            'completed', CASE
              WHEN requesting_user_id IS NOT NULL THEN
                EXISTS(
                  SELECT 1 FROM public.course_events ce
                  WHERE ce.user_id = requesting_user_id
                  AND ce.course_id = l.item_id
                  AND ce.verb = 'completed'
                )
              ELSE false
            END
          ) ORDER BY l.position
        )
        FROM public.lms_lessons l
        JOIN public.course_items li ON li.id = l.item_id
        WHERE l.module_id = m.id
      )
    ) ORDER BY m.position
  )
  INTO modules_data
  FROM public.lms_modules m
  JOIN public.course_items mi ON mi.id = m.item_id
  WHERE m.course_id = (course_data->>'id')::uuid;

  RETURN jsonb_build_object(
    'course', course_data,
    'modules', COALESCE(modules_data, '[]'::jsonb)
  );
END;
$$;

-- Marcar lección como completada
CREATE OR REPLACE FUNCTION public.mark_lesson_complete(lesson_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lesson_item_id uuid;
  existing_event uuid;
BEGIN
  -- Get lesson's course_item id
  SELECT item_id INTO lesson_item_id
  FROM public.lms_lessons
  WHERE id = lesson_id_param;

  IF lesson_item_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Lesson not found');
  END IF;

  -- Check if already completed
  SELECT id INTO existing_event
  FROM public.course_events
  WHERE user_id = auth.uid()
  AND course_id = lesson_item_id
  AND verb = 'completed'
  LIMIT 1;

  IF existing_event IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already completed');
  END IF;

  -- Insert completion event
  INSERT INTO public.course_events (user_id, course_id, verb, value, meta)
  VALUES (
    auth.uid(),
    lesson_item_id,
    'completed',
    100,
    jsonb_build_object('lesson_id', lesson_id_param, 'completed_at', now())
  );

  RETURN jsonb_build_object('success', true, 'message', 'Lesson marked as complete');
END;
$$;

-- Guardar intento de quiz
CREATE OR REPLACE FUNCTION public.save_quiz_attempt(
  quiz_id_param uuid,
  answers_param jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  correct_count integer := 0;
  total_questions integer := 0;
  score_pct integer;
  pass_score_threshold integer;
  is_passed boolean;
  attempt_id uuid;
BEGIN
  -- Get quiz pass score
  SELECT pass_score INTO pass_score_threshold
  FROM public.lms_quizzes
  WHERE id = quiz_id_param;

  IF pass_score_threshold IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quiz not found');
  END IF;

  -- Calculate score
  SELECT COUNT(*) INTO total_questions
  FROM public.lms_quiz_questions
  WHERE quiz_id = quiz_id_param;

  -- Count correct answers
  SELECT COUNT(*) INTO correct_count
  FROM jsonb_array_elements(answers_param) AS answer
  WHERE EXISTS (
    SELECT 1 FROM public.lms_quiz_options
    WHERE id = (answer->>'option_id')::uuid
    AND is_correct = true
  );

  score_pct := CASE WHEN total_questions > 0 THEN (correct_count * 100 / total_questions) ELSE 0 END;
  is_passed := score_pct >= pass_score_threshold;

  -- Save attempt
  INSERT INTO public.lms_quiz_attempts (user_id, quiz_id, score, passed, answers)
  VALUES (auth.uid(), quiz_id_param, score_pct, is_passed, answers_param)
  RETURNING id INTO attempt_id;

  -- Log event
  INSERT INTO public.course_events (user_id, course_id, verb, value, meta)
  SELECT
    auth.uid(),
    l.item_id,
    CASE WHEN is_passed THEN 'quiz_passed' ELSE 'quiz_failed' END,
    score_pct,
    jsonb_build_object(
      'quiz_id', quiz_id_param,
      'attempt_id', attempt_id,
      'score', score_pct,
      'passed', is_passed
    )
  FROM public.lms_lessons l
  WHERE l.quiz_id = quiz_id_param
  LIMIT 1;

  RETURN jsonb_build_object(
    'success', true,
    'score', score_pct,
    'passed', is_passed,
    'correct', correct_count,
    'total', total_questions,
    'attempt_id', attempt_id
  );
END;
$$;