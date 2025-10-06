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
import { CompetitionForm } from '@/components/admin/CompetitionForm';

export const AdminCompetitions: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: competitions, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-competitions', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('competitions')
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
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      open: 'default',
      closed: 'secondary',
      draft: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{t(`admin.competitions.status.${status}`)}</Badge>;
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <PermissionGuard resource="competitions" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.competitions.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.competitions.subtitle')}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.competitions.new_competition')}
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.competitions.filter.all')}</SelectItem>
              <SelectItem value="draft">{t('admin.competitions.status.draft')}</SelectItem>
              <SelectItem value="open">{t('admin.competitions.status.open')}</SelectItem>
              <SelectItem value="closed">{t('admin.competitions.status.closed')}</SelectItem>
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
            <AlertDescription>{t('admin.competitions.error_loading')}</AlertDescription>
          </Alert>
        )}

        {competitions && competitions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('admin.competitions.no_competitions')}</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.competitions.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {competitions?.map((competition) => (
            <Card key={competition.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{competition.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{competition.rules}</p>
                  </div>
                  {getStatusBadge(competition.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    {t('admin.competitions.starts')}: {new Date(competition.starts_at).toLocaleDateString()}
                  </div>
                  <div>
                    {t('admin.competitions.ends')}: {new Date(competition.ends_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('admin.competitions.new_competition')}</DialogTitle>
            </DialogHeader>
            <CompetitionForm
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminCompetitions;
