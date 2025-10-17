import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RealisticExpectations = () => {
  const { t } = useTranslation(['copy']);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">{t('copy:simple.expectations.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('copy:simple.expectations.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">{t('copy:simple.expectations.realistic_title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('copy:simple.expectations.realistic_desc')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">{t('copy:simple.expectations.patience_title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('copy:simple.expectations.patience_desc')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-destructive">{t('copy:simple.expectations.risk_title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('copy:simple.expectations.risk_desc')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
