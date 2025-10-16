import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ConnectAccountModal } from './ConnectAccountModal';
import { useTranslation } from 'react-i18next';

export const AuditDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data: accounts, isLoading } = useQuery({
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

  const handleAccountClick = (accountId: string) => {
    navigate(`/audit/${accountId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Auditoría MT4/MT5
          </h2>
          <p className="text-muted-foreground mt-1">
            Conecta tus cuentas en modo lectura para análisis completo
          </p>
        </div>
        <Button onClick={() => setShowConnectModal(true)} className="bg-teal hover:bg-teal/90">
          <Plus className="w-4 h-4 mr-2" />
          Conectar Cuenta
        </Button>
      </div>

      <Card className="bg-surface border-line/50">
        <CardHeader>
          <CardTitle>Cuentas Conectadas</CardTitle>
          <CardDescription>
            Selecciona una cuenta para ver su análisis detallado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando...</div>
          ) : accounts && accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map(account => (
                <Card
                  key={account.id}
                  className="cursor-pointer transition-all hover:border-teal/50 hover:shadow-lg border-line/30 group"
                  onClick={() => handleAccountClick(account.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground text-lg">#{account.login}</p>
                        <p className="text-sm text-muted-foreground">{account.server}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.status === 'verified' ? (
                          <CheckCircle2 className="w-5 h-5 text-teal" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className="bg-teal/20 text-teal border-teal/30">
                        {account.platform?.toUpperCase()}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-teal transition-colors" />
                    </div>

                    {account.last_sync_at && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Última sync: {new Date(account.last_sync_at).toLocaleString()}
                      </p>
                    )}

                    {account.sync_error && (
                      <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded">
                        <p className="text-xs text-destructive">
                          Error de conexión
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                No hay cuentas conectadas
              </p>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Conecta tu primera cuenta MT4/MT5 para comenzar a analizar tu trading
              </p>
              <Button onClick={() => setShowConnectModal(true)} className="bg-teal hover:bg-teal/90">
                <Plus className="w-4 h-4 mr-2" />
                Conectar tu primera cuenta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConnectAccountModal
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
      />
    </div>
  );
};
