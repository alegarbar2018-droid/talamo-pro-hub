import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Sparkles, Award, Shield } from "lucide-react";

interface PremiumEligibleStepProps {
  onContinue: () => void;
}

export const PremiumEligibleStep = ({ onContinue }: PremiumEligibleStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-surface/50 backdrop-blur-sm rounded-2xl shadow-xl">
        <CardHeader className="text-center space-y-6 pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-yellow-800" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              ¡Afiliación confirmada! 🎉
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground leading-relaxed">
              Tu cuenta de Exness está correctamente afiliada a Tálamo. 
              <span className="block mt-2 text-primary font-semibold">
                Ya puedes acceder a todos nuestros servicios profesionales.
              </span>
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-surface/80 border border-line rounded-xl p-4 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-foreground">Academia Premium</h3>
              <p className="text-xs text-muted-foreground">Acceso completo</p>
            </div>
            <div className="bg-surface/80 border border-line rounded-xl p-4 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-foreground">Señales Verificadas</h3>
              <p className="text-xs text-muted-foreground">En tiempo real</p>
            </div>
            <div className="bg-surface/80 border border-line rounded-xl p-4 text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-foreground">Copy Trading</h3>
              <p className="text-xs text-muted-foreground">Inteligente</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="bg-background/50 border border-primary/20 rounded-xl p-6 space-y-4"
          >
            <h4 className="font-semibold text-foreground text-center">
              Siguiente paso: Crear tu contraseña
            </h4>
            <p className="text-sm text-muted-foreground text-center">
              Configura una contraseña segura para acceder a tu panel de Tálamo
            </p>
            
            <Button
              onClick={onContinue}
              className="w-full h-12 bg-gradient-primary hover:shadow-glow rounded-xl font-semibold text-lg"
              aria-label="Continuar al siguiente paso"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Configurar contraseña
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="text-center"
      >
        <p className="text-xs text-muted-foreground">
          Tu información está protegida y cifrada. Al continuar, acepta nuestros términos de servicio.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PremiumEligibleStep;