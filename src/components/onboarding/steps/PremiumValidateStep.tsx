import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  User,
  Building,
  ArrowRight,
  Timer
} from "lucide-react";
import { useAffiliationValidation } from "@/hooks/useAffiliationValidation";
import { useToast } from "@/hooks/use-toast";
import PremiumModal from "../PremiumModal";

interface PremiumValidateStepProps {
  email: string;
  setEmail: (email: string) => void;
  onValidated: (clientUid: string) => void;
  onNotAffiliated: () => void;
}

export const PremiumValidateStep = ({
  email,
  setEmail,
  onValidated,
  onNotAffiliated
}: PremiumValidateStepProps) => {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();
  
  const {
    validateAffiliation,
    loading,
    error,
    resetValidation
  } = useAffiliationValidation();

  const handleValidateSuccess = (clientUid?: string) => {
    if (clientUid) {
      onValidated(clientUid);
    }
  };

  const handleValidateNotAffiliated = () => {
    onNotAffiliated();
  };

  const handleValidate = async () => {
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email de Exness",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      return;
    }

    await validateAffiliation(
      email,
      handleValidateSuccess,
      handleValidateNotAffiliated,
      () => {}, // onDemo
      () => {} // onUserExists
    );
  };

  const handleRetryValidation = () => {
    resetValidation();
    setShowPartnerModal(false);
    handleValidate();
  };

  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case "Unauthorized":
        return "No pudimos conectar con Exness. Verifica tu cuenta e inténtalo nuevamente.";
      case "RateLimited":
        return `Demasiados intentos. Espera ${cooldownTime}s antes de intentar nuevamente.`;
      case "BrokerDown":
      case "BadUpstream":
        return "Servicio temporalmente no disponible. Inténtalo en unos minutos.";
      default:
        return "Error inesperado. Por favor inténtalo nuevamente.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="border-2 border-line bg-surface/50 backdrop-blur-sm rounded-2xl shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              Validar afiliación con Exness
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              Ingresa el email de tu cuenta de Exness para verificar que estás afiliado a Tálamo
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Email de tu cuenta Exness
            </label>
            <Input
              type="email"
              placeholder="tu-email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || cooldownTime > 0}
              className="h-12 rounded-xl border-2 focus:border-primary transition-colors"
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-muted-foreground">
              Usa el mismo email que tienes registrado en tu cuenta de Exness
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex gap-3"
          >
            <Button
              onClick={handleValidate}
              disabled={loading || cooldownTime > 0 || !email.trim()}
              className="flex-1 h-12 bg-gradient-primary hover:shadow-glow rounded-xl font-semibold"
              aria-label="Validar afiliación con Exness"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validando...
                </>
              ) : cooldownTime > 0 ? (
                <>
                  <Timer className="h-4 w-4 mr-2" />
                  Espera {cooldownTime}s
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validar afiliación
                </>
              )}
            </Button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-destructive/50 bg-destructive/10 rounded-xl">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {getErrorMessage(error)}
                  </AlertDescription>
                </Alert>
                
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => resetValidation()}
                    className="flex-1 rounded-xl"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onNotAffiliated}
                    className="flex-1 rounded-xl border-primary text-primary hover:bg-primary/10"
                  >
                    Ver opciones para afiliarte
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Not affiliated options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="space-y-4"
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿No tienes cuenta en Exness o no estás afiliado a Tálamo?
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-primary/20 bg-primary/5 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center space-y-3">
              <User className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-semibold text-foreground">
                Crear cuenta nueva
              </h3>
              <p className="text-sm text-muted-foreground">
                Abre tu cuenta en Exness afiliada a Tálamo
              </p>
              <Button
                onClick={onNotAffiliated}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 rounded-xl"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Comenzar registro
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-line bg-surface rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center space-y-3">
              <Building className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-semibold text-foreground">
                Cambiar partner
              </h3>
              <p className="text-sm text-muted-foreground">
                Ya tengo cuenta, cambiar a Tálamo
              </p>
              <Button
                onClick={() => setShowPartnerModal(true)}
                variant="outline"
                className="w-full rounded-xl"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Ver instrucciones
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        onRetryValidation={handleRetryValidation}
      />
    </motion.div>
  );
};

export default PremiumValidateStep;