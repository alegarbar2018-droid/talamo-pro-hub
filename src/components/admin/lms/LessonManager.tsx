import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Video, FileText, GripVertical, Trash2, ClipboardCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LessonForm } from './LessonForm';
import { QuizBuilder } from './QuizBuilder';
import { toast } from 'sonner';

interface LessonManagerProps {
  moduleId: string;
  onBack: () => void;
}

export const LessonManager: React.FC<LessonManagerProps> = ({ moduleId, onBack }) => {
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  const { data: lessons, isLoading: lessonsLoading, refetch: refetchLessons } = useQuery({
    queryKey: ['lms-lessons', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lms_lessons')
        .select(`
          *,
          course_item:course_items(*)
        `)
        .eq('module_id', moduleId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: quizzes, isLoading: quizzesLoading, refetch: refetchQuizzes } = useQuery({
    queryKey: ['lms-quizzes', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lms_quizzes')
        .select('*')
        .eq('module_id', moduleId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const refetch = () => {
    refetchLessons();
    refetchQuizzes();
  };

  // Combine lessons and quizzes into a single sorted list
  const items: Array<{ type: 'lesson' | 'quiz'; data: any; position: number }> = [];
  
  if (lessons) {
    lessons.forEach(lesson => {
      items.push({ type: 'lesson', data: lesson, position: lesson.position });
    });
  }
  
  if (quizzes) {
    quizzes.forEach(quiz => {
      items.push({ type: 'quiz', data: quiz, position: quiz.position || 0 });
    });
  }
  
  items.sort((a, b) => a.position - b.position);

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;

    const { error } = await supabase
      .from('lms_lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      toast.error('Failed to delete lesson');
    } else {
      toast.success('Lesson deleted');
      refetch();
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Delete this quiz?')) return;

    const { error } = await supabase
      .from('lms_quizzes')
      .delete()
      .eq('id', quizId);

    if (error) {
      toast.error('Failed to delete quiz');
    } else {
      toast.success('Quiz deleted');
      refetch();
    }
  };

  const isLoading = lessonsLoading || quizzesLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Modules
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setIsLessonModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
          <Button onClick={() => setIsQuizModalOpen(true)} variant="outline">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Add Quiz
          </Button>
        </div>
      </div>

      {isLoading && <div>Loading...</div>}

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={`${item.type}-${item.data.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  {item.type === 'lesson' ? (
                    <>
                      {item.data.video_storage_key || item.data.video_external_url ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <CardTitle className="text-base">
                          Lección {index + 1}: {item.data.course_item?.title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {item.data.video_storage_key && 'Tiene video (Storage)'}
                          {item.data.video_external_url && 'Tiene video (External)'}
                          {item.data.quiz_id && ' • Tiene quiz'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">
                          Quiz {index + 1}: {item.data.title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          Puntaje mínimo: {item.data.pass_score}% • Estado: {item.data.status}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (item.type === 'lesson') {
                        setEditingLesson(item.data);
                        setIsLessonModalOpen(true);
                      } else {
                        setEditingQuiz(item.data);
                        setIsQuizModalOpen(true);
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => item.type === 'lesson' 
                      ? handleDeleteLesson(item.data.id)
                      : handleDeleteQuiz(item.data.id)
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {items.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No hay lecciones o quizzes aún</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsLessonModalOpen(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primera Lección
                </Button>
                <Button onClick={() => setIsQuizModalOpen(true)} variant="outline">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Agregar Primer Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isLessonModalOpen} onOpenChange={(open) => {
        setIsLessonModalOpen(open);
        if (!open) setEditingLesson(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Editar Lección' : 'Agregar Lección'}</DialogTitle>
          </DialogHeader>
          <LessonForm
            moduleId={moduleId}
            existingItemsCount={items.length}
            lesson={editingLesson}
            onSuccess={() => {
              setIsLessonModalOpen(false);
              setEditingLesson(null);
              refetch();
            }}
            onCancel={() => {
              setIsLessonModalOpen(false);
              setEditingLesson(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isQuizModalOpen} onOpenChange={(open) => {
        setIsQuizModalOpen(open);
        if (!open) setEditingQuiz(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? 'Editar Quiz' : 'Agregar Quiz'}</DialogTitle>
          </DialogHeader>
          <QuizBuilder
            moduleId={moduleId}
            quiz={editingQuiz}
            onSuccess={() => {
              setIsQuizModalOpen(false);
              setEditingQuiz(null);
              refetch();
            }}
            onCancel={() => {
              setIsQuizModalOpen(false);
              setEditingQuiz(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
