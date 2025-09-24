import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Info, Lightbulb, ExternalLink, Shield } from "lucide-react";
import { PARTNER_ID, PARTNER_LINK } from "@/lib/constants";

interface ChooseStepProps {
  onChooseCreateAccount: () => void;
  onChooseValidateExisting: () => void;
}

export const ChooseStep = ({ onChooseCreateAccount, onChooseValidateExisting }: ChooseStepProps) => {
  const handleCreateExnessAccount = () => {
    window.open(PARTNER_LINK, "_blank");
    console.info(`open_partner_link`);
    onChooseCreateAccount();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
            <Target className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground">Solicitar Acceso</h2>
        <p className="text-base sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Herramientas profesionales de trading para usuarios de Exness
        </p>
      </div>

      <Card className="border-none bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl shadow-2xl">        
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-8">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h3 className="font-bold text-foreground text-base sm:text-lg">Requisito: Cuenta Exness Afiliada</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Si ya tienes cuenta, validaremos tu afiliación. Si no, crea una nueva con nuestro enlace oficial.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <Button
              size="lg"
              onClick={handleCreateExnessAccount}
              className="w-full bg-gradient-primary hover:shadow-glow h-12 sm:h-16 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl px-4"
            >
              <ExternalLink className="h-4 w-4 sm:h-6 sm:w-6 mr-2 sm:mr-3 flex-shrink-0" />
              <span className="text-center leading-tight">Crear cuenta nueva en Exness</span>
            </Button>
            <p className="text-xs sm:text-sm text-center text-muted-foreground font-medium px-2">
              Al terminar, regresa para validar y continuar con el acceso
            </p>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onChooseValidateExisting}
              className="w-full border-primary/40 text-primary hover:bg-primary/5 h-12 sm:h-16 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl px-4"
            >
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 mr-2 sm:mr-3 flex-shrink-0" />
              <span className="text-center leading-tight">Ya tengo cuenta en Exness</span>
            </Button>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Partner ID oficial: <code className="bg-muted px-1 py-0.5 rounded text-xs">{PARTNER_ID}</code>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Acceso por afiliación</p>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                Tálamo es completamente accesible para cuentas afiliadas. Sin tarifas ni membresías.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};