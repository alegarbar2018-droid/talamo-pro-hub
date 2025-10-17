import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Calculator, TrendingUp, Users, Shield, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface IntroStepProps {
  onContinue: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const IntroStep = ({ onContinue, onBack, canGoBack }: IntroStepProps) => {
  const features = [
    {
      icon: GraduationCap,
      title: "Academia estructurada",
      description: "Educación con métricas de dominio desde cero"
    },
    {
      icon: Calculator,
      title: "Herramientas de cálculo",
      description: "Sizing, margen, TP/SL, riesgo y más"
    },
    {
      icon: TrendingUp,
      title: "Señales verificadas",
      description: "Con KPIs auditados y tracking de desempeño"
    },
    {
      icon: Users,
      title: "Copy trading serio",
      description: "Directorio de traders con métricas transparentes"
    },
    {
      icon: Shield,
      title: "Comunidad para consistencia",
      description: "Sin promesas irreales ni upsells agresivos"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 sm:space-y-10"
    >
      {/* Hero Section */}
      <div className="text-center space-y-6 sm:space-y-8 relative">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent rounded-full" />
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-primary/40 rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-3xl flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(var(--primary),0.4)] backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-12 w-12 sm:h-14 sm:w-14 text-primary drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight tracking-tight"
        >
          Bienvenido a Tálamo
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Tu ecosistema profesional de trading: educación, herramientas, señales y copy trading
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="border-2 border-border/40 bg-gradient-to-br from-surface/90 via-surface/60 to-surface/30 backdrop-blur-2xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_80px_-10px_rgba(var(--primary),0.15)] transition-all duration-500">
          <CardContent className="p-5 sm:p-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 0.6 + (0.08 * index), 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-background/70 via-background/50 to-background/30 border-2 border-border/30 hover:border-primary/40 hover:bg-background/60 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_8px_30px_rgb(var(--primary)/0.3)] transition-all duration-300 border border-primary/10">
                      <feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/80 leading-snug line-clamp-2 hidden sm:block">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-2 border-border/40 bg-gradient-to-br from-surface/70 to-surface/40 backdrop-blur-xl rounded-2xl px-5 py-1 shadow-lg hover:shadow-xl transition-all duration-300">
            <AccordionTrigger className="text-base sm:text-lg font-bold hover:text-primary transition-colors duration-300 py-5">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
                ¿Por qué verificar afiliación?
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed space-y-4 pt-2 pb-6 px-1">
              <p className="backdrop-blur-sm bg-background/30 p-4 rounded-xl border border-border/30">
                <strong className="text-foreground font-bold">Tálamo no cobra membresía.</strong> Nuestro modelo se sostiene con rebates de spread cuando operas con tu cuenta Exness afiliada a Tálamo. Estos rebates los paga el broker, no tú, así que no hay costo extra.
              </p>
              <p>
                Esto alinea nuestros incentivos: solo ganamos si tú operas con estructura a largo plazo. Nuestra prioridad es darte herramientas para ejecución con datos y control de riesgo, no vender promesas irreales.
              </p>
              <p className="text-xs sm:text-sm italic text-muted-foreground/70 border-l-4 border-primary/30 pl-4 py-2">
                Validamos únicamente tu email para confirmar la afiliación. Nunca accedemos a tus fondos ni operamos tu cuenta.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div 
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        {canGoBack && onBack && (
          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            className="h-16 sm:h-18 px-7 rounded-2xl border-2 border-border/40 hover:border-primary/40 hover:bg-background/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        )}
        <Button
          size="lg"
          onClick={onContinue}
          className="group relative flex-1 h-16 sm:h-18 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary hover:via-primary/90 hover:to-primary/80 text-base sm:text-xl font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] active:scale-[0.98] border-2 border-primary/20"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span className="relative flex items-center gap-3 text-primary-foreground drop-shadow-sm">
            Empezar
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
};
