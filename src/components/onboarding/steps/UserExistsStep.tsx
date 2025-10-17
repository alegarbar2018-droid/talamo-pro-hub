import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface UserExistsStepProps {
  email: string;
  onTryAnotherEmail: () => void;
}

export const UserExistsStep = ({ email, onTryAnotherEmail }: UserExistsStepProps) => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Success Icon */}
      <div className="text-center space-y-4 sm:space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          className="flex items-center justify-center mb-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent rounded-full flex items-center justify-center shadow-glow-primary">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          ¡Ya tienes cuenta en Tálamo!
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Este email ya está registrado. Inicia sesión para acceder a tu ecosistema de trading
        </p>
      </div>

      {/* Email Display */}
      <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="p-4 rounded-xl bg-background/50 border border-border/30">
            <p className="text-sm text-muted-foreground mb-1">Email registrado:</p>
            <p className="text-base sm:text-lg font-semibold text-foreground break-all">
              {email}
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleGoToLogin}
            className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Ir a Iniciar Sesión
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>

          <div className="text-center pt-2">
            <button
              onClick={onTryAnotherEmail}
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              ¿Quieres usar otro email?
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
