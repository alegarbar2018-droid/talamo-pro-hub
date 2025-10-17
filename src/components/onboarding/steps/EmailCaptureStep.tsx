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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 sm:space-y-10"
    >
      {/* Header */}
      <div className="text-center space-y-6 sm:space-y-8 relative">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent rounded-full" />
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-primary/40 rounded-3xl blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent rounded-3xl flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(var(--primary),0.4)] backdrop-blur-sm border border-primary/20">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight tracking-tight"
        >
          ¿Con qué email quieres registrarte?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Validaremos tu afiliación con nuestro partner Exness para darte acceso gratuito a toda la plataforma
        </motion.p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="border-2 border-border/40 bg-gradient-to-br from-surface/90 via-surface/60 to-surface/30 backdrop-blur-2xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_80px_-10px_rgba(var(--primary),0.15)] transition-all duration-500">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="tu-email@ejemplo.com"
                  value={localEmail}
                  onChange={(e) => setLocalEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-16 sm:h-18 px-5 sm:px-6 text-base sm:text-lg bg-background/60 border-2 border-border/50 focus:border-primary/60 rounded-2xl transition-all duration-300 backdrop-blur-sm placeholder:text-muted-foreground/50 hover:border-border focus:shadow-[0_8px_30px_rgba(var(--primary),0.15)]"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-4">
                {canGoBack && onBack && (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={onBack}
                    disabled={loading}
                    className="h-16 sm:h-18 px-7 rounded-2xl border-2 border-border/40 hover:border-primary/40 hover:bg-background/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!localEmail.trim() || loading}
                  className="group relative flex-1 h-16 sm:h-18 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary hover:via-primary/90 hover:to-primary/80 text-base sm:text-xl font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] active:scale-[0.98] border-2 border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {loading ? (
                    <span className="relative flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
                      Validando...
                    </span>
                  ) : (
                    <span className="relative flex items-center gap-3 text-primary-foreground drop-shadow-sm">
                      Continuar
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Footer */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-xs sm:text-sm text-center text-muted-foreground/70 max-w-xl mx-auto leading-relaxed backdrop-blur-sm"
      >
        Usaremos este email para tu cuenta de Tálamo y verificar tu afiliación con Exness
      </motion.p>
    </motion.div>
  );
};
