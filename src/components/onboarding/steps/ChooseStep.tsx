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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-2xl">
            <Target className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-foreground">Solicitar Acceso</h2>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Herramientas profesionales de trading para usuarios de Exness
        </p>
      </div>

      <Card className="border-none bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl shadow-2xl">        
        <CardContent className="space-y-8 p-8">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-lg">Requisito: Cuenta Exness Afiliada</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Si ya tienes cuenta, validaremos tu afiliación. Si no, crea una nueva con nuestro enlace oficial.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={handleCreateExnessAccount}
              className="w-full bg-gradient-primary hover:shadow-glow h-16 text-lg font-semibold rounded-2xl"
            >
              <ExternalLink className="h-6 w-6 mr-3" />
              Crear cuenta nueva en Exness
            </Button>
            <p className="text-sm text-center text-muted-foreground font-medium">
              Al terminar, regresa para validar y continuar con el acceso
            </p>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onChooseValidateExisting}
              className="w-full border-primary/40 text-primary hover:bg-primary/5 h-16 text-lg font-semibold rounded-2xl"
            >
              <Shield className="h-6 w-6 mr-3" />
              Ya tengo cuenta en Exness
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Partner ID oficial: <code className="bg-muted px-1 rounded">{PARTNER_ID}</code>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Acceso por afiliación</p>
              <p className="text-muted-foreground mt-1">
                Tálamo es completamente accesible para cuentas afiliadas. Sin tarifas ni membresías.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};