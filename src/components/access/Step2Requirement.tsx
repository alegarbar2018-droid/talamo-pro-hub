import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Shield, CheckCircle } from "lucide-react";

// Declare gtag function for analytics (Google Analytics)
declare global {
  function gtag(...args: any[]): void;
}

interface Step2RequirementProps {
  onNext: () => void;
  onValidateNow: () => void;
}

const Step2Requirement = ({ onNext, onValidateNow }: Step2RequirementProps) => {
  const exnessCreateUrl = "https://one.exnessonelink.com/boarding/sign-up/303589/a/nvle22j1te?lng=es";

  const handleCreateAccount = () => {
    // Track analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "access.exness.create_clicked");
    }
    window.open(exnessCreateUrl, "_blank");
  };

  const handleAlreadyCreated = () => {
    // Track analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "access.requirement.already_created");
    }
    onNext();
  };

  const handleValidateExisting = () => {
    // Track analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "access.requirement.validate_existing");
    }
    onValidateNow();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Acceso por afiliación a Exness</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Para entrar necesitas operar con Exness bajo nuestra afiliación. 
          Esto garantiza condiciones reales, seguridad y transparencia. No hay membresía.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* No tengo cuenta */}
        <div className="bg-surface border border-line rounded-xl p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">No tengo cuenta en Exness</h3>
            <p className="text-muted-foreground">
              Crea tu cuenta de trading con condiciones preferenciales y acceso directo a Tálamo.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Spreads desde 0.0 pips</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Ejecución institucional</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Regulado internacionalmente</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCreateAccount}
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow"
              data-event="access.exness.create_account"
            >
              Crear cuenta en Exness
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Al finalizar, vuelve a Tálamo para validar tu acceso.
            </p>

            <Button
              onClick={handleAlreadyCreated}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Ya la creé, continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Ya tengo cuenta */}
        <div className="bg-surface border border-line rounded-xl p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Ya tengo cuenta en Exness</h3>
            <p className="text-muted-foreground">
              Verifica que tu cuenta esté afiliada a Tálamo para acceder al ecosistema completo.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Validación instantánea</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Conexión segura con Exness</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Sin compartir credenciales</span>
            </div>
          </div>

          <Button
            onClick={handleValidateExisting}
            size="lg"
            className="w-full bg-gradient-primary hover:shadow-glow"
            data-event="access.validate.existing_account"
          >
            Validar afiliación
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-medium text-amber-800 dark:text-amber-400">¿Por qué afiliación?</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              La afiliación nos permite ofrecer herramientas gratuitas y señales verificadas. 
              Es nuestro modelo de sustentabilidad transparente, sin costos ocultos para ti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Requirement;