-- ============================================================================
-- LMS EXPANSION PART 1: Tables, Storage, Helper Functions, RLS
-- ============================================================================

-- 1) LECCIONES CON CONTENIDO ENRIQUECIDO Y MATERIALES
-- ----------------------------------------------------------------------------
ALTER TABLE public.lms_lessons
  ADD COLUMN IF NOT EXISTS duration_min integer,
  ADD COLUMN IF NOT EXISTS content_md text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';

-- Tabla de recursos/materiales por lección
CREATE TABLE IF NOT EXISTS public.lms_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lms_lessons(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  storage_key text,
  external_url text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lms_resources_lesson_id_idx ON public.lms_resources(lesson_id, position);

-- Trigger para updated_at en lms_resources
CREATE TRIGGER update_lms_resources_updated_at
  BEFORE UPDATE ON public.lms_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2) QUIZZES AVANZADOS (MCQ, Multi-select, Boolean, Open-ended)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE quiz_question_type AS ENUM ('single', 'multi', 'boolean', 'open');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.lms_quizzes
  ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE public.lms_quiz_questions
  ADD COLUMN IF NOT EXISTS type quiz_question_type NOT NULL DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS feedback_correct text,
  ADD COLUMN IF NOT EXISTS feedback_incorrect text,
  ADD COLUMN IF NOT EXISTS open_expected text;

ALTER TABLE public.lms_quiz_attempts
  ADD COLUMN IF NOT EXISTS reviewed boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS feedback text;

-- 3) STORAGE BUCKETS
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lms-assets',
  'lms-assets',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
)
ON CONFLICT (id) DO NOTHING;

-- 4) HELPER FUNCTION PARA ADMIN CHECK
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = uid
  );
$$;

-- 5) RLS POLICIES - LMS RESOURCES
-- ----------------------------------------------------------------------------
ALTER TABLE public.lms_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all resources"
  ON public.lms_resources
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view resources of published lessons"
  ON public.lms_resources
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.lms_lessons l
      JOIN public.lms_modules m ON m.id = l.module_id
      JOIN public.lms_courses c ON c.id = m.course_id
      WHERE l.id = lms_resources.lesson_id
        AND c.status = 'published'
    )
  );

-- 6) ACTUALIZAR RLS DE LECCIONES PARA INCLUIR STATUS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view published lessons" ON public.lms_lessons;

CREATE POLICY "Anyone can view published lessons"
  ON public.lms_lessons
  FOR SELECT
  USING (
    (
      EXISTS (
        SELECT 1
        FROM lms_modules m
        JOIN lms_courses c ON c.id = m.course_id
        WHERE m.id = lms_lessons.module_id
          AND c.status = 'published'
          AND lms_lessons.status = 'published'
      )
    )
    OR public.is_admin(auth.uid())
  );

-- 7) STORAGE POLICIES - LMS BUCKET (VIDEOS)
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read published videos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'lms'
    AND (storage.foldername(name))[1] = 'public'
  );

CREATE POLICY "Admin write videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'lms'
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admin update videos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'lms'
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admin delete videos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'lms'
    AND public.is_admin(auth.uid())
  );

-- 8) STORAGE POLICIES - LMS-ASSETS BUCKET
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read published assets"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'lms-assets'
    AND (storage.foldername(name))[1] = 'public'
  );

CREATE POLICY "Admin write assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'lms-assets'
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admin update assets"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'lms-assets'
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admin delete assets"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'lms-assets'
    AND public.is_admin(auth.uid())
  );