import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { EquityCurve } from '@/components/tools/audit/EquityCurve';
import { StatsCards } from '@/components/tools/audit/StatsCards';
import { TradesTable } from '@/components/tools/audit/TradesTable';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const AuditDetail = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
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
  const connectionStatus = account.status === 'verified' ? 'connected' : 'error';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/audit')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cuentas
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
            variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
            className="flex items-center gap-2"
          >
            {connectionStatus === 'connected' ? (
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

      {/* Connection Status */}
      {!hasData && !isSyncing && (
        <Alert className="bg-yellow-500/10 border-yellow-500/30">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Sincronizando cuenta por primera vez</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Estamos conectando con MetaAPI para obtener tus datos de trading.</p>
            <p className="text-xs text-muted-foreground">
              Esto puede tomar de 30 segundos a 2 minutos. Haz clic en "Sincronizar" si no ves datos después de este tiempo.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {account.sync_error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de conexión</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{account.sync_error}</p>
            <div className="text-sm">
              <p className="font-semibold mb-2">Posibles soluciones:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Verifica que el número de cuenta sea correcto</li>
                <li>Asegúrate de usar la contraseña de inversionista (no la contraseña maestra)</li>
                <li>Verifica que el servidor sea el correcto</li>
                <li>Intenta reconectar la cuenta</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Data Display */}
      {hasData ? (
        <>
          {accountData.stats && <StatsCards stats={accountData.stats} />}

          {accountData.equity.length > 0 && (
            <Card className="bg-surface border-line/50">
              <CardHeader>
                <CardTitle>Curva de Equity</CardTitle>
                <CardDescription>Evolución del balance de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <EquityCurve data={accountData.equity} />
              </CardContent>
            </Card>
          )}

          <Card className="bg-surface border-line/50">
            <CardHeader>
              <CardTitle>Historial de Operaciones</CardTitle>
              <CardDescription>
                {accountData.trades.length} operaciones registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradesTable trades={accountData.trades} />
            </CardContent>
          </Card>
        </>
      ) : (
        !isSyncing && (
          <Card className="bg-surface border-line/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                Esperando datos de sincronización
              </p>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                La primera sincronización puede tardar un poco. Si ya pasaron más de 2 minutos, intenta sincronizar manualmente.
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
