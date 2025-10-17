import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, CheckCircle, Globe, Shield, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { PARTNER_LINK } from "@/lib/constants";

interface NoExnessFlowStepProps {
  onAccountCreated: () => void;
}

export const NoExnessFlowStep = ({ onAccountCreated }: NoExnessFlowStepProps) => {
  const handleCreateAccount = () => {
    window.open(PARTNER_LINK, "_blank");
    console.info('open_partner_link_no_exness_flow');
  };

  const benefits = [
    { icon: CheckCircle, text: "Proceso rápido (~3 minutos)" },
    { icon: Globe, text: "Puedes usar un email diferente" },
    { icon: Shield, text: "Sin costo extra por afiliación" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-glow-primary">
            <ExternalLink className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Crear cuenta afiliada con Tálamo
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Abrirás una nueva cuenta en Exness directamente afiliada con nosotros
        </p>
      </div>

      {/* Benefits */}
      <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-foreground font-medium">
                  {benefit.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Gmail Tip */}
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">
                  Tip: Mantén organizado tu email
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Si usas Gmail, prueba{" "}
                  <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">
                    tunombre+exness@gmail.com
                  </code>
                  {" "}para mantener tus cuentas organizadas
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              onClick={handleCreateAccount}
              className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Crear cuenta afiliada
            </Button>

            <p className="text-sm text-center text-muted-foreground px-2">
              Cuando termines, vuelve aquí:
            </p>

            <Button
              size="lg"
              variant="outline"
              onClick={onAccountCreated}
              className="w-full h-12 sm:h-14 border-primary/40 text-primary hover:bg-primary/5 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300"
            >
              Ya la creé, validar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
