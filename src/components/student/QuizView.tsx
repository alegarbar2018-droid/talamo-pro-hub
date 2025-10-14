import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  question: string;
  position: number;
  points: number;
  feedback_correct?: string;
  feedback_incorrect?: string;
  lms_quiz_options: Array<{
    id: string;
    text: string;
    is_correct: boolean;
    question_id?: string;
    created_at?: string;
  }>;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  pass_score: number;
  attempt_limit?: number;
  shuffle_questions: boolean;
  lms_quiz_questions: Question[];
}

interface QuizViewProps {
  quizId: string;
  lessonId?: string;
  onComplete?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quizId, lessonId, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
    fetchAttempts();
  }, [quizId]);

  const fetchQuiz = async () => {
    const { data, error } = await supabase
      .from('lms_quizzes')
      .select(`
        *,
        lms_quiz_questions(*, lms_quiz_options(*))
      `)
      .eq('id', quizId)
      .single();

    if (error) {
      toast.error('Failed to load quiz');
      return;
    }

    setQuiz(data);

    let qs = data.lms_quiz_questions || [];
    qs.sort((a, b) => a.position - b.position);

    if (data.shuffle_questions) {
      qs = qs.sort(() => Math.random() - 0.5);
    }

    setQuestions(qs);
  };

  const fetchAttempts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from('lms_quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', quizId)
      .eq('user_id', user.id);

    setAttempts(count || 0);
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions');
      return;
    }

    if (quiz?.attempt_limit && attempts >= quiz.attempt_limit) {
      toast.error('You have reached the maximum number of attempts');
      return;
    }

    setIsSubmitting(true);

    // Format answers for save_quiz_attempt RPC
    const answersArray = Object.entries(answers).map(([questionId, value]) => {
      if (typeof value === 'string') {
        // Single choice or boolean - single option_id
        return { question_id: questionId, option_id: value };
      } else if (Array.isArray(value)) {
        // Multi-choice - array of option_ids
        return { question_id: questionId, option_ids: value };
      } else {
        // Open-ended - text answer
        return { question_id: questionId, text_answer: value };
      }
    });

    const { data, error } = await supabase.rpc('save_quiz_attempt', {
      quiz_id_param: quizId,
      answers_param: answersArray,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to submit quiz', { description: error.message });
      return;
    }

    // Type assertion for RPC response
    const result = data as any;

    // Map RPC response to component state
    setResult({
      ...result,
      is_passed: result.passed,
      correct: result.correct,
      total: result.total,
    });

    if (result.passed) {
      toast.success(`Quiz passed! Score: ${result.score}%`);
      
      // Emit custom event for auto-tracking
      window.dispatchEvent(new CustomEvent('quiz-completed'));
      
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    } else {
      toast.error(`Quiz not passed. Score: ${result.score}%`);
    }
  };

  if (!quiz) {
    return <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (quiz.attempt_limit && attempts >= quiz.attempt_limit) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Attempt Limit Reached</h2>
            <p className="text-muted-foreground">
              You have reached the maximum number of attempts ({quiz.attempt_limit}) for this quiz.
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {result.is_passed ? (
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 mx-auto text-destructive" />
            )}
            <h2 className="text-2xl font-bold">
              {result.is_passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
            </h2>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{result.score}%</p>
              <p className="text-muted-foreground">
                {result.correct} out of {result.total} correct
              </p>
              {!result.is_passed && quiz.attempt_limit && (
                <p className="text-sm text-muted-foreground">
                  Attempts: {attempts + 1} / {quiz.attempt_limit}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              {result.is_passed && onComplete && (
                <Button onClick={onComplete}>Continue</Button>
              )}
              {!result.is_passed && (!quiz.attempt_limit || attempts + 1 < quiz.attempt_limit) && (
                <Button onClick={() => {
                  setResult(null);
                  setAnswers({});
                  fetchAttempts();
                }}>
                  Try Again
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Pass Score: {quiz.pass_score}%</p>
            {quiz.attempt_limit && (
              <p>Attempts: {attempts} / {quiz.attempt_limit}</p>
            )}
          </div>
        </CardHeader>
      </Card>

      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {index + 1} ({question.points} {question.points === 1 ? 'point' : 'points'})
            </CardTitle>
            <p>{question.question}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === 'single' || question.type === 'boolean' ? (
              <RadioGroup
                value={answers[question.id]}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.lms_quiz_options
                  .map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            ) : question.type === 'multi' ? (
              <div className="space-y-2">
                {question.lms_quiz_options
                  .map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={answers[question.id]?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          const current = answers[question.id] || [];
                          if (checked) {
                            handleAnswer(question.id, [...current, option.id]);
                          } else {
                            handleAnswer(
                              question.id,
                              current.filter((id: string) => id !== option.id)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
              </div>
            ) : question.type === 'open' ? (
              <Textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Quiz
        </Button>
      </div>
    </div>
  );
};