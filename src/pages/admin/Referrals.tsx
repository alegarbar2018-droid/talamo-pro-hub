import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Users, MousePointerClick } from 'lucide-react';

export const AdminReferrals: React.FC = () => {
  const { t } = useTranslation();

  const { data: referrals, isLoading, error } = useQuery({
    queryKey: ['admin-referrals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <PermissionGuard resource="referrals" action="read">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.referrals.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.referrals.subtitle')}</p>
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
            <AlertDescription>{t('admin.referrals.error_loading')}</AlertDescription>
          </Alert>
        )}

        {referrals && referrals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">{t('admin.referrals.no_referrals')}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {referrals?.map((referral) => (
            <Card key={referral.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-mono">{referral.code}</CardTitle>
                  </div>
                  <Badge variant={referral.active ? 'default' : 'secondary'}>
                    {referral.active ? t('admin.referrals.active') : t('admin.referrals.inactive')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-semibold">{referral.clicks}</span>{' '}
                      {t('admin.referrals.clicks')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-semibold">{referral.signups}</span>{' '}
                      {t('admin.referrals.signups')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('admin.referrals.created')}: {new Date(referral.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
};

export default AdminReferrals;
