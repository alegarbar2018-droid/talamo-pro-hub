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
import { AlertTriangle, Plus, CheckCircle2, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AffiliationForm } from '@/components/admin/AffiliationForm';

export const AdminAffiliation: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: affiliations, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-affiliations', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('affiliations')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter === 'verified') {
        query = query.eq('is_affiliated', true);
      } else if (statusFilter === 'unverified') {
        query = query.eq('is_affiliated', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <PermissionGuard resource="affiliation" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.affiliation.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.affiliation.subtitle')}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.affiliation.new_affiliation')}
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.affiliation.filter.all')}</SelectItem>
              <SelectItem value="verified">{t('admin.affiliation.filter.verified')}</SelectItem>
              <SelectItem value="unverified">{t('admin.affiliation.filter.unverified')}</SelectItem>
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
            <AlertDescription>{t('admin.affiliation.error_loading')}</AlertDescription>
          </Alert>
        )}

        {affiliations && affiliations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('admin.affiliation.no_affiliations')}</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.affiliation.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {affiliations?.map((affiliation) => (
            <Card key={affiliation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{affiliation.email}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Partner ID: {affiliation.partner_id}
                    </p>
                  </div>
                  {affiliation.is_affiliated ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('admin.affiliation.status.verified')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      {t('admin.affiliation.status.unverified')}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {t('admin.affiliation.verified_at')}: {affiliation.verified_at 
                    ? new Date(affiliation.verified_at).toLocaleDateString() 
                    : t('admin.affiliation.not_verified')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('admin.affiliation.new_affiliation')}</DialogTitle>
            </DialogHeader>
            <AffiliationForm
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminAffiliation;
