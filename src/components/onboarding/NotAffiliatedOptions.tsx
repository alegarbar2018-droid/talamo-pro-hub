import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MessageSquare, Copy } from "lucide-react";
import { PARTNER_LINK } from "@/lib/constants";

interface NotAffiliatedOptionsProps {
  onCreateAccount: () => void;
  onRequestPartnerChange: () => void;
  onRetryValidation: () => void;
}

export const NotAffiliatedOptions = ({ onCreateAccount, onRequestPartnerChange, onRetryValidation }: NotAffiliatedOptionsProps) => {
  const handleCreateAccount = async () => {
    try {
      // Open partner link in new tab
      window.open(PARTNER_LINK, '_blank', 'noopener,noreferrer');
      onCreateAccount();
    } catch (error) {
      console.error('Error opening partner link:', error);
    }
  };

  return (
    <div id="block-b-not-affiliated" className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-warning/10 via-warning/5 to-background border border-warning/30 rounded-2xl p-6 shadow-glow-subtle">
        <h3 className="font-bold text-foreground mb-3 text-lg">
          Tu email no está afiliado con Tálamo
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          No te preocupes, tienes dos opciones para acceder a la academia. Elige la que mejor se adapte a tu situación:
        </p>
      </div>

      <div className="grid gap-6">
        {/* Opción 1: Crear cuenta nueva */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-surface hover:border-primary/50 transition-all duration-300 hover:shadow-glow-subtle rounded-2xl">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="text-xl flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <ExternalLink className="h-5 w-5 text-primary-foreground" />
              </div>
              Crear cuenta nueva
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed pl-13">
              Mismos datos personales, email distinto. Sugerencia Gmail: <span className="font-mono text-primary">tunombre+talamo@gmail.com</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 p-6">
            <Button 
              onClick={handleCreateAccount}
              className="w-full bg-gradient-primary hover:shadow-glow h-12 font-semibold text-base"
            >
              Crear cuenta nueva
            </Button>
          </CardContent>
        </Card>

        {/* Opción 2: Solicitar cambio de partner */}
        <Card className="border-2 border-teal-ink/30 bg-gradient-to-br from-teal-ink/10 via-teal-ink/5 to-surface hover:border-teal-ink/50 transition-all duration-300 hover:shadow-glow-subtle rounded-2xl">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="text-xl flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-ink to-teal-dark rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              Solicitar cambio de partner
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed pl-13">
              Si ya tienes cuenta en Exness, puedes cambiarte a Tálamo en 2 minutos.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 p-6">
            <Button 
              onClick={onRequestPartnerChange}
              variant="outline"
              className="w-full border-teal-ink/40 text-teal-ink hover:bg-teal-ink/10 hover:border-teal-ink/60 h-12 font-semibold text-base"
            >
              Solicitar cambio de partner
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Retry button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onRetryValidation}
          variant="ghost"
          className="text-primary hover:text-primary/80 hover:bg-primary/10 font-medium text-base px-6 py-3"
        >
          Volver a validar
        </Button>
      </div>
    </div>
  );
};