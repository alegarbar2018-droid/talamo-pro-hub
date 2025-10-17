import { Card } from '@/components/ui/card';
import { Users, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CopyTradingIntroSimple = () => {
  const { t } = useTranslation(['copy']);

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">{t('copy:simple.how_it_works.title')}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('copy:simple.how_it_works.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('copy:simple.how_it_works.step1_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('copy:simple.how_it_works.step1_desc')}</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('copy:simple.how_it_works.step2_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('copy:simple.how_it_works.step2_desc')}</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('copy:simple.how_it_works.step3_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('copy:simple.how_it_works.step3_desc')}</p>
        </Card>
      </div>
    </section>
  );
};
