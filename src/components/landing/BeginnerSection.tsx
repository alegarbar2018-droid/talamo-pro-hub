import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Clock, Target, TrendingUp, Award, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const BeginnerSection = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();

  return (
    <section id="para-principiantes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              {t('beginner_badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('beginner_title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              {t('beginner_subtitle')}
            </p>
            <p className="text-muted-foreground">
              {t('beginner_reality')}
            </p>
          </div>

          {/* Learning Path Timeline */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('beginner_month1')}</h3>
                  <p className="text-xs text-muted-foreground">{t('beginner_hours')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{t('beginner_month1_desc')}</p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Award className="w-4 h-4" />
                <span>{t('beginner_month1_milestone')}</span>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('beginner_month23')}</h3>
                  <p className="text-xs text-muted-foreground">{t('beginner_practice')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{t('beginner_month23_desc')}</p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Award className="w-4 h-4" />
                <span>{t('beginner_month23_milestone')}</span>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('beginner_month46')}</h3>
                  <p className="text-xs text-muted-foreground">{t('beginner_consistency')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{t('beginner_month46_desc')}</p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Award className="w-4 h-4" />
                <span>{t('beginner_month46_milestone')}</span>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/academy-info')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {t('beginner_cta')}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              {t('beginner_lessons_count')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
