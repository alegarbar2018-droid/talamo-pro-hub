import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AffiliationGateBlock = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <Card className="border-line bg-surface/50">
      <CardContent className="p-6 space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {t('copy.disclaimers.affiliation')}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => navigate('/validate')}
            variant="outline"
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
