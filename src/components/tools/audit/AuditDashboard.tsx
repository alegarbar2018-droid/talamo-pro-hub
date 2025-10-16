import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { ConnectAccountModal } from './ConnectAccountModal';
import { VerificationPanel } from './VerificationPanel';
import { EquityCurve } from './EquityCurve';
import { StatsCards } from './StatsCards';
import { TradesTable } from './TradesTable';
import { useTranslation } from 'react-i18next';

export const AuditDashboard = () => {
  const { t } = useTranslation();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data: accounts, isLoading, refetch } = useQuery({
    queryKey: ['audit-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: accountData } = useQuery({
    queryKey: ['audit-account-data', selectedAccountId],
    queryFn: async () => {
      if (!selectedAccountId) return null;

      const [equityRes, statsRes, tradesRes] = await Promise.all([
        supabase
          .from('audit_equity')
          .select('*')
          .eq('account_id', selectedAccountId)
          .order('time', { ascending: true })
          .limit(500),
        
        supabase
          .from('audit_stats_daily')
          .select('*')
          .eq('account_id', selectedAccountId)
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle(),
        
        supabase
          .from('audit_trades')
          .select('*')
          .eq('account_id', selectedAccountId)
          .order('close_time', { ascending: false })
          .limit(100),
      ]);

      return {
        equity: equityRes.data || [],
        stats: statsRes.data,
        trades: tradesRes.data || [],
      };
    },
    enabled: !!selectedAccountId,
  });

  const selectedAccount = accounts?.find(acc => acc.id === selectedAccountId);

  const handleSync = async () => {
    if (!selectedAccountId) return;
    
    try {
      await supabase.functions.invoke('audit-sync-account', {
        body: { account_id: selectedAccountId },
      });
      refetch();
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {t('tools.audit.title', 'Auditoría MT4/MT5')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t('tools.audit.subtitle', 'Conecta tu cuenta en modo lectura para análisis completo')}
          </p>
        </div>
        <Button onClick={() => setShowConnectModal(true)} className="bg-teal hover:bg-teal/90">
          <Plus className="w-4 h-4 mr-2" />
          {t('tools.audit.connect_account', 'Conectar Cuenta')}
        </Button>
      </div>

      <Card className="bg-surface border-line/50">
        <CardHeader>
          <CardTitle>{t('tools.audit.connected_accounts', 'Cuentas Conectadas')}</CardTitle>
          <CardDescription>
            {t('tools.audit.select_account', 'Selecciona una cuenta para ver su análisis')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Cargando...</div>
          ) : accounts && accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map(account => (
                <Card
                  key={account.id}
                  className={`cursor-pointer transition-all hover:border-teal/50 ${
                    selectedAccountId === account.id ? 'border-teal bg-teal/5' : 'border-line/30'
                  }`}
                  onClick={() => setSelectedAccountId(account.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{account.login}</p>
                        <p className="text-sm text-muted-foreground">{account.server}</p>
                        <Badge className="mt-2" variant={account.status === 'verified' ? 'default' : 'secondary'}>
                          {account.platform?.toUpperCase()} {account.status === 'verified' && '✓'}
                        </Badge>
                      </div>
                      {account.status === 'verified' && (
                        <Shield className="w-5 h-5 text-teal" />
                      )}
                      {account.status === 'verification_pending' && (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('tools.audit.no_accounts', 'No hay cuentas conectadas')}
              </p>
              <Button variant="link" onClick={() => setShowConnectModal(true)} className="text-teal">
                {t('tools.audit.connect_first', 'Conectar tu primera cuenta')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAccount && (selectedAccount.status === 'connected' || selectedAccount.status === 'verification_pending') && (
        <VerificationPanel accountId={selectedAccount.id} />
      )}

      {selectedAccount && selectedAccount.status === 'verified' && accountData && (
        <>
          <div className="flex justify-end">
            <Button onClick={handleSync} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar
            </Button>
          </div>
          
          <StatsCards stats={accountData.stats} />

          <Card className="bg-surface border-line/50">
            <CardHeader>
              <CardTitle>{t('tools.audit.equity_curve', 'Curva de Equity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <EquityCurve data={accountData.equity} />
            </CardContent>
          </Card>

          <Card className="bg-surface border-line/50">
            <CardHeader>
              <CardTitle>{t('tools.audit.trade_history', 'Historial de Operaciones')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TradesTable trades={accountData.trades} />
            </CardContent>
          </Card>
        </>
      )}

      <ConnectAccountModal
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
      />
    </div>
  );
};
