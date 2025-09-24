import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Shield, 
  Info, 
  AlertTriangle,
  TrendingUp,
  Lock,
  Eye,
  Users,
  Globe
} from "lucide-react";
import { PARTNER_ID } from "@/lib/constants";
import { useAffiliationValidation } from "@/hooks/useAffiliationValidation";
import { NotAffiliatedOptions } from "../NotAffiliatedOptions";
import ChangePartnerModal from "@/components/access/ChangePartnerModal";

interface ValidateStepProps {
  email: string;
  isNotAffiliated: boolean;
  showPartnerModal: boolean;
  onEmailChange: (email: string) => void;
  onValidationSuccess: (uid?: string) => void;
  onNotAffiliated: () => void;
  onDemoMode: () => void;
  onRetryValidation: () => void;
  onShowPartnerModal: (show: boolean) => void;
  onUserExists?: () => void;
}

export const ValidateStep = ({
  email,
  isNotAffiliated,
  showPartnerModal,
  onEmailChange,
  onValidationSuccess,
  onNotAffiliated,
  onDemoMode,
  onRetryValidation,
  onShowPartnerModal,
  onUserExists
}: ValidateStepProps) => {
  const { loading, error, cooldownSeconds, validateAffiliation } = useAffiliationValidation();
  const [showNewAccountCreated, setShowNewAccountCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info(`🚀 Form submitted with email:`, email);
    
    await validateAffiliation(
      email,
      onValidationSuccess,
      () => {
        console.info(`🔄 Setting not affiliated state and scrolling to options`);
        onNotAffiliated();
        // Scroll to options after state update
        setTimeout(() => {
          const blockB = document.getElementById('block-b-not-affiliated');
          if (blockB) {
            console.info(`📍 Scrolling to not affiliated options`);
            blockB.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            console.warn(`⚠️ Element 'block-b-not-affiliated' not found`);
          }
        }, 300);
      },
      onDemoMode,
      onUserExists
    );
  };

  const handleCreateAccount = () => {
    setShowNewAccountCreated(true);
  };

  const handleRetryWithConfirmation = () => {
    setShowNewAccountCreated(false);
    onRetryValidation();
    // Focus on email input
    setTimeout(() => {
      const emailInput = document.getElementById('email');
      if (emailInput) {
        emailInput.focus();
      }
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Validación de cuenta</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Verifica tu afiliación con Tálamo para acceso completo
        </p>
      </div>

      <Card className="border-none bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl shadow-2xl">        
        <CardContent className="space-y-8 p-8">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Info className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-foreground text-xl">Acceso Premium por Afiliación</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tálamo es gratuito para cuentas afiliadas. Validamos únicamente tu email para confirmar 
                  la afiliación con nuestro partner oficial.
                </p>
                <div className="bg-primary/10 text-primary px-4 py-3 rounded-xl font-mono text-sm font-medium">
                  Partner ID: {PARTNER_ID}
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email de tu cuenta Exness
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                className="bg-input border-line h-11"
              />
              <p className="text-xs text-muted-foreground">
                Debe ser el mismo email que usas para acceder a tu cuenta de Exness
              </p>
            </div>
            
            {error && !isNotAffiliated && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                {/* Always show options when there's an error */}
                <Button
                  onClick={() => onNotAffiliated()}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Ver opciones para afiliarte
                </Button>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={!email || loading || cooldownSeconds > 0}
              className="w-full bg-gradient-primary hover:shadow-glow h-14 text-lg font-semibold rounded-xl"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Validando con API de Exness...
                </div>
              ) : cooldownSeconds > 0 ? (
                `Espera ${cooldownSeconds}s antes de reintentar`
              ) : (
                "Validar Afiliación Premium"
              )}
            </Button>
          </form>

          {/* Opciones para usuarios no afiliados */}
          {isNotAffiliated && (
            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  ✨ Opciones disponibles para ti:
                </p>
              </div>
              <NotAffiliatedOptions
                onCreateAccount={handleCreateAccount}
                onRequestPartnerChange={() => onShowPartnerModal(true)}
                onRetryValidation={handleRetryWithConfirmation}
              />
            </div>
          )}

          {/* Mostrar mensaje de nueva cuenta creada */}
          {showNewAccountCreated && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-950 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ¡Perfecto! Cuando termines de crear tu cuenta, vuelve aquí para validar.
                </p>
              </div>
              <Button
                onClick={handleRetryWithConfirmation}
                variant="outline"
                className="w-full border-green-500 text-green-700 hover:bg-green-50"
              >
                Ya la creé, volver a validar
              </Button>
            </div>
          )}

          {/* FAQ simplificado */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="why-affiliation" className="border-line/50 rounded-xl bg-muted/30">
              <AccordionTrigger className="text-left font-medium px-6 hover:no-underline rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-lg">¿Por qué validamos la afiliación?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Tu cuenta, tus fondos</p>
                      <p className="text-sm text-muted-foreground">Nunca operamos tu cuenta ni accedemos a tus fondos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Incentivos alineados</p>
                      <p className="text-sm text-muted-foreground">Solo ganamos con rebates si operas con estructura</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Acceso gratuito</p>
                      <p className="text-sm text-muted-foreground">Sin membresías ni tarifas para cuentas afiliadas</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Change Partner Modal */}
      <ChangePartnerModal 
        isOpen={showPartnerModal} 
        onClose={() => onShowPartnerModal(false)}
        onRetryValidation={handleRetryWithConfirmation}
      />
    </div>
  );
};