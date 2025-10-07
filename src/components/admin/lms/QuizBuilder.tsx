import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  position: z.number().min(0),
  pass_score: z.number().min(0).max(100),
  attempt_limit: z.number().nullable(),
  shuffle_questions: z.boolean(),
  status: z.string(),
});

type QuizFormValues = z.infer<typeof quizSchema>;

interface Question {
  id?: string;
  type: 'single' | 'multi' | 'boolean' | 'open';
  question: string;
  position: number;
  points: number;
  feedback_correct?: string;
  feedback_incorrect?: string;
  open_expected?: string;
  options: Option[];
}

interface Option {
  id?: string;
  text: string;
  is_correct: boolean;
  position: number;
}

interface QuizBuilderProps {
  moduleId: string;
  onSuccess: () => void;
  onCancel: () => void;
  quiz?: any;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ moduleId, onSuccess, onCancel, quiz }) => {
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title || '',
      position: quiz?.position || 0,
      pass_score: quiz?.pass_score || 70,
      attempt_limit: quiz?.attempt_limit || null,
      shuffle_questions: quiz?.shuffle_questions || false,
      status: quiz?.status || 'draft',
    },
  });

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'single',
        question: '',
        position: questions.length,
        points: 1,
        options: [
          { text: '', is_correct: true, position: 0 },
          { text: '', is_correct: false, position: 1 },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({
      text: '',
      is_correct: false,
      position: updated[questionIndex].options.length,
    });
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: any) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const onSubmit = async (data: QuizFormValues) => {
    if (questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create or update quiz
      const quizData: any = {
        module_id: moduleId,
        title: data.title,
        position: data.position,
        pass_score: data.pass_score,
        attempt_limit: data.attempt_limit,
        shuffle_questions: data.shuffle_questions,
        status: data.status,
      };

      let quizId = quiz?.id;

      if (quiz?.id) {
        const { error } = await supabase
          .from('lms_quizzes')
          .update(quizData)
          .eq('id', quiz.id);

        if (error) throw error;
      } else {
        const { data: newQuiz, error } = await supabase
          .from('lms_quizzes')
          .insert([quizData])
          .select()
          .single();

        if (error) throw error;
        quizId = newQuiz.id;
      }

      // Delete existing questions if editing
      if (quiz?.id) {
        await supabase
          .from('lms_quiz_questions')
          .delete()
          .eq('quiz_id', quiz.id);
      }

      // Insert questions
      for (const question of questions) {
        const { data: questionData, error: questionError } = await supabase
          .from('lms_quiz_questions')
          .insert({
            quiz_id: quizId,
            type: question.type,
            question: question.question,
            position: question.position,
            points: question.points,
            feedback_correct: question.feedback_correct,
            feedback_incorrect: question.feedback_incorrect,
            open_expected: question.open_expected,
          })
          .select()
          .single();

        if (questionError) throw questionError;

        // Insert options for this question (except for open questions)
        if (question.type !== 'open' && question.options.length > 0) {
          const optionsToInsert = question.options.map(opt => ({
            question_id: questionData.id,
            text: opt.text,
            is_correct: opt.is_correct,
            position: opt.position,
          }));

          const { error: optionsError } = await supabase
            .from('lms_quiz_options')
            .insert(optionsToInsert);

          if (optionsError) throw optionsError;
        }
      }

      toast.success(quiz?.id ? 'Quiz updated successfully' : 'Quiz created successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      toast.error(error.message || 'Failed to save quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input {...form.register('title')} />
        </div>
        <div>
          <Label>Position</Label>
          <Input type="number" {...form.register('position', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Pass Score (%)</Label>
          <Input type="number" min="0" max="100" {...form.register('pass_score', { valueAsNumber: true })} />
        </div>
        <div>
          <Label>Attempt Limit</Label>
          <Input
            type="number"
            placeholder="Unlimited"
            {...form.register('attempt_limit', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="shuffle"
          checked={form.watch('shuffle_questions')}
          onCheckedChange={(checked) => form.setValue('shuffle_questions', !!checked)}
        />
        <Label htmlFor="shuffle">Shuffle questions</Label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Questions</h3>
          <Button type="button" onClick={addQuestion} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={qIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Question {qIndex + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(v: any) => updateQuestion(qIndex, 'type', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Choice</SelectItem>
                      <SelectItem value="multi">Multiple Choice</SelectItem>
                      <SelectItem value="boolean">True/False</SelectItem>
                      <SelectItem value="open">Short Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Question</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  rows={2}
                />
              </div>

              {question.type === 'open' && (
                <div>
                  <Label>Expected Answer (optional, for auto-grading)</Label>
                  <Input
                    value={question.open_expected || ''}
                    onChange={(e) => updateQuestion(qIndex, 'open_expected', e.target.value)}
                  />
                </div>
              )}

              {question.type !== 'open' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    {question.type !== 'boolean' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(qIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    )}
                  </div>

                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Checkbox
                        checked={option.is_correct}
                        onCheckedChange={(checked) =>
                          updateOption(qIndex, oIndex, 'is_correct', !!checked)
                        }
                      />
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      {question.type !== 'boolean' && question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Feedback (Correct)</Label>
                  <Textarea
                    value={question.feedback_correct || ''}
                    onChange={(e) => updateQuestion(qIndex, 'feedback_correct', e.target.value)}
                    rows={2}
                    placeholder="Optional feedback for correct answer"
                  />
                </div>
                <div>
                  <Label>Feedback (Incorrect)</Label>
                  <Textarea
                    value={question.feedback_incorrect || ''}
                    onChange={(e) => updateQuestion(qIndex, 'feedback_incorrect', e.target.value)}
                    rows={2}
                    placeholder="Optional feedback for incorrect answer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : quiz?.id ? 'Update Quiz' : 'Create Quiz'}
        </Button>
      </div>
    </form>
  );
};