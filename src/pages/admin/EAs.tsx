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
import { AlertTriangle, Plus, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EAForm } from '@/components/admin/EAForm';

export const AdminEAs: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: eas, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-eas', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('eas')
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
    const variant = status === 'verified' ? 'default' : 'secondary';
    return <Badge variant={variant}>{t(`admin.eas.status.${status}`)}</Badge>;
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <PermissionGuard resource="eas" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.eas.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.eas.subtitle')}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.eas.new_ea')}
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.eas.filter.all')}</SelectItem>
              <SelectItem value="draft">{t('admin.eas.status.draft')}</SelectItem>
              <SelectItem value="verified">{t('admin.eas.status.verified')}</SelectItem>
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
            <AlertDescription>{t('admin.eas.error_loading')}</AlertDescription>
          </Alert>
        )}

        {eas && eas.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('admin.eas.no_eas')}</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.eas.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {eas?.map((ea) => (
            <Card key={ea.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{ea.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{ea.description}</p>
                  </div>
                  {getStatusBadge(ea.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {t('admin.eas.created_at')}: {new Date(ea.created_at).toLocaleDateString()}
                  </div>
                  {ea.download_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={ea.download_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {t('admin.eas.download')}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('admin.eas.new_ea')}</DialogTitle>
            </DialogHeader>
            <EAForm
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminEAs;
