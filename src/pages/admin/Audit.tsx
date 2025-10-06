import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const { t } = useTranslation();

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  return (
    <PermissionGuard resource="audit" action="read">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('admin.audit.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.audit.subtitle')}</p>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t('admin.audit.error_loading')}</AlertDescription>
          </Alert>
        )}

        {logs && logs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">{t('admin.audit.no_logs')}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3">
          {logs?.map((log) => (
            <Card key={log.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium">{log.action}</CardTitle>
                    {log.resource && (
                      <Badge variant="outline" className="text-xs">
                        {log.resource}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              {log.meta && (
                <CardContent className="pt-0">
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.meta, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
};

export default AdminAudit;
