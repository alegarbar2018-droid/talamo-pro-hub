import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Copy, ArrowLeft, Info } from "lucide-react";
import { PARTNER_LINK } from "@/lib/constants";

interface NotAffiliatedOptionsProps {
  onCreateAccount: () => void;
  onRequestPartnerChange: () => void;
  onRetryValidation: () => void;
}

export const NotAffiliatedOptions = ({ 
  onCreateAccount, 
  onRequestPartnerChange, 
  onRetryValidation 
}: NotAffiliatedOptionsProps) => {
  const handleCreateExnessAccount = () => {
    window.open(PARTNER_LINK, "_blank");
    onCreateAccount();
    console.info(`open_partner_link`);
  };

  return (
    <div className="space-y-4" id="block-b-not-affiliated">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Tengo cuenta en Exness pero NO estoy afiliado a Tálamo
          </p>
        </div>
      </div>

      {/* Opciones directas */}
      <div className="grid gap-4">
        {/* Opción 1: Crear cuenta nueva */}
        <Card className="border-line bg-surface">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-foreground">Crear cuenta nueva</h4>
                <p className="text-sm text-muted-foreground">
                  Mismos datos personales, email distinto. Sugerencia Gmail: tunombre+talamo@gmail.com
                </p>
                <Button 
                  onClick={handleCreateExnessAccount}
                  size="sm"
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Crear cuenta nueva
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opción 2: Solicitar cambio de partner */}
        <Card className="border-line bg-surface">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <Copy className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-foreground">Solicitar cambio de partner</h4>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={onRequestPartnerChange}
                  className="w-full border-primary text-primary hover:bg-primary/5"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Solicitar cambio de partner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volver a validar */}
        <div className="text-center">
          <Button 
            variant="ghost"
            size="sm"
            onClick={onRetryValidation}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a validar
          </Button>
        </div>
      </div>
    </div>
  );
};