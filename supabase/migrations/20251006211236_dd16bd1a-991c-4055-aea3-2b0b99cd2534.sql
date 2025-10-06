-- ============================================================================
-- LMS EXPANSION PART 2: Updated Functions
-- ============================================================================

-- 1) ACTUALIZAR save_quiz_attempt PARA NUEVOS TIPOS DE PREGUNTAS
-- ----------------------------------------------------------------------------
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
  total_points integer := 0;
  earned_points integer := 0;
  score_pct integer;
  pass_score_threshold integer;
  is_passed boolean;
  attempt_id uuid;
  requires_review boolean := 0;
  answer jsonb;
  question_rec record;
  selected_options text[];
  correct_options text[];
BEGIN
  -- Get quiz pass score
  SELECT pass_score INTO pass_score_threshold
  FROM public.lms_quizzes
  WHERE id = quiz_id_param;

  IF pass_score_threshold IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quiz not found');
  END IF;

  -- Calculate total points available
  SELECT COUNT(*), COALESCE(SUM(points), 0) INTO total_questions, total_points
  FROM public.lms_quiz_questions
  WHERE quiz_id = quiz_id_param;

  -- Calculate earned points based on question type
  FOR i IN 0..(jsonb_array_length(answers_param) - 1) LOOP
    answer := answers_param->i;
    
    -- Get question details
    SELECT type, points INTO question_rec
    FROM public.lms_quiz_questions
    WHERE id = (answer->>'question_id')::uuid;

    IF question_rec.type = 'open' THEN
      -- Open-ended questions require manual review
      requires_review := true;
      CONTINUE;
    END IF;

    IF question_rec.type = 'single' OR question_rec.type = 'boolean' THEN
      -- Single choice or boolean
      IF EXISTS (
        SELECT 1 FROM public.lms_quiz_options
        WHERE id = (answer->>'option_id')::uuid AND is_correct = true
      ) THEN
        earned_points := earned_points + question_rec.points;
        correct_count := correct_count + 1;
      END IF;

    ELSIF question_rec.type = 'multi' THEN
      -- Multi-select: all correct must be selected, no incorrect selected
      selected_options := ARRAY(SELECT jsonb_array_elements_text(answer->'option_ids'));
      
      SELECT ARRAY_AGG(id::text) INTO correct_options
      FROM public.lms_quiz_options
      WHERE question_id = (answer->>'question_id')::uuid AND is_correct = true;

      -- Check if arrays match (order doesn't matter)
      IF selected_options @> correct_options AND correct_options @> selected_options THEN
        earned_points := earned_points + question_rec.points;
        correct_count := correct_count + 1;
      END IF;
    END IF;
  END LOOP;

  -- Calculate percentage
  score_pct := CASE 
    WHEN total_points > 0 THEN (earned_points * 100 / total_points) 
    ELSE 0 
  END;

  is_passed := score_pct >= pass_score_threshold AND NOT requires_review;

  -- Save attempt
  INSERT INTO public.lms_quiz_attempts (user_id, quiz_id, score, passed, answers, reviewed)
  VALUES (auth.uid(), quiz_id_param, score_pct, is_passed, answers_param, NOT requires_review)
  RETURNING id INTO attempt_id;

  -- Log event
  INSERT INTO public.course_events (user_id, course_id, verb, value, meta)
  SELECT
    auth.uid(),
    l.item_id,
    CASE 
      WHEN requires_review THEN 'quiz_submitted'
      WHEN is_passed THEN 'quiz_passed' 
      ELSE 'quiz_failed' 
    END,
    score_pct,
    jsonb_build_object(
      'quiz_id', quiz_id_param,
      'attempt_id', attempt_id,
      'score', score_pct,
      'passed', is_passed,
      'requires_review', requires_review
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
    'earned_points', earned_points,
    'total_points', total_points,
    'attempt_id', attempt_id,
    'requires_review', requires_review
  );
END;
$$;

-- 2) ACTUALIZAR get_course_tree PARA INCLUIR RECURSOS Y CONTENIDO
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_course_tree(
  course_slug_or_id text,
  requesting_user_id uuid DEFAULT NULL
)
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

  -- Get modules with lessons and resources
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
            'duration_min', l.duration_min,
            'position', l.position,
            'status', l.status,
            'content_md', l.content_md,
            'cover_image', l.cover_image,
            'video_storage_key', l.video_storage_key,
            'video_external_url', l.video_external_url,
            'quiz_id', l.quiz_id,
            'resources', (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'id', r.id,
                  'kind', r.kind,
                  'title', r.title,
                  'storage_key', r.storage_key,
                  'external_url', r.external_url,
                  'position', r.position
                ) ORDER BY r.position
              )
              FROM public.lms_resources r
              WHERE r.lesson_id = l.id
            ),
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