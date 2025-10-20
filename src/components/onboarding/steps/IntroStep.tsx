import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, User, Target, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface IntroStepProps {
  onContinue: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const IntroStep = ({ onContinue, onBack, canGoBack }: IntroStepProps) => {
  const steps = [
    {
      icon: Mail,
      number: "1",
      title: "Crea tu cuenta en Exness",
      description: "Abre una cuenta bajo nuestro link de partner. Si ya tienes cuenta, solicita cambio de partner",
      highlight: true
    },
    {
      icon: CheckCircle2,
      number: "2",
      title: "Valida tu afiliación",
      description: "Confirmamos que tu cuenta está vinculada a nuestro partner para darte acceso"
    },
    {
      icon: User,
      number: "3",
      title: "Completa tu perfil",
      description: "Cuéntanos sobre tu experiencia y objetivos en el trading"
    },
    {
      icon: Target,
      number: "4",
      title: "Recibe tu plan",
      description: "Obtén recomendaciones personalizadas y accede al ecosistema completo"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4 max-w-6xl mx-auto"
    >
      {/* Compact Hero Section */}
      <div className="text-center space-y-3 relative">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent rounded-full" />
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center justify-center mb-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-primary/40 rounded-2xl blur-xl opacity-40" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-2xl flex items-center justify-center border border-primary/20">
              <Sparkles className="h-8 w-8 text-primary" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Bienvenido a Tálamo
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm sm:text-base text-muted-foreground/90 max-w-2xl mx-auto"
        >
          Tu ecosistema profesional de trading en 4 simples pasos
        </motion.p>
      </div>

      {/* Horizontal Steps Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {steps.map((stepItem, index) => (
          <motion.div
            key={stepItem.number}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.5 + (0.1 * index), 
              duration: 0.3
            }}
          >
            <Card className={`h-full border-2 ${stepItem.highlight ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-surface/30' : 'border-border/40 bg-gradient-to-br from-surface/90 to-surface/30'} backdrop-blur-xl shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300 group`}>
              <CardContent className="p-4 h-full flex flex-col">
                {/* Icon & Number */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stepItem.highlight ? 'from-primary/35 to-primary/10' : 'from-primary/25 to-primary/5'} rounded-xl flex items-center justify-center border ${stepItem.highlight ? 'border-primary/40' : 'border-primary/20'}`}>
                    <stepItem.icon className="h-5 w-5 text-primary" strokeWidth={2.5} />
                  </div>
                  <span className={`text-xs font-bold ${stepItem.highlight ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary/10'} px-2 py-0.5 rounded`}>
                    {stepItem.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {stepItem.description}
                  </p>
                </div>

                {/* Check Icon */}
                <CheckCircle2 className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/40 transition-colors mt-2 self-end" strokeWidth={2} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Compact Info Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-xl">
          <CardContent className="p-3">
            <div className="flex gap-2 items-start">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  ¿Por qué verificamos tu afiliación?
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tálamo no cobra membresía. Nos sostenemos con rebates del broker cuando operas. Sin costo extra para ti.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compact CTA Buttons */}
      <motion.div 
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        {canGoBack && onBack && (
          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            className="h-12 px-5 rounded-xl border-2 border-border/40 hover:border-primary/40 hover:bg-background/80 backdrop-blur-sm transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        )}
        <Button
          size="lg"
          onClick={onContinue}
          className="group relative flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary/80 text-base font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-primary/20"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span className="relative flex items-center gap-2 text-primary-foreground">
            Empezar
            <motion.span
              animate={{ x: [0, 3, 0] }}
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
