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
import { AlertTriangle, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CourseForm } from '@/components/admin/CourseForm';

export const AdminLMS: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: courses, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-courses', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('course_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const variant = status === 'published' ? 'default' : 'secondary';
    return <Badge variant={variant}>{t(`admin.lms.status.${status}`)}</Badge>;
  };

  const getKindBadge = (kind: string) => {
    return <Badge variant="outline">{kind}</Badge>;
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <PermissionGuard resource="lms" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.lms.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.lms.subtitle')}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.lms.new_course')}
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.lms.filter.all')}</SelectItem>
              <SelectItem value="draft">{t('admin.lms.status.draft')}</SelectItem>
              <SelectItem value="published">{t('admin.lms.status.published')}</SelectItem>
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
            <AlertDescription>{t('admin.lms.error_loading')}</AlertDescription>
          </Alert>
        )}

        {courses && courses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('admin.lms.no_courses')}</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.lms.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {courses?.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex gap-2">
                      {getKindBadge(course.kind)}
                      {getStatusBadge(course.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('admin.lms.provider')}:</span>{' '}
                    {course.provider}
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('admin.lms.duration')}:</span>{' '}
                    {course.duration_min ? `${course.duration_min} min` : 'N/A'}
                  </div>
                  {course.tags && course.tags.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">{t('admin.lms.tags')}:</span>{' '}
                      {course.tags.join(', ')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('admin.lms.new_course')}</DialogTitle>
            </DialogHeader>
            <CourseForm
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminLMS;
