import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const CopyTradingIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['copy']);
  
  return (
    <Card className="border-line bg-surface/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground">{t('copy:intro.title')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('copy:intro.description')}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              {t('copy:intro.important')}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <Shield className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">{t('copy:intro.warning_title')}</strong> {t('copy:intro.warning_text')}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/academy')}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {t('copy:intro.cta_learn')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {t('copy:intro.cta_view_all')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
