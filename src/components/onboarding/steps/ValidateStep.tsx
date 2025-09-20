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
    <div className="space-y-6">
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Ya tengo cuenta en Exness
          </CardTitle>
          <CardDescription>
            Verificaremos que tu cuenta esté afiliada con nuestro partner oficial
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 shadow-glow-subtle backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <Info className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-foreground text-lg">Acceso por afiliación premium</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tálamo no cobra membresía; nuestro modelo se sostiene con rebates de spread cuando operas 
                  con tu cuenta Exness afiliada a Tálamo (sin costo extra para ti). Así alineamos incentivos: 
                  solo ganamos si tú operas con estructura. Validamos solo la afiliación (email/UID), 
                  nunca accedemos a tus fondos.
                </p>
                <div className="bg-primary/10 text-primary px-3 py-2 rounded font-mono text-sm">
                  Partner ID: {PARTNER_ID}
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Proceso encriptado y privado</span>
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
              className="w-full bg-gradient-primary hover:shadow-glow h-11"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Validando con API de Exness...
                </div>
              ) : cooldownSeconds > 0 ? (
                `Espera ${cooldownSeconds}s antes de reintentar`
              ) : (
                "Validar afiliación"
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

          {/* Explainer Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="why-affiliation" className="border-line">
              <AccordionTrigger className="text-left font-medium">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Acceso por afiliación: por qué lo pedimos
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Acceso por afiliación: incentivos alineados
                  </h4>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Tálamo no cobra membresía. Nuestro modelo se sostiene con rebates de spread 
                      cuando operas con tu cuenta Exness afiliada a Tálamo. No hay costos extra para ti.
                    </p>
                    <p>
                      Esto alinea incentivos: solo ganamos si tú operas con estructura a largo plazo. 
                      Nuestra prioridad es ejecución con datos y control de riesgo, no vender promesas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Tu cuenta, tus fondos</p>
                        <p className="text-xs text-muted-foreground">Tálamo nunca opera tu cuenta</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Eye className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Validamos únicamente tu afiliación</p>
                        <p className="text-xs text-muted-foreground">Email/UID por API, proceso seguro</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Cuenta no afiliada</p>
                        <p className="text-xs text-muted-foreground">Puedes crear nueva o solicitar cambio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Transparencia total</p>
                        <p className="text-xs text-muted-foreground">Métricas y advertencias de riesgo</p>
                      </div>
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