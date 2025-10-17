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
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Conecta tu cuenta de trading</h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Tálamo funciona con cuentas de Exness. Validamos tu email para confirmar que estás afiliado con nosotros.
        </p>
      </div>

      <Card className="border-none bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl shadow-2xl">        
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-8">
          <div className="bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/20 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Info className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-primary-foreground" />
              </div>
              <div className="space-y-2.5">
                <h3 className="font-bold text-foreground text-base sm:text-lg">¿Por qué necesitas una cuenta en Exness?</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Exness es el broker que recomendamos por su regulación, ejecución y herramientas profesionales. Tálamo verifica que tu cuenta esté afiliada para ofrecerte acceso completo a nuestra plataforma.
                </p>
                <div className="flex items-center gap-2 text-xs text-primary/90 pt-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Solo verificamos tu email, nunca accedemos a tus fondos</span>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email registrado en Exness
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu-email@ejemplo.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                className="bg-input border-border focus:border-primary h-12 text-base rounded-xl"
              />
              <p className="text-xs text-muted-foreground/80 pl-1">
                Ingresa el email que usaste al crear tu cuenta en Exness
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
                  className="w-full text-sm h-10 sm:h-11"
                >
                  Ver opciones para afiliarte
                </Button>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={!email || loading || cooldownSeconds > 0}
              className="w-full bg-gradient-primary hover:shadow-glow h-11 sm:h-14 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm sm:text-base">Validando con API de Exness...</span>
                </div>
              ) : cooldownSeconds > 0 ? (
                `Espera ${cooldownSeconds}s antes de reintentar`
              ) : (
                "Validar Afiliación"
              )}
            </Button>
          </form>

          {/* Opciones para usuarios no afiliados */}
          {isNotAffiliated && (
            <div className="mt-4 sm:mt-6">
              <div className="text-center mb-3 sm:mb-4">
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
                className="w-full border-green-500 text-green-700 hover:bg-green-50 h-10 sm:h-11"
              >
                Ya la creé, volver a validar
              </Button>
            </div>
          )}

          {/* FAQ simplificado */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="why-affiliation" className="border-line/50 rounded-xl bg-muted/30">
              <AccordionTrigger className="text-left font-medium px-4 sm:px-6 hover:no-underline rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg">¿Por qué validamos la afiliación?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-4 sm:p-6">
                    <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-base sm:text-lg">Nuestro Modelo de Negocio</h4>
                    <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                      Tálamo no cobra membresía. Nuestro modelo se sostiene con rebates de spread cuando operas 
                      con tu cuenta Exness afiliada a Tálamo (sin costo extra para ti). Así alineamos incentivos: 
                      solo ganamos si tú operas con estructura. Validamos únicamente tu email para confirmar 
                      la afiliación, nunca accedemos a tus fondos.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Proceso encriptado y privado</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Esto alinea incentivos: solo ganamos si tú operas con estructura a largo plazo. 
                    Nuestra prioridad es ejecución con datos y control de riesgo, no vender promesas.
                  </p>
                  
                  <div className="grid gap-3 sm:gap-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">Tu cuenta, tus fondos</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Nunca operamos tu cuenta ni accedemos a tus fondos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">Incentivos alineados</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Solo ganamos con rebates si operas con estructura</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">Validación segura</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Solo verificamos email/UID por API encriptada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm sm:text-base">Sin tarifas ni membresías</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Acceso gratuito para cuentas afiliadas</p>
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