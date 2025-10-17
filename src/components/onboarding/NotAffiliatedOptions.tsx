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
    <div id="block-b-not-affiliated" className="space-y-10 animate-fade-in mt-12">
      {/* Header premium con gradiente */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-primary shadow-[var(--glow-primary)] mb-3 animate-scale-in">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          ¿Aún no tienes cuenta en Exness?
        </h3>
        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-xl mx-auto">
          Necesitas una cuenta de trading afiliada con Tálamo para acceder. Elige tu camino:
        </p>
      </div>

      {/* Opciones premium con gradientes */}
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* Opción 1: Crear cuenta nueva - Principal con estilo premium */}
        <button
          onClick={handleCreateAccount}
          className="group relative w-full p-8 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 hover:border-primary/60 transition-all duration-500 hover:shadow-[var(--shadow-elevated)] hover:shadow-primary/20 text-left overflow-hidden"
        >
          {/* Glow effect background */}
          <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-[var(--glow-primary)] group-hover:scale-110 transition-transform duration-300">
                <ExternalLink className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-bold text-foreground">Crear cuenta en Exness</h4>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-primary text-primary-foreground shadow-lg">
                    Recomendado
                  </span>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Abre una cuenta de trading en 3 minutos. Puedes usar un email diferente si ya tienes cuenta.
                </p>
                <div className="flex items-start gap-2 text-sm text-primary font-medium bg-primary/5 rounded-xl p-3 border border-primary/20">
                  <span className="text-lg">💡</span>
                  <p>Tip: Si usas Gmail, prueba <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">tunombre+talamo@gmail.com</code></p>
                </div>
              </div>
            </div>
            <ArrowRight className="h-7 w-7 text-primary group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" />
          </div>
        </button>

        {/* Opción 2: Cambio de partner - Secundaria con estilo premium */}
        <button
          onClick={onRequestPartnerChange}
          className="group relative w-full p-7 rounded-3xl bg-gradient-to-br from-surface/80 to-surface/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[var(--shadow-elevated)] text-left overflow-hidden"
        >
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="h-7 w-7 text-foreground" />
              </div>
              <div className="space-y-2.5">
                <h4 className="text-2xl font-bold text-foreground">Ya tengo cuenta en Exness</h4>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Cambia tu afiliación a Tálamo en 2 minutos con soporte de Exness.
                </p>
              </div>
            </div>
            <ArrowRight className="h-7 w-7 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Footer premium con CTA destacado */}
      <div className="text-center pt-6 space-y-4">
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="text-base text-muted-foreground font-medium">
          ¿Ya completaste alguno de estos pasos?
        </p>
        <Button
          onClick={onRetryValidation}
          variant="outline"
          className="border-2 border-primary/40 text-primary hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/10 hover:border-primary/60 font-semibold px-8 py-6 text-base rounded-2xl shadow-lg hover:shadow-[var(--glow-primary)] transition-all duration-300"
        >
          Validar mi cuenta ahora
        </Button>
      </div>
    </div>
  );
};