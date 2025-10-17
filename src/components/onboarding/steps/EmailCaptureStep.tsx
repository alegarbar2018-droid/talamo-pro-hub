import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface EmailCaptureStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onContinue: (email: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const EmailCaptureStep = ({ 
  email, 
  onEmailChange, 
  onContinue, 
  loading = false,
  error,
  onBack,
  canGoBack
}: EmailCaptureStepProps) => {
  const [localEmail, setLocalEmail] = useState(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (localEmail.trim()) {
      onEmailChange(localEmail.trim());
      await onContinue(localEmail.trim());
    }
  };

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
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          ¿Con qué email quieres registrarte?
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Validaremos tu afiliación con nuestro partner Exness para darte acceso gratuito a toda la plataforma
        </p>
      </div>

      {/* Form */}
      <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="tu-email@ejemplo.com"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                required
                disabled={loading}
                className="h-14 sm:h-16 px-4 sm:px-5 text-base sm:text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl sm:rounded-2xl transition-all duration-300"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-3">
              {canGoBack && onBack && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={onBack}
                  disabled={loading}
                  className="h-14 sm:h-16 px-6 rounded-xl sm:rounded-2xl transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Button
                type="submit"
                disabled={!localEmail.trim() || loading}
                className="flex-1 h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Footer */}
      <p className="text-xs sm:text-sm text-center text-muted-foreground max-w-xl mx-auto leading-relaxed">
        Usaremos este email para tu cuenta de Tálamo y verificar tu afiliación con Exness
      </p>
    </motion.div>
  );
};
