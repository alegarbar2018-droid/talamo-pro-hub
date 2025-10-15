import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  BarChart3,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Upload
} from 'lucide-react';
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
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [publishingId, setPublishingId] = useState<string | null>(null);

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

  const handlePublish = async (strategyId: string) => {
    setPublishingId(strategyId);
    try {
      const { error } = await supabase
        .from('copy_strategies' as any)
        .update({ status: 'published' })
        .eq('id', strategyId);

      if (error) throw error;

      toast({
        title: "Estrategia publicada",
        description: "La estrategia ahora está visible para los usuarios",
      });
      
      refetch();
    } catch (error) {
      console.error('Error publishing strategy:', error);
      toast({
        title: "Error",
        description: "No se pudo publicar la estrategia",
        variant: "destructive",
      });
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <PermissionGuard resource="copy" action="manage">
      <div className="space-y-8 animate-fade-in">
        {/* Header mejorado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Estrategias de Copy Trading</h1>
            <p className="text-muted-foreground">
              Crea y administra estrategias para que los usuarios puedan copiar
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="h-5 w-5" />
            Crear Estrategia
          </Button>
        </div>

        {/* Stats cards */}
        {strategies && strategies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{strategies.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-teal/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Publicadas</p>
                    <p className="text-2xl font-bold">
                      {strategies.filter((s: any) => s.status === 'published').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-teal/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-teal" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Borradores</p>
                    <p className="text-2xl font-bold">
                      {strategies.filter((s: any) => s.status === 'draft').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros mejorados */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las estrategias</SelectItem>
              <SelectItem value="draft">Solo Borradores</SelectItem>
              <SelectItem value="published">Solo Publicadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="animate-scale-in">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar las estrategias. Por favor intenta de nuevo.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state mejorado */}
        {strategies && strategies.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay estrategias todavía</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Crea tu primera estrategia de copy trading para que los usuarios puedan comenzar a invertir
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Crear Primera Estrategia
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lista de estrategias mejorada */}
        <div className="grid gap-4">
          {strategies?.map((strategy: any, index: number) => (
            <Card 
              key={strategy.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-teal/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl truncate">{strategy.trader_name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {strategy.trader_bio || 'Sin biografía'}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {strategy.status === 'published' ? (
                      <Badge className="gap-1 bg-teal/10 text-teal border-teal/30 hover:bg-teal/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Publicada
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Borrador
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* KPIs principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-teal" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Equity</p>
                      <p className="font-semibold truncate">${strategy.strategy_equity?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Mínimo</p>
                      <p className="font-semibold">${strategy.min_investment}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Percent className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="font-semibold">{strategy.performance_fee_pct}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Apalancamiento</p>
                      <p className="font-semibold">1:{strategy.leverage}</p>
                    </div>
                  </div>
                </div>

                {/* Detalles adicionales y acciones */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {strategy.account_type}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {strategy.billing_period}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      Riesgo: {strategy.risk_band || 'Auto'}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {strategy.symbols_traded?.length || 0} símbolos
                    </Badge>
                  </div>
                  
                  {strategy.status === 'draft' && (
                    <Button
                      onClick={() => handlePublish(strategy.id)}
                      disabled={publishingId === strategy.id}
                      className="gap-2"
                      size="sm"
                    >
                      <Upload className="h-4 w-4" />
                      {publishingId === strategy.id ? 'Publicando...' : 'Publicar'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal mejorado */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Crear Nueva Estrategia</DialogTitle>
              <CardDescription>
                Completa los datos de la estrategia de copy trading
              </CardDescription>
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
