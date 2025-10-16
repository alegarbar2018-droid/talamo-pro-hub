import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Loader2, Trash2, 
  TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3,
  Info, Calendar, Percent, Hash
} from 'lucide-react';
import { EquityCurve } from '@/components/tools/audit/EquityCurve';
import { TradesTable } from '@/components/tools/audit/TradesTable';
import { useToast } from '@/hooks/use-toast';

export const AuditDetail = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['audit-account', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_accounts')
        .select('*')
        .eq('id', accountId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: accountData, isLoading: dataLoading, refetch } = useQuery({
    queryKey: ['audit-account-data', accountId],
    queryFn: async () => {
      if (!accountId) return null;

      const [equityRes, statsRes, tradesRes] = await Promise.all([
        supabase
          .from('audit_equity')
          .select('*')
          .eq('account_id', accountId)
          .order('time', { ascending: true })
          .limit(500),
        
        supabase
          .from('audit_stats_daily')
          .select('*')
          .eq('account_id', accountId)
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle(),
        
        supabase
          .from('audit_trades')
          .select('*')
          .eq('account_id', accountId)
          .order('close_time', { ascending: false })
          .limit(100),
      ]);

      return {
        equity: equityRes.data || [],
        stats: statsRes.data,
        trades: tradesRes.data || [],
      };
    },
    enabled: !!accountId,
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('audit-sync-account', {
        body: { account_id: accountId },
      });
      if (error) throw error;
      return data;
    },
    onMutate: () => setIsSyncing(true),
    onSuccess: () => {
      toast({ title: '✓ Sincronización completada', description: 'Datos actualizados correctamente' });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['audit-account', accountId] });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error al sincronizar', 
        description: error.message,
        variant: 'destructive' 
      });
    },
    onSettled: () => setIsSyncing(false),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('audit_accounts')
        .delete()
        .eq('id', accountId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: '✓ Cuenta eliminada' });
      navigate('/audit');
    },
  });

  // Auto-sync si no hay datos
  useEffect(() => {
    if (account && accountData && accountData.equity.length === 0 && !isSyncing) {
      syncMutation.mutate();
    }
  }, [account, accountData]);

  if (accountLoading || !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  const hasData = accountData && (accountData.equity.length > 0 || accountData.trades.length > 0);
  const stats = accountData?.stats;
  const latestEquity = accountData?.equity?.[accountData.equity.length - 1];

  // Calculate metrics
  const totalProfit = stats?.gross_profit ? stats.gross_profit - (stats.gross_loss || 0) : 0;
  const profitPercent = latestEquity?.balance ? ((latestEquity.equity - latestEquity.balance) / latestEquity.balance) * 100 : 0;

  const StatCard = ({ 
    title, 
    value, 
    tooltip, 
    icon: Icon, 
    trend, 
    valueColor 
  }: { 
    title: string; 
    value: string | number; 
    tooltip: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
    valueColor?: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="bg-surface border-line/50 hover:border-teal/30 transition-colors cursor-help">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                  </div>
                  <p className={`text-2xl font-bold ${valueColor || 'text-foreground'}`}>
                    {value}
                  </p>
                </div>
                {trend && (
                  <div className={`p-1 rounded ${
                    trend === 'up' ? 'bg-green-500/10' : 
                    trend === 'down' ? 'bg-red-500/10' : 
                    'bg-muted'
                  }`}>
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/audit')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Cuenta #{account.login}
            </h1>
            <p className="text-muted-foreground">
              {account.server} • {account.platform?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={account.status === 'verified' ? 'default' : 'destructive'}
            className="flex items-center gap-2"
          >
            {account.status === 'verified' ? (
              <><CheckCircle2 className="w-3 h-3" /> Conectada</>
            ) : (
              <><AlertCircle className="w-3 h-3" /> Error</>
            )}
          </Badge>
          <Button
            onClick={() => syncMutation.mutate()}
            disabled={isSyncing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          <Button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {!hasData && !isSyncing && (
        <Alert className="bg-yellow-500/10 border-yellow-500/30">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Sincronizando por primera vez</AlertTitle>
          <AlertDescription>
            Conectando con MetaAPI. Esto puede tomar 30 seg - 2 min.
          </AlertDescription>
        </Alert>
      )}

      {account.sync_error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de conexión</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{account.sync_error}</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Verifica número de cuenta y contraseña de inversionista</li>
              <li>Confirma que el servidor sea correcto</li>
              <li>Intenta reconectar</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      {hasData ? (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Balance"
              value={`$${latestEquity?.balance?.toFixed(2) || '0.00'}`}
              tooltip="Saldo total de tu cuenta sin incluir operaciones abiertas"
              icon={DollarSign}
              trend="neutral"
            />
            <StatCard
              title="Equity"
              value={`$${latestEquity?.equity?.toFixed(2) || '0.00'}`}
              tooltip="Balance + P/L de posiciones abiertas. Es tu capital real en este momento"
              icon={Activity}
              trend={latestEquity?.equity > latestEquity?.balance ? 'up' : 'down'}
              valueColor={latestEquity?.equity > latestEquity?.balance ? 'text-green-500' : 'text-red-500'}
            />
            <StatCard
              title="Ganancia Total"
              value={`${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`}
              tooltip="Ganancia o pérdida total desde el inicio de la cuenta"
              icon={TrendingUp}
              trend={totalProfit >= 0 ? 'up' : 'down'}
              valueColor={totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}
            />
            <StatCard
              title="Ganancia %"
              value={`${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`}
              tooltip="Porcentaje de ganancia sobre tu balance inicial"
              icon={Percent}
              trend={profitPercent >= 0 ? 'up' : 'down'}
              valueColor={profitPercent >= 0 ? 'text-green-500' : 'text-red-500'}
            />
          </div>

          {/* Advanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StatCard
              title="Win Rate"
              value={`${stats?.win_rate?.toFixed(1) || '0'}%`}
              tooltip="Porcentaje de operaciones ganadoras vs totales. Arriba de 50% es positivo"
              icon={Target}
              trend={stats?.win_rate > 50 ? 'up' : 'down'}
            />
            <StatCard
              title="Profit Factor"
              value={stats?.profit_factor?.toFixed(2) || '0'}
              tooltip="Ganancias brutas ÷ Pérdidas brutas. Arriba de 1.5 es excelente, arriba de 1 es rentable"
              icon={BarChart3}
              trend={stats?.profit_factor > 1 ? 'up' : 'down'}
            />
            <StatCard
              title="Max Drawdown"
              value={`${stats?.max_dd?.toFixed(2) || '0'}%`}
              tooltip="Mayor caída desde un pico. Mide el riesgo máximo que has tomado. Menos de 20% es conservador"
              icon={TrendingDown}
              trend="down"
              valueColor="text-orange-500"
            />
            <StatCard
              title="Total Trades"
              value={stats?.total_trades || accountData.trades.length || 0}
              tooltip="Número total de operaciones cerradas"
              icon={Hash}
              trend="neutral"
            />
            <StatCard
              title="Avg Win"
              value={`$${stats?.avg_win?.toFixed(2) || '0'}`}
              tooltip="Ganancia promedio por operación ganadora"
              icon={TrendingUp}
              trend="up"
              valueColor="text-green-500"
            />
            <StatCard
              title="Avg Loss"
              value={`$${Math.abs(stats?.avg_loss || 0).toFixed(2)}`}
              tooltip="Pérdida promedio por operación perdedora"
              icon={TrendingDown}
              trend="down"
              valueColor="text-red-500"
            />
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="equity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="equity">Curva de Equity</TabsTrigger>
              <TabsTrigger value="trades">Operaciones</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="equity" className="space-y-4">
              <Card className="bg-surface border-line/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal" />
                    Evolución de Equity
                  </CardTitle>
                  <CardDescription>
                    Muestra cómo ha crecido (o decrecido) tu capital con el tiempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {accountData.equity.length > 0 ? (
                    <EquityCurve data={accountData.equity} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay datos de equity disponibles
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
              <Card className="bg-surface border-line/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal" />
                    Historial de Operaciones
                  </CardTitle>
                  <CardDescription>
                    {accountData.trades.length} operaciones registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TradesTable trades={accountData.trades} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-surface border-line/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Análisis de Rentabilidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ganancias Brutas</span>
                      <span className="font-semibold text-green-500">
                        ${stats?.gross_profit?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pérdidas Brutas</span>
                      <span className="font-semibold text-red-500">
                        ${Math.abs(stats?.gross_loss || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Ganancia Neta</span>
                      <span className={`font-bold text-lg ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${totalProfit.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface border-line/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Métricas de Riesgo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Max Drawdown</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-xs">
                                La mayor caída desde un pico de equity. Indica el peor momento de tu cuenta
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-semibold text-orange-500">
                        {stats?.max_dd?.toFixed(2) || '0.00'}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Profit Factor</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-xs">
                                Ganancias ÷ Pérdidas. Arriba de 1 = rentable, arriba de 1.5 = muy bueno
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className={`font-semibold ${stats?.profit_factor > 1 ? 'text-green-500' : 'text-red-500'}`}>
                        {stats?.profit_factor?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="font-semibold text-teal">
                        {stats?.win_rate?.toFixed(1) || '0'}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        !isSyncing && (
          <Card className="bg-surface border-line/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                Esperando sincronización
              </p>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                La primera sincronización puede tardar. Si pasaron más de 2 minutos, sincroniza manualmente.
              </p>
              <Button onClick={() => syncMutation.mutate()} disabled={isSyncing}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizar ahora
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default AuditDetail;
