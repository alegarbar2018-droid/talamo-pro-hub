import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, Copy, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VerificationPanelProps {
  accountId: string;
}

export const VerificationPanel = ({ accountId }: VerificationPanelProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: verification } = useQuery({
    queryKey: ['audit-verification', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_verification')
        .select('*')
        .eq('account_id', accountId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const startVerification = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('audit-start-verification', {
        body: { account_id: accountId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-verification', accountId] });
      toast({ 
        title: t('tools.audit.code_generated', 'Código generado'), 
        description: t('tools.audit.use_code_in_comment', 'Usa este código en el comment de tu orden') 
      });
    },
  });

  const verifyAccount = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('audit-verify-account', {
        body: { account_id: accountId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.verified) {
        toast({ 
          title: t('tools.audit.account_verified', '✓ Cuenta verificada'), 
          description: t('tools.audit.verified_success', 'Tu cuenta ha sido verificada exitosamente') 
        });
        queryClient.invalidateQueries({ queryKey: ['audit-accounts'] });
      } else {
        toast({
          title: t('tools.audit.order_not_found', 'Orden no encontrada'),
          description: t('tools.audit.ensure_correct_comment', 'Asegúrate de crear la orden con el comment correcto'),
          variant: 'destructive',
        });
      }
    },
  });

  const copyKey = () => {
    if (verification?.key) {
      navigator.clipboard.writeText(verification.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-500/10 to-surface border-yellow-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-500" />
          {t('tools.audit.verification_pending', 'Verificación Pendiente')}
        </CardTitle>
        <CardDescription>
          {t('tools.audit.verify_ownership', 'Verifica la propiedad de tu cuenta siguiendo estos pasos')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!verification ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('tools.audit.verification_intro', 'Para verificar que eres el dueño de la cuenta, necesitamos que crees una orden pendiente temporal.')}
            </p>
            <Button onClick={() => startVerification.mutate()} disabled={startVerification.isPending}>
              {startVerification.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('tools.audit.generate_code', 'Generar Código de Verificación')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-line/30">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  {t('tools.audit.verification_code', 'Código de Verificación')}
                </p>
                <Badge className="text-lg font-mono bg-teal/20 text-teal border-teal/30">
                  {verification.key}
                </Badge>
              </div>
              <Button size="sm" variant="ghost" onClick={copyKey}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>{t('tools.audit.step1', 'Abre tu plataforma MT4/MT5')}</li>
                  <li>{t('tools.audit.step2', 'Crea una orden pendiente (Buy Limit o Sell Limit) muy lejos del precio actual')}</li>
                  <li>
                    {t('tools.audit.step3', 'En el campo Comment, escribe exactamente:')} <code className="bg-muted px-1 py-0.5 rounded">{verification.key}</code>
                  </li>
                  <li>{t('tools.audit.step4', 'Confirma la orden (no se ejecutará por estar muy lejos del precio)')}</li>
                  <li>{t('tools.audit.step5', 'Haz clic en "Verificar Ahora" abajo')}</li>
                  <li>{t('tools.audit.step6', 'Una vez verificado, puedes cancelar la orden pendiente')}</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                onClick={() => verifyAccount.mutate()}
                disabled={verifyAccount.isPending}
                className="flex-1 bg-teal hover:bg-teal/90"
              >
                {verifyAccount.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('tools.audit.verify_now', 'Verificar Ahora')}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {t('tools.audit.expires', 'Código expira:')} {new Date(verification.expires_at).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
