import { Shield, TrendingUp, Users, ExternalLink, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ValueProposition() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Shield,
      titleKey: 'landing:value_pillar1_title',
      descKey: 'landing:value_pillar1_desc',
      proofKey: 'landing:value_pillar1_proof',
      delay: 0.2
    },
    {
      icon: TrendingUp,
      titleKey: 'landing:value_pillar2_title',
      descKey: 'landing:value_pillar2_desc',
      proofKey: 'landing:value_pillar2_proof',
      delay: 0.35
    },
    {
      icon: Users,
      titleKey: 'landing:value_pillar3_title',
      descKey: 'landing:value_pillar3_desc',
      proofKey: 'landing:value_pillar3_proof',
      delay: 0.5
    }
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-background via-background/98 to-background">
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading */}
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
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Por qué elegirnos</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {t('landing:value_title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing:value_subtitle')}
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: pillar.delay, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-br from-card via-card to-card/80 border-2 border-border hover:border-primary/50 rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {t(pillar.titleKey)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {t(pillar.descKey)}
                      </p>
                    </div>
                    
                    {/* Proof point */}
                    <div className="pt-3 border-l-2 border-primary/30 pl-3 bg-primary/5 -ml-1 -mr-1 px-4 py-2 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t(pillar.proofKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* IB Model Note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="relative bg-gradient-to-br from-muted/40 via-muted/30 to-muted/20 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-500 shadow-md hover:shadow-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground flex-1 leading-relaxed text-sm">
                {t('landing:value_ib_note')}{' '}
                <a 
                  href="https://www.investopedia.com/terms/i/introducingbroker.asp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all duration-300"
                >
                  {t('landing:value_ib_learn')} <ExternalLink className="w-4 h-4" />
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg"
            onClick={() => navigate('/auth/validate')}
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('landing:exness_have')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate('/onboarding')}
            className="group border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              {t('landing:cta_access')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
