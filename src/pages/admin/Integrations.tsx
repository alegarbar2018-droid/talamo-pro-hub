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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IntegrationForm } from '@/components/admin/IntegrationForm';

export const AdminIntegrations: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: integrations, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <PermissionGuard resource="integrations" action="manage" requiredRoles={['ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.integrations.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.integrations.subtitle')}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.integrations.new_integration')}
          </Button>
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
            <AlertDescription>{t('admin.integrations.error_loading')}</AlertDescription>
          </Alert>
        )}

        {integrations && integrations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('admin.integrations.no_integrations')}</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.integrations.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {integrations?.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge variant="outline">{integration.type}</Badge>
                  </div>
                  <Badge variant={integration.enabled ? 'default' : 'secondary'}>
                    {integration.enabled ? t('admin.integrations.enabled') : t('admin.integrations.disabled')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {t('admin.integrations.created_at')}: {new Date(integration.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('admin.integrations.new_integration')}</DialogTitle>
            </DialogHeader>
            <IntegrationForm
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminIntegrations;
