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
          <div className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertDescription className="space-y-3">
                <p className="font-semibold text-base">
                  📋 {t('tools.audit.why_verify', '¿Por qué verificar la cuenta?')}
                </p>
                <p className="text-sm">
                  {t('tools.audit.verification_intro', 'Para conectarnos de forma segura a tu cuenta MT4/MT5, necesitamos confirmar que eres el dueño. Solo toma 1 minuto.')}
                </p>
                <p className="text-sm font-medium">
                  {t('tools.audit.verification_method', '✓ Verificación mediante orden pendiente temporal')}
                </p>
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => startVerification.mutate()} 
              disabled={startVerification.isPending}
              className="w-full bg-teal hover:bg-teal/90"
              size="lg"
            >
              {startVerification.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('tools.audit.generate_code', '1️⃣ Generar mi Código de Verificación')}
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Código destacado */}
            <div className="bg-gradient-to-br from-teal/20 to-teal/5 p-6 rounded-lg border-2 border-teal/50">
              <p className="text-sm font-semibold text-center mb-3">
                🔑 {t('tools.audit.your_code', 'TU CÓDIGO DE VERIFICACIÓN')}
              </p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <Badge className="text-3xl font-mono px-6 py-3 bg-background border-2 border-teal/50 text-teal tracking-wider">
                  {verification.key}
                </Badge>
                <Button size="lg" variant="outline" onClick={copyKey} className="border-teal/50">
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {t('tools.audit.click_to_copy', '☝️ Clic en el botón para copiar el código')}
              </p>
            </div>

            {/* Instrucciones paso a paso */}
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertDescription>
                <p className="font-semibold mb-3 text-base">
                  📝 {t('tools.audit.follow_steps', 'Sigue estos pasos en tu plataforma MT4/MT5:')}
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-bold text-teal min-w-[24px]">1.</span>
                    <span>{t('tools.audit.step1_detail', 'Abre tu plataforma MetaTrader 4 o 5 con la cuenta que conectaste')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-teal min-w-[24px]">2.</span>
                    <div>
                      <p className="mb-1">{t('tools.audit.step2_detail', 'Crea una orden PENDIENTE (no ejecutable):')}</p>
                      <ul className="list-disc list-inside ml-4 text-xs space-y-1 text-muted-foreground">
                        <li>{t('tools.audit.step2a', 'Elige Buy Limit o Sell Limit')}</li>
                        <li>{t('tools.audit.step2b', 'Ponla MUY LEJOS del precio actual (ejemplo: si EURUSD está en 1.10, ponla en 0.50 o 2.00)')}</li>
                        <li className="font-semibold text-yellow-400">{t('tools.audit.step2c', '¡Así NO se ejecutará y no gastarás dinero!')}</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-teal min-w-[24px]">3.</span>
                    <div>
                      <p className="mb-1">{t('tools.audit.step3_detail', 'En el campo "Comment" o "Comentario", pega EXACTAMENTE este código:')}</p>
                      <code className="block mt-2 bg-background px-3 py-2 rounded border border-teal/30 text-teal font-mono text-base">
                        {verification.key}
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-teal min-w-[24px]">4.</span>
                    <span>{t('tools.audit.step4_detail', 'Confirma y crea la orden pendiente')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-teal min-w-[24px]">5.</span>
                    <span>{t('tools.audit.step5_detail', 'Regresa aquí y haz clic en "Verificar Ahora"')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-500 min-w-[24px]">6.</span>
                    <span className="text-muted-foreground italic">{t('tools.audit.step6_detail', 'Una vez verificado, puedes eliminar la orden pendiente desde MT4/MT5')}</span>
                  </li>
                </ol>
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => verifyAccount.mutate()}
              disabled={verifyAccount.isPending}
              className="w-full bg-teal hover:bg-teal/90"
              size="lg"
            >
              {verifyAccount.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('tools.audit.verify_now', '✓ Verificar Ahora')}
            </Button>

            <p className="text-xs text-muted-foreground text-center bg-background/50 py-2 rounded">
              ⏱️ {t('tools.audit.expires', 'Este código expira el:')} <span className="font-semibold">{new Date(verification.expires_at).toLocaleString()}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
