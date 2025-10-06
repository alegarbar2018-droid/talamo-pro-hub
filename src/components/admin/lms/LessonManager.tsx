import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Video, FileText, GripVertical, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LessonForm } from './LessonForm';
import { toast } from 'sonner';

interface LessonManagerProps {
  moduleId: string;
  onBack: () => void;
}

export const LessonManager: React.FC<LessonManagerProps> = ({ moduleId, onBack }) => {
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const { data: lessons, isLoading, refetch } = useQuery({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Modules
        </Button>
        <Button onClick={() => setIsLessonModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      {isLoading && <div>Loading lessons...</div>}

      <div className="space-y-4">
        {lessons?.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  {lesson.video_storage_key || lesson.video_external_url ? (
                    <Video className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <CardTitle className="text-base">
                      Lesson {index + 1}: {lesson.course_item?.title}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {lesson.video_storage_key && 'Has video (Storage)'}
                      {lesson.video_external_url && 'Has video (External)'}
                      {lesson.quiz_id && ' • Has quiz'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}

        {lessons?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No lessons yet</p>
              <Button onClick={() => setIsLessonModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First Lesson
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Lesson</DialogTitle>
          </DialogHeader>
          <LessonForm
            moduleId={moduleId}
            onSuccess={() => {
              setIsLessonModalOpen(false);
              refetch();
            }}
            onCancel={() => setIsLessonModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
