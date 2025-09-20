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
    <div className="space-y-6">
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Solicitar Acceso a Tálamo
          </CardTitle>
          <CardDescription className="text-base">
            Plataforma premium de análisis y herramientas de trading para traders de Exness
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">¿Qué necesito para acceder?</h3>
                <p className="text-sm text-muted-foreground">
                  Una cuenta de Exness afiliada con nuestro partner oficial. Si ya tienes cuenta, 
                  validaremos tu afiliación. Si no, te ayudamos a crear una nueva.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleCreateExnessAccount}
              className="w-full bg-gradient-primary hover:shadow-glow h-12"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Abrir cuenta en Exness
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Al terminar, vuelve para validar tu afiliación y continuar
            </p>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onChooseValidateExisting}
              className="w-full border-primary text-primary hover:bg-primary/5 h-12"
            >
              <Shield className="h-5 w-5 mr-2" />
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