import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAffiliationGate } from '@/hooks/useAffiliationGate';
import { useTranslation } from 'react-i18next';

export const AffiliationGateBlock = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { status, isLoading } = useAffiliationGate();
  
  if (isLoading) {
    return (
      <Card className="border-line bg-surface/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('copy.gating.validating')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (status?.status === 'eligible') {
    return (
      <Alert className="border-green-500/20 bg-green-500/5">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-sm">
          {t('copy.gating.eligible')}
        </AlertDescription>
      </Alert>
    );
  }
  
  // Blocked state
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <XCircle className="h-5 w-5 text-destructive" />
          {t('copy.gating.blocked')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('copy.gating.blocked_message')}
        </p>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {status?.message || t('copy.disclaimers.affiliation')}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => navigate('/validate')}
            className="flex-1"
          >
            {t('copy.gating.cta_validate')}
          </Button>
          <Button
            onClick={() => window.open(import.meta.env.VITE_EXNESS_PARTNER_LINK || 'https://one.exness-track.com/a/4nf0qm6u0b', '_blank')}
            variant="outline"
            className="flex-1"
          >
            {t('copy.gating.cta_create')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
