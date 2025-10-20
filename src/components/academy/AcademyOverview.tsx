import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, BookOpen, BarChart3, Zap, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AcademyJourney from "./AcademyJourney";

export default function AcademyOverview() {
  const navigate = useNavigate();
  const { t } = useTranslation('academy');

  const scrollToSyllabus = () => {
    const syllabusElement = document.getElementById('syllabus-section');
    syllabusElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const differences = [
    {
      icon: <Shield className="w-6 h-6 text-teal" />,
      title: t('overview.diff1_title'),
      description: t('overview.diff1_desc'),
      badge: t('overview.diff1_badge')
    },
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: t('overview.diff2_title'),
      description: t('overview.diff2_desc'),
      badge: t('overview.diff2_badge')
    },
    {
      icon: <BookOpen className="w-6 h-6 text-accent" />,
      title: t('overview.diff3_title'),
      description: t('overview.diff3_desc'),
      badge: t('overview.diff3_badge')
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-teal" />,
      title: t('overview.diff4_title'),
      description: t('overview.diff4_desc'),
      badge: t('overview.diff4_badge')
    }
  ];

  return (
    <div className="space-y-20">
      {/* Nuestra diferencia */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal/20 to-primary/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                {t('overview.title')}
              </h2>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('overview.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {differences.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="bg-surface/50 backdrop-blur-2xl border-primary/20 shadow-xl p-6 group hover:border-primary/50 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-400 h-full relative overflow-hidden">
                  {/* Border glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  
                  <div className="flex items-center gap-4 relative">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-primary/20 group-hover:scale-110 group-hover:shadow-lg transition-all duration-400 flex-shrink-0">
                      {diff.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-foreground text-lg">
                          {diff.title}
                        </h3>
                        <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30 text-xs whitespace-nowrap">
                          {diff.badge}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Journey component */}
      <AcademyJourney />

      {/* CTA intermedio */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-2xl border-primary/20 shadow-2xl p-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {t('overview.cta_title')}
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                {t('overview.cta_description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate("/access")}
                  className="bg-gradient-primary hover:shadow-glow text-lg px-10 py-7 h-auto rounded-2xl group transition-all duration-400"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  {t('overview.cta_primary')}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={scrollToSyllabus}
                  className="border-2 border-primary/40 bg-surface/60 backdrop-blur-xl hover:bg-primary/20 hover:border-primary/60 hover:shadow-glow text-lg px-10 py-7 h-auto rounded-2xl transition-all duration-400"
                >
                  {t('overview.cta_secondary')}
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
