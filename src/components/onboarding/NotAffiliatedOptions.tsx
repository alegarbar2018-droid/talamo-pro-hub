import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { PARTNER_LINK } from "@/lib/constants";

interface NotAffiliatedOptionsProps {
  onCreateAccount: () => void;
  onRequestPartnerChange: () => void;
  onRetryValidation: () => void;
}

export const NotAffiliatedOptions = ({ onCreateAccount, onRequestPartnerChange, onRetryValidation }: NotAffiliatedOptionsProps) => {
  const handleCreateAccount = async () => {
    try {
      window.open(PARTNER_LINK, '_blank', 'noopener,noreferrer');
      onCreateAccount();
    } catch (error) {
      console.error('Error opening partner link:', error);
    }
  };

  return (
    <div id="block-b-not-affiliated" className="space-y-8 animate-fade-in mt-8">
      {/* Header con mensaje claro */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">
          ¿Aún no tienes cuenta en Exness?
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Necesitas una cuenta de trading afiliada con Tálamo para acceder. Elige tu camino:
        </p>
      </div>

      {/* Opciones simplificadas */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Opción 1: Crear cuenta nueva - Principal */}
        <button
          onClick={handleCreateAccount}
          className="group w-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                <ExternalLink className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-foreground">Crear cuenta en Exness</h4>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                    Recomendado
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Abre una cuenta de trading en 3 minutos. Puedes usar un email diferente si ya tienes cuenta.
                </p>
                <p className="text-sm text-primary/80 font-medium">
                  💡 Tip: Si usas Gmail, prueba tunombre+talamo@gmail.com
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </button>

        {/* Opción 2: Cambio de partner - Secundaria */}
        <button
          onClick={onRequestPartnerChange}
          className="group w-full p-6 rounded-2xl bg-surface/50 border-2 border-border hover:border-border/60 transition-all duration-300 hover:shadow-md text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <ArrowRight className="h-6 w-6 text-foreground" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-foreground">Ya tengo cuenta en Exness</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Cambia tu afiliación a Tálamo en 2 minutos con soporte de Exness.
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Footer con retry */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground mb-3">
          ¿Ya completaste alguno de estos pasos?
        </p>
        <Button
          onClick={onRetryValidation}
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 font-medium"
        >
          Validar mi cuenta ahora
        </Button>
      </div>
    </div>
  );
};