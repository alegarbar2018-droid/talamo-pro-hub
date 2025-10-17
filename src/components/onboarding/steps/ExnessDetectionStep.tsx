import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ExnessDetectionStepProps {
  onHasExness: () => void;
  onNoExness: () => void;
  onTryAnotherEmail: () => void;
}

export const ExnessDetectionStep = ({ 
  onHasExness, 
  onNoExness,
  onTryAnotherEmail 
}: ExnessDetectionStepProps) => {
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
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Tu email no está afiliado con Tálamo
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ¿Ya tienes una cuenta en Exness?
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Sí tengo Exness */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Card
            className="border-2 border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 hover:border-primary/50 hover:shadow-glow-primary cursor-pointer transition-all duration-300 group"
            onClick={onHasExness}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-primary transition-all duration-300">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Sí, ya tengo cuenta en Exness
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Cambiar mi afiliación a Tálamo (proceso simple con soporte de Exness)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* No tengo Exness */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card
            className="border-2 border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 hover:border-primary/50 hover:shadow-glow-primary cursor-pointer transition-all duration-300 group"
            onClick={onNoExness}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-primary transition-all duration-300">
                  <PlusCircle className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    No, crear cuenta nueva afiliada
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Registrarme en Exness con afiliación directa a Tálamo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer Link */}
      <div className="text-center pt-2">
        <button
          onClick={onTryAnotherEmail}
          className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Probar con otro email
        </button>
      </div>
    </motion.div>
  );
};
