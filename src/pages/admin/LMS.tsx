import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Plus, BookOpen, List, Video, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FullCourseForm } from '@/components/admin/lms/FullCourseForm';
import { CourseModulesManager } from '@/components/admin/lms/CourseModulesManager';

export const AdminLMS: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const { data: courses, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-lms-courses', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('lms_courses')
        .select(`
          *,
          course_item:course_items(*)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedCourseId(null);
    setEditingCourse(null);
    refetch();
  };

  const handleDeleteCourse = async (courseId: string, itemId: string) => {
    if (!confirm('Delete this course? This will also delete all modules and lessons.')) return;

    // Delete course (cascade will handle modules/lessons)
    const { error: courseError } = await supabase
      .from('lms_courses')
      .delete()
      .eq('id', courseId);

    if (courseError) {
      toast.error('Failed to delete course');
      return;
    }

    // Delete course item
    const { error: itemError } = await supabase
      .from('course_items')
      .delete()
      .eq('id', itemId);

    if (itemError) {
      toast.error('Failed to delete course item');
    } else {
      toast.success('Course deleted successfully');
      refetch();
    }
  };

  if (selectedCourseId) {
    return (
      <PermissionGuard resource="lms" action="manage">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedCourseId(null)}
              >
                ← Back to Courses
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Course Structure</h1>
                <p className="text-muted-foreground">Manage modules and lessons</p>
              </div>
            </div>
          </div>
          <CourseModulesManager 
            courseId={selectedCourseId}
            onBack={() => setSelectedCourseId(null)}
          />
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard resource="lms" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">LMS Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage courses, modules, lessons and quizzes</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading courses</AlertDescription>
          </Alert>
        )}

        {courses && courses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No courses found</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create First Course
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {courses?.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{course.course_item?.title}</CardTitle>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">Level {course.level}</Badge>
                      <Badge 
                        variant={course.status === 'published' ? 'default' : 'outline'}
                        className={course.status === 'published' ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}
                      >
                        {course.status === 'published' ? '✓ Published' : '○ Draft'}
                      </Badge>
                      {course.course_item?.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {course.status === 'published' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/academy/course/${course.slug}`, '_blank');
                        }}
                        className="text-teal hover:bg-teal/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCourseId(course.id)}
                    >
                      <List className="mr-2 h-4 w-4" />
                      Manage Structure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCourse(course);
                        setIsModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id, course.course_item?.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>{' '}
                    {course.course_item?.duration_min ? `${course.course_item.duration_min} min` : 'N/A'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Slug:</span>{' '}
                    {course.slug || 'Not set'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>{' '}
                    {new Date(course.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <FullCourseForm
              course={editingCourse}
              onSuccess={handleSuccess}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingCourse(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminLMS;
