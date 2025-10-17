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
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-partner-title"
        className="relative bg-gradient-to-br from-surface/95 to-background/95 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 sm:p-10 max-w-3xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl hover:bg-muted/50 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="space-y-8">
          {/* Header Premium */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-lg mb-2">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 id="change-partner-title" className="text-3xl sm:text-4xl font-bold text-foreground">
              Cambiar a Tálamo
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Proceso simple con soporte de Exness — ~2 minutos
            </p>
          </div>

          {/* Pasos simplificados y limpios */}
          <div className="space-y-6">
            {/* Paso 1 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                1
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">
                  Abre el chat de Exness
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ve a tu área de cliente de Exness y abre el chat de soporte (botón flotante abajo a la derecha).
                </p>
                <Button
                  onClick={() => window.open('https://my.exness.com/', '_blank', 'noopener,noreferrer')}
                  size="sm"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ir a Exness
                </Button>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                2
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">
                  Escribe "change partner"
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  El soporte te enviará un enlace al formulario de cambio de partner.
                </p>
                <div className="bg-muted/30 border border-border rounded-xl p-3 flex items-center justify-between">
                  <code className="text-primary font-mono text-sm font-semibold">change partner</code>
                  <Button
                    onClick={() => handleCopy('change partner', 'phrase', 'Frase')}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    {copiedItems.phrase ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                3
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">
                  Completa el formulario
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  En el formulario "Partner change", usa estos datos:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-foreground/70 mb-2">NUEVO PARTNER (elige uno):</p>
                    
                    {/* Partner Link */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-medium">Link de Tálamo</span>
                        <span className="text-primary text-[10px] font-semibold">RECOMENDADO</span>
                      </div>
                      <div className="bg-surface/80 rounded-lg p-2.5 flex items-center justify-between">
                        <span className="text-primary font-mono text-xs">Link del partner</span>
                        <Button
                          onClick={handleCopyPartnerLink}
                          size="sm"
                          variant="ghost"
                          disabled={loadingPartnerLink}
                          className="h-7 w-7 p-0"
                        >
                          {loadingPartnerLink ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : copiedItems.partnerLink ? (
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Partner ID */}
                    <div className="space-y-2">
                      <p className="text-xs text-foreground/70">O Partner ID:</p>
                      <div className="bg-surface/80 rounded-lg p-2.5 flex items-center justify-between">
                        <code className="text-primary font-mono text-xs">{PARTNER_ID}</code>
                        <Button
                          onClick={() => handleCopy(PARTNER_ID, 'partnerId', 'Partner ID')}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                        >
                          {copiedItems.partnerId ? (
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1 pl-3">
                    <p>• <strong>Where did you find partner?</strong> → <code className="text-primary">talamo.ai</code></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con CTA claro */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-border/50 text-muted-foreground hover:bg-muted/30"
            >
              Continuar después
            </Button>
            <Button 
              onClick={handleRetryAndClose}
              className="flex-1 bg-gradient-primary hover:shadow-glow font-semibold"
            >
              ✓ Ya lo hice, validar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePartnerModal;