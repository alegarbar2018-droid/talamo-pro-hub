import { GraduationCap, TrendingUp, Copy, Bot, Wrench, LineChart, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ValueProposition() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const offerings = [
    {
      icon: GraduationCap,
      title: "Academia Estructurada",
      description: "Cursos progresivos desde cero hasta estrategias avanzadas con certificaciones",
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: "Señales Verificadas",
      description: "Análisis profesional con transparencia total y métricas de desempeño",
      delay: 0.3
    },
    {
      icon: Copy,
      title: "Copy Trading",
      description: "Replica estrategias de traders profesionales con control de riesgo",
      delay: 0.4
    },
    {
      icon: Bot,
      title: "Expert Advisors",
      description: "Bots de trading automatizado con estrategias probadas y backtesting",
      delay: 0.5
    },
    {
      icon: Wrench,
      title: "Herramientas Pro",
      description: "Calculadoras, journal de trading, análisis de riesgo y especificaciones de contratos",
      delay: 0.6
    },
    {
      icon: LineChart,
      title: "Auditoría de Cuenta",
      description: "Análisis completo de tu desempeño con métricas y recomendaciones",
      delay: 0.7
    }
  ];

  return (
    <section id="que-es-talamo" className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-background via-background/98 to-background">
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
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Conócenos</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            ¿Qué es <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Tálamo</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Tálamo es un ecosistema profesional de trading que combina educación estructurada, 
            herramientas avanzadas y múltiples métodos de ejecución para traders de todos los niveles.
          </p>
        </motion.div>

        {/* What we offer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
          {offerings.map((offering, index) => {
            const Icon = offering.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: offering.delay, duration: 0.6 }}
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
                        {offering.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {offering.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Free access note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">100% Gratis</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Acceso completo sin costo
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Todo el ecosistema es <span className="text-primary font-semibold">completamente gratuito</span> para ti. 
                Ganamos por spread cuando operas en Exness con nuestra afiliación IB, lo que nos alinea contigo: 
                si te va bien, operas más; si operas más, nosotros ganamos. Sin cargos ocultos ni membresías.
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
