import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Calculator, TrendingUp, Users, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface IntroStepProps {
  onContinue: () => void;
}

export const IntroStep = ({ onContinue }: IntroStepProps) => {
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
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl flex items-center justify-center shadow-glow-primary">
            <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          Bienvenido a Tálamo
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tu ecosistema profesional de trading: educación, herramientas, señales y copy trading
        </p>
      </div>

      {/* Features Grid */}
      <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-primary transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-border/50 bg-surface/50 rounded-xl px-4">
          <AccordionTrigger className="text-base sm:text-lg font-semibold hover:text-primary">
            ¿Por qué verificar afiliación?
          </AccordionTrigger>
          <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3 pt-2 pb-4">
            <p>
              <strong className="text-foreground">Tálamo no cobra membresía.</strong> Nuestro modelo se sostiene con rebates de spread cuando operas con tu cuenta Exness afiliada a Tálamo. Estos rebates los paga el broker, no tú, así que no hay costo extra.
            </p>
            <p>
              Esto alinea nuestros incentivos: solo ganamos si tú operas con estructura a largo plazo. Nuestra prioridad es darte herramientas para ejecución con datos y control de riesgo, no vender promesas irreales.
            </p>
            <p>
              Validamos únicamente tu email para confirmar la afiliación. Nunca accedemos a tus fondos ni operamos tu cuenta.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* CTA Button */}
      <Button
        size="lg"
        onClick={onContinue}
        className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Empezar
      </Button>
    </motion.div>
  );
};
