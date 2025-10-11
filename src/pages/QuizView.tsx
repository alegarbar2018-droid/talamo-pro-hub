import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const QuizView = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: quizData, isLoading } = useQuery({
    queryKey: ['quiz-details', quizId],
    queryFn: async () => {
      const { data: quiz, error: quizError } = await supabase
        .from('lms_quizzes')
        .select('*')
        .eq('id', quizId!)
        .single();

      if (quizError) throw quizError;

      const { data: questions, error: questionsError } = await supabase
        .from('lms_quiz_questions')
        .select(`
          *,
          lms_quiz_options(*)
        `)
        .eq('quiz_id', quizId!)
        .order('position', { ascending: true });

      if (questionsError) throw questionsError;

      return { quiz, questions };
    },
    enabled: !!quizId,
  });

  const submitMutation = useMutation({
    mutationFn: async (answersData: any) => {
      const { data, error } = await supabase.rpc('save_quiz_attempt', {
        quiz_id_param: quizId!,
        answers_param: answersData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      setResult(data);
      setSubmitted(true);
      toast.success(data?.passed ? '¡Quiz aprobado!' : 'Quiz completado');
    },
    onError: () => {
      toast.error('Error al enviar el quiz');
    },
  });

  const handleSubmit = () => {
    if (!quizData) return;

    const answersArray = quizData.questions.map((q: any) => {
      const answer = answers[q.id];
      
      if (q.type === 'single' || q.type === 'boolean') {
        return {
          question_id: q.id,
          option_id: answer,
        };
      } else if (q.type === 'multi') {
        return {
          question_id: q.id,
          option_ids: answer || [],
        };
      } else if (q.type === 'open') {
        return {
          question_id: q.id,
          text_answer: answer || '',
        };
      }
    });

    submitMutation.mutate(answersArray);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background p-8">Cargando...</div>;
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Quiz no encontrado</p>
            <Button onClick={() => navigate(-1)}>Volver</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { quiz, questions } = quizData;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-muted-foreground mt-1">{quiz.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitted && result ? (
          <Card className={result.passed ? 'border-success' : 'border-destructive'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.passed ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-success" />
                    ¡Quiz Aprobado!
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-destructive" />
                    Quiz No Aprobado
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Puntaje: {result.score}% (Mínimo requerido: {quiz.pass_score}%)</p>
                <p>Respuestas correctas: {result.correct} de {result.total}</p>
                {result.requires_review && (
                  <p className="text-amber-600">
                    Tu respuesta está pendiente de revisión por un instructor.
                  </p>
                )}
              </div>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Volver al curso
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {questions.map((question: any, index: number) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pregunta {index + 1} ({question.points} punto{question.points > 1 ? 's' : ''})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{question.question}</p>

                  {question.type === 'single' && (
                    <RadioGroup
                      value={answers[question.id]}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, [question.id]: value })
                      }
                    >
                      {question.lms_quiz_options?.map((option: any) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id}>{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === 'multi' && (
                    <div className="space-y-2">
                      {question.lms_quiz_options?.map((option: any) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={(answers[question.id] || []).includes(option.id)}
                            onCheckedChange={(checked) => {
                              const current = answers[question.id] || [];
                              if (checked) {
                                setAnswers({
                                  ...answers,
                                  [question.id]: [...current, option.id],
                                });
                              } else {
                                setAnswers({
                                  ...answers,
                                  [question.id]: current.filter((id: string) => id !== option.id),
                                });
                              }
                            }}
                          />
                          <Label htmlFor={option.id}>{option.text}</Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'boolean' && (
                    <RadioGroup
                      value={answers[question.id]}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, [question.id]: value })
                      }
                    >
                      {question.lms_quiz_options?.map((option: any) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id}>{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === 'open' && (
                    <Textarea
                      value={answers[question.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question.id]: e.target.value })
                      }
                      placeholder="Escribe tu respuesta aquí..."
                      rows={4}
                    />
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
              size="lg"
            >
              {submitMutation.isPending ? 'Enviando...' : 'Enviar Quiz'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
