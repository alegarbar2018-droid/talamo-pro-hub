import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, Target, TrendingUp, Award, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const BeginnerSection = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();

  const milestones = [
    {
      icon: Clock,
      titleKey: 'beginner_month1',
      timeKey: 'beginner_hours',
      descKey: 'beginner_month1_desc',
      milestoneKey: 'beginner_month1_milestone',
      delay: 0.2
    },
    {
      icon: Target,
      titleKey: 'beginner_month23',
      timeKey: 'beginner_practice',
      descKey: 'beginner_month23_desc',
      milestoneKey: 'beginner_month23_milestone',
      delay: 0.35
    },
    {
      icon: TrendingUp,
      titleKey: 'beginner_month46',
      timeKey: 'beginner_consistency',
      descKey: 'beginner_month46_desc',
      milestoneKey: 'beginner_month46_milestone',
      delay: 0.5
    }
  ];

  return (
    <section id="para-principiantes" className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-muted/30 via-muted/20 to-background">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('beginner_badge')}</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {t('beginner_title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('beginner_subtitle')}
            </p>
            <p className="text-muted-foreground font-medium">
              {t('beginner_reality')}
            </p>
          </motion.div>

          {/* Learning Path Timeline */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: milestone.delay, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="relative h-full bg-gradient-to-br from-card via-card to-card/80 border-2 border-border hover:border-primary/50 rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative space-y-4">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500" />
                          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                            <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {t(milestone.titleKey)}
                          </h3>
                          <p className="text-xs text-muted-foreground">{t(milestone.timeKey)}</p>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(milestone.descKey)}
                      </p>
                      
                      {/* Milestone */}
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-primary font-medium leading-relaxed">
                            {t(milestone.milestoneKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center space-y-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/academy-info')}
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {t('beginner_cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('beginner_lessons_count')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
