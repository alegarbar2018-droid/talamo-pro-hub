import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, CheckCircle, ExternalLink, MessageCircle, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PARTNER_ID } from "@/lib/constants";

interface ChangePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryValidation?: () => void;
}

const ChangePartnerModal = ({ isOpen, onClose, onRetryValidation }: ChangePartnerModalProps) => {
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});
  const [loadingPartnerLink, setLoadingPartnerLink] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [key]: true }));
      toast({
        title: "Copiado",
        description: `${label} copiado al portapapeles`,
      });
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const handleCopyPartnerLink = async () => {
    setLoadingPartnerLink(true);
    try {
      const { data, error } = await supabase.functions.invoke('partner-link');
      
      if (error) {
        console.error('Error fetching partner link:', error);
        toast({
          title: "Error",
          description: "No se pudo obtener el link del partner",
          variant: "destructive",
        });
        return;
      }

      if (data?.link) {
        await handleCopy(data.link, 'partnerLink', 'Link de partner');
      } else {
        throw new Error('No partner link received');
      }
    } catch (error) {
      console.error('Error copying partner link:', error);
      toast({
        title: "Error",
        description: "No se pudo copiar el link del partner",
        variant: "destructive",
      });
    } finally {
      setLoadingPartnerLink(false);
    }
  };

  const handleClose = () => {
    setCopiedItems({});
    onClose();
  };

  const handleRetryAndClose = () => {
    handleClose();
    onRetryValidation?.();
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Premium backdrop con efecto de blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        onClick={handleClose}
      />
      
      {/* Modal premium con gradientes y efectos de glow */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-partner-title"
        className="relative bg-gradient-to-br from-surface via-surface/98 to-background border-2 border-primary/30 rounded-[2rem] p-8 sm:p-12 max-w-3xl w-full mx-4 shadow-[var(--shadow-elevated)] shadow-primary/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-border/50"
          aria-label="Cerrar modal"
        >
          <X className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
        </button>

        <div className="space-y-10">
          {/* Header Premium con gradiente y glow */}
          <div className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-[var(--glow-primary)] mb-3 animate-scale-in">
              <MessageCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 id="change-partner-title" className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Cambiar a Tálamo
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Proceso simple con soporte de Exness — <span className="text-primary font-semibold">~2 minutos</span>
            </p>
            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* Pasos premium con diseño elegante */}
          <div className="space-y-8">
            {/* Paso 1 */}
            <div className="relative pl-16 group">
              <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-gradient-primary shadow-[var(--glow-subtle)] flex items-center justify-center font-bold text-xl text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-surface/50 to-background/50 border border-border/50">
                <h3 className="text-xl font-bold text-foreground">
                  Abre el chat de Exness
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ve a tu área de cliente de Exness y abre el chat de soporte (botón flotante abajo a la derecha).
                </p>
                <Button
                  onClick={() => window.open('https://my.exness.com/', '_blank', 'noopener,noreferrer')}
                  size="sm"
                  className="bg-gradient-to-r from-primary/15 to-primary/10 text-primary hover:from-primary/25 hover:to-primary/15 border-2 border-primary/30 hover:border-primary/50 shadow-lg hover:shadow-[var(--glow-subtle)] transition-all duration-300 font-semibold"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ir a Exness
                </Button>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="relative pl-16 group">
              <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-gradient-primary shadow-[var(--glow-subtle)] flex items-center justify-center font-bold text-xl text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-surface/50 to-background/50 border border-border/50">
                <h3 className="text-xl font-bold text-foreground">
                  Escribe "change partner"
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  El soporte te enviará un enlace al formulario de cambio de partner.
                </p>
                <div className="bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                  <code className="text-primary font-mono text-base font-bold">change partner</code>
                  <Button
                    onClick={() => handleCopy('change partner', 'phrase', 'Frase')}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 p-0 hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    {copiedItems.phrase ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Copy className="h-5 w-5 text-primary" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="relative pl-16 group">
              <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-gradient-primary shadow-[var(--glow-subtle)] flex items-center justify-center font-bold text-xl text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-surface/50 to-background/50 border border-border/50">
                <h3 className="text-xl font-bold text-foreground">
                  Completa el formulario
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  En el formulario "Partner change", usa estos datos:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-5 shadow-lg">
                    <p className="text-sm font-bold text-foreground/80 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      NUEVO PARTNER (elige uno):
                    </p>
                    
                    {/* Partner Link */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground font-semibold">Link de Tálamo</span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground shadow-lg">RECOMENDADO</span>
                      </div>
                      <div className="bg-gradient-to-br from-surface via-surface/90 to-surface/80 rounded-xl p-3 flex items-center justify-between border border-primary/20 shadow-inner">
                        <span className="text-primary font-mono text-sm font-semibold">Link del partner</span>
                        <Button
                          onClick={handleCopyPartnerLink}
                          size="sm"
                          variant="ghost"
                          disabled={loadingPartnerLink}
                          className="h-9 w-9 p-0 hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          {loadingPartnerLink ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : copiedItems.partnerLink ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <Copy className="h-5 w-5 text-primary" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                      <span className="text-xs text-muted-foreground font-medium">O</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    {/* Partner ID */}
                    <div className="space-y-3">
                      <p className="text-sm text-foreground/70 font-semibold">Partner ID:</p>
                      <div className="bg-gradient-to-br from-surface via-surface/90 to-surface/80 rounded-xl p-3 flex items-center justify-between border border-primary/20 shadow-inner">
                        <code className="text-primary font-mono text-sm font-bold">{PARTNER_ID}</code>
                        <Button
                          onClick={() => handleCopy(PARTNER_ID, 'partnerId', 'Partner ID')}
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 p-0 hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          {copiedItems.partnerId ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <Copy className="h-5 w-5 text-primary" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2 pl-4 border-l-2 border-primary/20">
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong className="text-foreground">Where did you find partner?</strong> → <code className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-semibold">talamo.ai</code></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer premium con CTAs destacados */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-border/30">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-2 border-border/50 text-muted-foreground hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20 hover:border-border rounded-2xl py-6 text-base font-semibold transition-all duration-300"
            >
              Continuar después
            </Button>
            <Button 
              onClick={handleRetryAndClose}
              className="flex-1 bg-gradient-primary hover:shadow-[var(--glow-primary)] rounded-2xl py-6 text-base font-bold transition-all duration-300 hover:scale-[1.02]"
            >
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Ya lo hice, validar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePartnerModal;