import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Globe, Wallet, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FundingInstructions = () => {
  const { t } = useTranslation(['copy']);
  
  return (
    <Card className="border-line bg-surface/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          {t('copy:funding.title', 'Cómo Fondear tu Wallet de Inversionista')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-primary/5 border-primary/20">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            {t('copy:funding.subtitle', 'Mínimo de depósito: $10 USD. Los fondos aparecen instantáneamente.')}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" />
              {t('copy:funding.mobile_tab', 'App Móvil')}
            </TabsTrigger>
            <TabsTrigger value="web" className="gap-2">
              <Globe className="h-4 w-4" />
              {t('copy:funding.web_tab', 'Web')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mobile" className="space-y-3 mt-4">
            <h4 className="font-semibold text-sm">{t('copy:funding.mobile_title', 'Desde la App de Exness Copy Trading')}</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>{t('copy:funding.mobile_step1', 'Descarga e instala la app "Exness Copy Trading" (iOS/Android)')}</li>
              <li>{t('copy:funding.mobile_step2', 'Inicia sesión con tus credenciales de Exness')}</li>
              <li>{t('copy:funding.mobile_step3', 'Ve a la pestaña Profile (Perfil)')}</li>
              <li>{t('copy:funding.mobile_step4', 'Bajo "Investment wallet", selecciona Deposit (Depositar)')}</li>
              <li>{t('copy:funding.mobile_step5', 'Elige un método de pago de la lista')}</li>
              <li>{t('copy:funding.mobile_step6', 'Ingresa el monto (mínimo $10 USD) y confirma')}</li>
              <li className="font-medium text-foreground">{t('copy:funding.mobile_step7', '¡Listo! Los fondos aparecen al instante')}</li>
            </ol>
          </TabsContent>
          
          <TabsContent value="web" className="space-y-3 mt-4">
            <h4 className="font-semibold text-sm">{t('copy:funding.web_title', 'Desde la Personal Area Web')}</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>{t('copy:funding.web_step1', 'Inicia sesión en my.exness.com')}</li>
              <li>{t('copy:funding.web_step2', 'Ve a la pestaña Copy Trading (o Social Trading)')}</li>
              <li>{t('copy:funding.web_step3', 'Haz clic en la pestaña Assets (Activos)')}</li>
              <li>{t('copy:funding.web_step4', 'En "Investment wallet", haz clic en Deposit')}</li>
              <li>{t('copy:funding.web_step5', 'Selecciona método de pago e ingresa el monto')}</li>
              <li>{t('copy:funding.web_step6', 'Completa los detalles de pago y confirma')}</li>
              <li className="font-medium text-foreground">{t('copy:funding.web_step7', 'Sigue las instrucciones hasta finalizar')}</li>
            </ol>
          </TabsContent>
        </Tabs>

        <Alert>
          <AlertDescription className="text-xs">
            {t('copy:funding.note', '💡 Tip: Una vez fondeado, puedes distribuir tus fondos entre las estrategias que eligas desde Tálamo.')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
