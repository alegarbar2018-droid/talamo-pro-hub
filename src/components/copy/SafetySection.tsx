import { Card } from '@/components/ui/card';
import { Shield, Lock, Eye, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SafetySection = () => {
  const { t } = useTranslation(['copy']);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">{t('copy:simple.safety.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('copy:simple.safety.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('copy:simple.safety.point1_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('copy:simple.safety.point1_desc')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Ban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('copy:simple.safety.point2_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('copy:simple.safety.point2_desc')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('copy:simple.safety.point3_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('copy:simple.safety.point3_desc')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('copy:simple.safety.point4_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('copy:simple.safety.point4_desc')}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
