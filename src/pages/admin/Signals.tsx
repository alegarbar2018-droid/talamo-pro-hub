import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, TrendingUp, Archive } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SignalForm } from '@/components/admin/SignalForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminSignals = () => {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: signals, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-signals', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('signals')
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

  const archiveMutation = useMutation({
    mutationFn: async (signalId: string) => {
      const { error } = await supabase
        .from('signals')
        .update({ status: 'archived' })
        .eq('id', signalId);
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Señal archivada",
        description: "La señal se marcó como archivada correctamente",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <PermissionGuard resource="signals" action="manage">
      <div className="space-y-6">
        <AdminBreadcrumbs />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('admin.signals.title')}</h1>
            <p className="text-muted-foreground">{t('admin.signals.subtitle')}</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.signals.create_new')}
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('admin.signals.filter_status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.signals.all_status')}</SelectItem>
              <SelectItem value="draft">{t('admin.signals.status.draft')}</SelectItem>
              <SelectItem value="published">{t('admin.signals.status.published')}</SelectItem>
              <SelectItem value="archived">{t('admin.signals.status.archived')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('admin.signals.error_loading')}: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {signals?.map((signal) => (
              <Card key={signal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{signal.instrument}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{signal.timeframe}</span>
                        <span>•</span>
                        <span>RR: {signal.rr}</span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(signal.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <p className="text-muted-foreground line-clamp-2">{signal.logic}</p>
                  </div>
                  {signal.entry_price && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Entry</p>
                        <p className="font-medium">{signal.entry_price}</p>
                      </div>
                      {signal.stop_loss && (
                        <div>
                          <p className="text-muted-foreground">SL</p>
                          <p className="font-medium text-destructive">{signal.stop_loss}</p>
                        </div>
                      )}
                      {signal.take_profit && (
                        <div>
                          <p className="text-muted-foreground">TP</p>
                          <p className="font-medium text-success">{signal.take_profit}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>{signal.source}</span>
                    <span>{new Date(signal.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-line">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (confirm('¿Archivar esta señal? No se mostrará en el feed público.')) {
                          archiveMutation.mutate(signal.id);
                        }
                      }}
                      disabled={archiveMutation.isPending || signal.status === 'archived'}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      {signal.status === 'archived' ? 'Archivada' : 'Archivar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && signals?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{t('admin.signals.no_signals')}</p>
              <p className="text-muted-foreground mb-4">{t('admin.signals.no_signals_desc')}</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.signals.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('admin.signals.create_new')}</DialogTitle>
            </DialogHeader>
            <SignalForm
              onSuccess={() => {
                setIsCreateModalOpen(false);
                refetch();
              }}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminSignals;
