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

      {/* Steps Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Comienza en 4 simples pasos
          </h2>
          <p className="text-muted-foreground">
            Todo el proceso en una sola pantalla
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {steps.map((stepItem, index) => (
            <motion.div
              key={stepItem.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.6 + (0.1 * index), 
                duration: 0.5
              }}
            >
              <Card className={`border-2 ${stepItem.highlight ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-surface/60 to-surface/30' : 'border-border/40 bg-gradient-to-br from-surface/90 via-surface/60 to-surface/30'} backdrop-blur-2xl shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 group`}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stepItem.highlight ? 'from-primary/30 to-primary/10' : 'from-primary/20 to-primary/5'} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                      <div className={`relative w-14 h-14 bg-gradient-to-br ${stepItem.highlight ? 'from-primary/35 via-primary/20 to-primary/10' : 'from-primary/25 via-primary/15 to-primary/5'} rounded-2xl flex items-center justify-center border-2 ${stepItem.highlight ? 'border-primary/40' : 'border-primary/20'} group-hover:border-primary/40 transition-all duration-300`}>
                        <stepItem.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${stepItem.highlight ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary/10'} px-2 py-1 rounded-lg`}>
                          Paso {stepItem.number}
                        </span>
                        {stepItem.highlight && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg animate-pulse">
                            Importante
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {stepItem.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {stepItem.description}
                      </p>
                    </div>

                    {/* Check Icon */}
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300 flex-shrink-0 mt-1" strokeWidth={2} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent backdrop-blur-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  ¿Por qué verificamos tu afiliación?
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Tálamo no cobra membresía. Nuestro modelo se sostiene con rebates que el broker nos paga cuando operas. 
                  No hay costo extra para ti y alineamos incentivos: solo ganamos si tú operas con estructura.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div 
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
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
