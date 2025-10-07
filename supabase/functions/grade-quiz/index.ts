import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Answer {
  question_id: string;
  option_id?: string;
  text_answer?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { quiz_id, answers } = await req.json() as { quiz_id: string; answers: Answer[] };

    // Get quiz details
    const { data: quiz, error: quizError } = await supabaseClient
      .from('lms_quizzes')
      .select('*, lms_quiz_questions(*, lms_quiz_options(*))')
      .eq('id', quiz_id)
      .single();

    if (quizError || !quiz) {
      throw new Error('Quiz not found');
    }

    // Check attempt limit
    if (quiz.attempt_limit) {
      const { count } = await supabaseClient
        .from('lms_quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quiz_id)
        .eq('user_id', user.id);

      if (count && count >= quiz.attempt_limit) {
        return new Response(
          JSON.stringify({ error: 'Attempt limit reached' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    // Grade answers
    let correctCount = 0;
    const gradedAnswers: any[] = [];
    const questions = quiz.lms_quiz_questions || [];

    for (const answer of answers) {
      const question = questions.find((q: any) => q.id === answer.question_id);
      if (!question) continue;

      let isCorrect = false;

      if (question.type === 'boolean' || question.type === 'single') {
        const correctOption = question.lms_quiz_options?.find((opt: any) => opt.is_correct);
        isCorrect = answer.option_id === correctOption?.id;
      } else if (question.type === 'multi') {
        // For multi-select, all correct options must be selected
        const correctOptions = question.lms_quiz_options?.filter((opt: any) => opt.is_correct) || [];
        const selectedOptions = answers
          .filter(a => a.question_id === question.id)
          .map(a => a.option_id);
        
        isCorrect = correctOptions.length === selectedOptions.length &&
          correctOptions.every((opt: any) => selectedOptions.includes(opt.id));
      } else if (question.type === 'open') {
        // For open questions, require manual review or exact match
        isCorrect = answer.text_answer?.toLowerCase().trim() === question.open_expected?.toLowerCase().trim();
      }

      if (isCorrect) correctCount++;

      gradedAnswers.push({
        question_id: answer.question_id,
        option_id: answer.option_id,
        text_answer: answer.text_answer,
        is_correct: isCorrect,
      });
    }

    // Calculate score
    const score = Math.round((correctCount / questions.length) * 100);
    const isPassed = score >= (quiz.pass_score || 70);

    // Create attempt
    const { data: attempt, error: attemptError } = await supabaseClient
      .from('lms_quiz_attempts')
      .insert({
        quiz_id,
        user_id: user.id,
        score,
        passed: isPassed,
        answers: answers,
        reviewed: true,
      })
      .select()
      .single();

    if (attemptError) {
      throw attemptError;
    }

    // Save individual answers
    const answersToInsert = gradedAnswers.map(a => ({
      ...a,
      attempt_id: attempt.id,
    }));

    await supabaseClient
      .from('lms_answers')
      .insert(answersToInsert);

    // If passed, mark lesson as completed
    if (isPassed) {
      const { data: lesson } = await supabaseClient
        .from('lms_lessons')
        .select('module_id, position')
        .eq('quiz_id', quiz_id)
        .single();

      if (lesson) {
        const { data: course } = await supabaseClient
          .from('lms_modules')
          .select('course_id')
          .eq('id', lesson.module_id)
          .single();

        if (course) {
          await supabaseClient
            .from('user_progress')
            .upsert({
              user_id: user.id,
              course_id: course.course_id,
              module_id: lesson.module_id,
              item_kind: 'quiz',
              item_id: quiz_id,
              status: 'completed',
              completed_at: new Date().toISOString(),
            });
        }
      }
    }

    return new Response(
      JSON.stringify({
        score,
        is_passed: isPassed,
        correct: correctCount,
        total: questions.length,
        attempt_id: attempt.id,
        corrections: gradedAnswers,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in grade-quiz:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});