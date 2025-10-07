import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModuleForm } from './ModuleForm';
import { LessonManager } from './LessonManager';
import { toast } from 'sonner';

interface CourseModulesManagerProps {
  courseId: string;
  onBack: () => void;
}

export const CourseModulesManager: React.FC<CourseModulesManagerProps> = ({ courseId, onBack }) => {
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<any>(null);

  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ['lms-modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lms_modules')
        .select(`
          *,
          course_item:course_items(*)
        `)
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;

    const { error } = await supabase
      .from('lms_modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      toast.error('Failed to delete module');
    } else {
      toast.success('Module deleted');
      refetch();
    }
  };

  if (selectedModuleId) {
    return (
      <LessonManager
        moduleId={selectedModuleId}
        onBack={() => setSelectedModuleId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsModuleModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      {isLoading && <div>Loading modules...</div>}

      <div className="space-y-4">
        {modules?.map((module, index) => (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">
                      Module {index + 1}: {module.course_item?.title}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">Position: {module.position}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedModuleId(module.id)}
                  >
                    Manage Lessons
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingModule(module);
                      setIsModuleModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {modules?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No modules yet</p>
              <Button onClick={() => setIsModuleModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First Module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
          </DialogHeader>
          <ModuleForm
            courseId={courseId}
            module={editingModule}
            onSuccess={() => {
              setIsModuleModalOpen(false);
              setEditingModule(null);
              refetch();
            }}
            onCancel={() => {
              setIsModuleModalOpen(false);
              setEditingModule(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
