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
  Info, Percent, Hash, Zap, Shield, Award
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

  // Auto-sync if no equity data on first load
  useEffect(() => {
    if (account && accountData && accountData.equity.length === 0 && !isSyncing) {
      syncMutation.mutate();
    }
  }, [account, accountData]);

  // Check if we have MetaAPI connection
  const hasMetaApiId = account?.metaapi_account_id;
  const hasRealData = accountData && accountData.trades && accountData.trades.length > 0;

  if (accountLoading || !account) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-teal/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-teal" />
          <p className="text-muted-foreground animate-pulse">Cargando análisis...</p>
        </div>
      </div>
    );
  }

  const hasData = accountData && (accountData.equity.length > 0 || accountData.trades.length > 0);
  const stats = accountData?.stats;
  const latestEquity = accountData?.equity?.[accountData.equity.length - 1];

  const totalProfit = stats?.gross_profit ? stats.gross_profit - (stats.gross_loss || 0) : 0;
  const profitPercent = latestEquity?.balance ? ((latestEquity.equity - latestEquity.balance) / latestEquity.balance) * 100 : 0;

  const StatCard = ({ 
    title, 
    value, 
    subtitle,
    tooltip, 
    icon: Icon, 
    trend, 
    valueColor,
    highlighted 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    tooltip: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
    valueColor?: string;
    highlighted?: boolean;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`
            group relative overflow-hidden transition-all duration-300 cursor-help
            ${highlighted 
              ? 'bg-gradient-to-br from-teal/20 via-surface to-surface border-teal/50 shadow-lg shadow-teal/10' 
              : 'bg-surface/50 backdrop-blur-sm border-line/50 hover:border-teal/30'
            }
            hover:shadow-xl hover:shadow-teal/5 hover:-translate-y-1
          `}>
            <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  p-3 rounded-xl transition-all duration-300
                  ${highlighted 
                    ? 'bg-teal/20 group-hover:bg-teal/30' 
                    : 'bg-muted/50 group-hover:bg-muted'
                  }
                `}>
                  <Icon className={`w-5 h-5 ${highlighted ? 'text-teal' : 'text-muted-foreground'}`} />
                </div>
                {trend && (
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${trend === 'up' ? 'bg-green-500/10 group-hover:bg-green-500/20' : 
                      trend === 'down' ? 'bg-red-500/10 group-hover:bg-red-500/20' : 
                      'bg-muted/50'
                    }
                  `}>
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
                <p className={`text-3xl font-bold mb-1 ${valueColor || 'text-foreground'} transition-colors`}>
                  {value}
                </p>
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs bg-popover/95 backdrop-blur-sm border-line/50">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-teal/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal/20 via-surface/50 to-surface border border-teal/30 backdrop-blur-sm p-8">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/audit')}
                className="hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-teal bg-clip-text text-transparent">
                    Cuenta #{account.login}
                  </h1>
                  <Badge 
                    variant={account.status === 'verified' ? 'default' : 'destructive'}
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    {account.status === 'verified' ? (
                      <><Shield className="w-3 h-3" /> Verificada</>
                    ) : (
                      <><AlertCircle className="w-3 h-3" /> Error</>
                    )}
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {account.server} • {account.platform?.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => syncMutation.mutate()}
                disabled={isSyncing}
                variant="outline"
                size="sm"
                className="bg-surface/50 backdrop-blur-sm border-line/50 hover:bg-teal/10 hover:border-teal/50 transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
              <Button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                variant="outline"
                size="sm"
                className="bg-surface/50 backdrop-blur-sm border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts de Estado */}
        {!hasMetaApiId ? (
          <Alert variant="destructive" className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/30 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">⚠️ Cuenta No Configurada Correctamente</AlertTitle>
            <AlertDescription className="space-y-3">
              <p className="font-medium">Esta cuenta no está conectada con MetaAPI. Los datos mostrados son temporales y no reflejan tu cuenta real.</p>
              <div className="bg-destructive/5 rounded-lg p-3 space-y-2">
                <p className="font-semibold text-sm">🔧 Cómo solucionar:</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Elimina esta cuenta usando el botón "Eliminar" arriba</li>
                  <li>Regresa al panel principal de Auditoría</li>
                  <li>Vuelve a conectar tu cuenta con los datos correctos de MT5</li>
                  <li>Asegúrate de ingresar el <strong>login</strong> y <strong>password de inversionista</strong> correctos</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        ) : !hasRealData && !isSyncing && !hasData ? (
          <Alert className="bg-gradient-to-r from-teal/10 to-teal/5 border-teal/30 backdrop-blur-sm">
            <Loader2 className="h-4 w-4 animate-spin text-teal" />
            <AlertTitle className="text-teal font-semibold">🔄 Conectando con tu cuenta real...</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Estamos obteniendo los datos reales de tu cuenta MT5 desde MetaAPI.</p>
              <p className="text-sm text-muted-foreground">Esto puede tomar 30-60 segundos dependiendo del historial de tu cuenta.</p>
            </AlertDescription>
          </Alert>
        ) : !hasRealData && hasData ? (
          <Alert className="bg-gradient-to-r from-amber/10 to-amber/5 border-amber/30 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500 font-semibold">⏳ Esperando Datos Reales de MT5</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>La conexión con MetaAPI está en proceso. Los datos mostrados son temporales mientras se sincronizan tus operaciones reales.</p>
              <div className="bg-amber/5 rounded-lg p-3 space-y-2">
                <p className="font-semibold text-sm">Si la sincronización tarda más de lo esperado:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Verifica que tu cuenta MT5 esté activa en Exness</li>
                  <li>Confirma que tengas operaciones en el historial</li>
                  <li>Asegúrate de que el <strong>login</strong> y <strong>password de inversionista</strong> sean correctos</li>
                  <li>Intenta sincronizar manualmente con el botón de arriba</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        ) : null}

        {account.sync_error && (
          <Alert variant="destructive" className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/30 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">❌ Error de Sincronización con MetaAPI</AlertTitle>
            <AlertDescription className="space-y-3">
              <div className="bg-destructive/10 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">Error detectado:</p>
                <p className="font-mono text-xs bg-background/50 p-2 rounded">{account.sync_error}</p>
              </div>
              
              <div className="bg-destructive/5 rounded-lg p-3 space-y-2">
                <p className="font-semibold text-sm">🔍 Causas comunes y soluciones:</p>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>
                    <strong>Account not found / Cuenta no encontrada:</strong><br/>
                    <span className="text-xs ml-5 text-muted-foreground">El número de cuenta (login) no existe en MetaTrader. Verifica el login en tu terminal MT5.</span>
                  </li>
                  <li>
                    <strong>Credenciales incorrectas:</strong><br/>
                    <span className="text-xs ml-5 text-muted-foreground">El password de inversionista cambió o es incorrecto. Ve a MT5 → Herramientas → Opciones → Servidor para verificar.</span>
                  </li>
                  <li>
                    <strong>Cuenta inactiva:</strong><br/>
                    <span className="text-xs ml-5 text-muted-foreground">La cuenta puede estar cerrada o suspendida en Exness. Verifica el estado en tu área de clientes.</span>
                  </li>
                  <li>
                    <strong>Servidor incorrecto:</strong><br/>
                    <span className="text-xs ml-5 text-muted-foreground">Verifica que el servidor sea el correcto (ej: Exness-MT5Real31). Encuéntralo en MT5 → Archivo → Abrir una cuenta.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-teal/10 rounded-lg p-3 border border-teal/20">
                <p className="text-sm font-semibold text-teal mb-1">💡 Recomendación:</p>
                <p className="text-sm">Elimina esta cuenta y vuelve a conectarla con los datos correctos desde el panel principal de Auditoría.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {hasData ? (
          <div className="space-y-6">
            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Balance Actual"
                value={`$${latestEquity?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                subtitle="Saldo base de tu cuenta"
                tooltip="Tu saldo total sin incluir las ganancias/pérdidas de operaciones abiertas. Es tu dinero depositado más las ganancias netas acumuladas."
                icon={DollarSign}
                trend="neutral"
                highlighted
              />
              <StatCard
                title="Equity en Vivo"
                value={`$${latestEquity?.equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                subtitle="Balance + posiciones abiertas"
                tooltip="Tu capital real en este momento. Incluye el balance más las ganancias o pérdidas de operaciones abiertas. Este es tu verdadero valor de cuenta."
                icon={Activity}
                trend={latestEquity?.equity > latestEquity?.balance ? 'up' : 'down'}
                valueColor={latestEquity?.equity > latestEquity?.balance ? 'text-green-500' : 'text-red-500'}
                highlighted
              />
              <StatCard
                title="Ganancia Total"
                value={`${totalProfit >= 0 ? '+' : ''}$${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle="Profit neto acumulado"
                tooltip="Tu ganancia o pérdida total desde que iniciaste esta cuenta. Incluye todas las operaciones cerradas."
                icon={TrendingUp}
                trend={totalProfit >= 0 ? 'up' : 'down'}
                valueColor={totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}
                highlighted
              />
              <StatCard
                title="Rentabilidad"
                value={`${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`}
                subtitle="ROI de tu inversión"
                tooltip="Porcentaje de retorno sobre tu capital inicial. Un número positivo significa que estás ganando dinero."
                icon={Percent}
                trend={profitPercent >= 0 ? 'up' : 'down'}
                valueColor={profitPercent >= 0 ? 'text-green-500' : 'text-red-500'}
                highlighted
              />
            </div>

            {/* Performance Metrics */}
            <Card className="bg-surface/50 backdrop-blur-sm border-line/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal/10 to-transparent border-b border-line/50">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal" />
                  Métricas de Rendimiento
                </CardTitle>
                <CardDescription>
                  Indicadores clave que miden la calidad de tu trading
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <StatCard
                    title="Win Rate"
                    value={`${stats?.win_rate?.toFixed(1) || '0'}%`}
                    tooltip="Porcentaje de operaciones ganadoras. Arriba de 50% es positivo, arriba de 60% es excelente."
                    icon={Target}
                    trend={stats?.win_rate > 50 ? 'up' : 'down'}
                  />
                  <StatCard
                    title="Profit Factor"
                    value={stats?.profit_factor?.toFixed(2) || '0'}
                    tooltip="Ganancias brutas ÷ Pérdidas brutas. Mayor a 1 es rentable, mayor a 1.5 es muy bueno, mayor a 2 es excelente."
                    icon={BarChart3}
                    trend={stats?.profit_factor > 1 ? 'up' : 'down'}
                    valueColor={stats?.profit_factor > 1.5 ? 'text-green-500' : stats?.profit_factor > 1 ? 'text-yellow-500' : 'text-red-500'}
                  />
                  <StatCard
                    title="Max Drawdown"
                    value={`${stats?.max_dd?.toFixed(2) || '0'}%`}
                    tooltip="Mayor caída desde un pico. Menos de 10% es conservador, menos de 20% es moderado, más de 30% es agresivo."
                    icon={TrendingDown}
                    trend="down"
                    valueColor={stats?.max_dd < 10 ? 'text-green-500' : stats?.max_dd < 20 ? 'text-yellow-500' : 'text-red-500'}
                  />
                  <StatCard
                    title="Total Trades"
                    value={stats?.total_trades || accountData.trades.length || 0}
                    tooltip="Número total de operaciones cerradas. Más trades = más datos estadísticos confiables."
                    icon={Hash}
                    trend="neutral"
                  />
                  <StatCard
                    title="Avg Win"
                    value={`$${stats?.avg_win?.toFixed(2) || '0'}`}
                    tooltip="Ganancia promedio en operaciones ganadoras. Mientras más alto, mejor."
                    icon={TrendingUp}
                    trend="up"
                    valueColor="text-green-500"
                  />
                  <StatCard
                    title="Avg Loss"
                    value={`$${Math.abs(stats?.avg_loss || 0).toFixed(2)}`}
                    tooltip="Pérdida promedio en operaciones perdedoras. Debe ser menor que tu Avg Win."
                    icon={TrendingDown}
                    trend="down"
                    valueColor="text-red-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Charts Tabs */}
            <Tabs defaultValue="equity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-surface/50 backdrop-blur-sm border border-line/50">
                <TabsTrigger value="equity" className="data-[state=active]:bg-teal/20">
                  Curva de Equity
                </TabsTrigger>
                <TabsTrigger value="trades" className="data-[state=active]:bg-teal/20">
                  Historial de Trades
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-teal/20">
                  Análisis Detallado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="equity" className="mt-6">
                <Card className="bg-surface/50 backdrop-blur-sm border-line/50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-teal/10 to-transparent border-b border-line/50">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-teal" />
                      Evolución de Tu Capital
                    </CardTitle>
                    <CardDescription>
                      Visualiza cómo ha crecido (o decrecido) tu cuenta con el tiempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {accountData.equity.length > 0 ? (
                      <EquityCurve data={accountData.equity} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay datos de equity disponibles
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trades" className="mt-6">
                <Card className="bg-surface/50 backdrop-blur-sm border-line/50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-teal/10 to-transparent border-b border-line/50">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-teal" />
                      Registro Completo de Operaciones
                    </CardTitle>
                    <CardDescription>
                      {accountData.trades.length} operaciones en total
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <TradesTable trades={accountData.trades} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-500/10 to-surface/50 backdrop-blur-sm border-green-500/30 overflow-hidden">
                    <CardHeader className="border-b border-green-500/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Análisis de Rentabilidad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5">
                        <span className="text-sm text-muted-foreground font-medium">Ganancias Brutas</span>
                        <span className="font-bold text-green-500 text-lg">
                          ${stats?.gross_profit?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/5">
                        <span className="text-sm text-muted-foreground font-medium">Pérdidas Brutas</span>
                        <span className="font-bold text-red-500 text-lg">
                          ${Math.abs(stats?.gross_loss || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                      <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-teal/10 to-teal/5">
                        <span className="font-semibold">Ganancia Neta Total</span>
                        <span className={`font-bold text-2xl ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-surface/50 backdrop-blur-sm border-orange-500/30 overflow-hidden">
                    <CardHeader className="border-b border-orange-500/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-orange-500" />
                        Evaluación de Riesgo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground font-medium">Max Drawdown</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  La mayor caída desde un pico de equity. Indica el peor momento que ha vivido tu cuenta.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="font-bold text-orange-500 text-lg">
                          {stats?.max_dd?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-teal/5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground font-medium">Profit Factor</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  Ganancias ÷ Pérdidas. Mayor a 1 = rentable, mayor a 1.5 = muy bueno, mayor a 2 = excelente
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className={`font-bold text-lg ${stats?.profit_factor > 1 ? 'text-green-500' : 'text-red-500'}`}>
                          {stats?.profit_factor?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/5">
                        <span className="text-sm text-muted-foreground font-medium">Win Rate</span>
                        <span className="font-bold text-teal text-lg">
                          {stats?.win_rate?.toFixed(1) || '0'}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          !isSyncing && (
            <Card className="bg-surface/50 backdrop-blur-sm border-line/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-teal/10 mb-6">
                  <Loader2 className="w-12 h-12 text-teal/50 animate-spin" />
                </div>
                <p className="text-xl font-semibold text-foreground mb-2">
                  Preparando tu análisis
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Estamos conectando con tu cuenta y obteniendo el historial. Esto puede tomar hasta 2 minutos.
                </p>
                <Button 
                  onClick={() => syncMutation.mutate()} 
                  disabled={isSyncing}
                  className="bg-teal hover:bg-teal/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Forzar sincronización
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default AuditDetail;
