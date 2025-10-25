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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call new edge function to fetch agents from Exness API
      const { data, error } = await supabase.functions.invoke('fetch-referral-agents', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      return data.agents || [];
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
                    <CardTitle className="text-lg">{referral.alias}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{referral.email}</p>
                  </div>
                  <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                    {referral.status || 'active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium min-w-[100px]">Link Code:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{referral.link_code}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium min-w-[100px]">Agent ID:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{referral.id}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium min-w-[100px]">Created:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(referral.created).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {referral.referral_link && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium min-w-[100px]">Link:</span>
                      <a 
                        href={referral.referral_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {referral.referral_link}
                      </a>
                    </div>
                  )}
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
