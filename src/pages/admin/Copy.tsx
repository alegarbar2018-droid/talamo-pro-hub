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
import { StrategyFormExpanded } from '@/components/admin/StrategyFormExpanded';

export const AdminCopy: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: strategies, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-strategies', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('copy_strategies' as any)
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
    return <Badge variant={variant}>{t(`admin.copy.status.${status}`)}</Badge>;
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <PermissionGuard resource="copy" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.copy.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.copy.subtitle')}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.copy.new_strategy')}
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.copy.filter.all')}</SelectItem>
              <SelectItem value="draft">{t('admin.copy.status.draft')}</SelectItem>
              <SelectItem value="published">{t('admin.copy.status.published')}</SelectItem>
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
            <AlertDescription>{t('admin.copy.error_loading')}</AlertDescription>
          </Alert>
        )}

        {strategies && strategies.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('admin.copy.no_strategies')}</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.copy.create_first')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {strategies?.map((strategy: any) => (
            <Card key={strategy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{strategy.trader_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{strategy.trader_bio}</p>
                  </div>
                  {getStatusBadge(strategy.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo Cuenta:</span>{' '}
                    <Badge variant="outline">{strategy.account_type}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Equity:</span> ${strategy.strategy_equity?.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min Inversión:</span> ${strategy.min_investment}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fee:</span> {strategy.performance_fee_pct}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Apalancamiento:</span> 1:{strategy.leverage}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Facturación:</span>{' '}
                    <Badge variant="outline">{strategy.billing_period}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Riesgo:</span>{' '}
                    <Badge variant="outline">{strategy.risk_band || 'Auto'}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Símbolos:</span> {strategy.symbols_traded?.length || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('admin.copy.new_strategy')}</DialogTitle>
            </DialogHeader>
            <StrategyFormExpanded
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default AdminCopy;
