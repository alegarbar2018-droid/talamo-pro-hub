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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-partner-title"
        className="relative bg-gradient-to-br from-surface via-surface to-card border border-line/50 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 id="change-partner-title" className="text-3xl font-bold text-foreground">
              Solicitar cambio de partner
            </h2>
            <p className="text-lg text-muted-foreground">
              3 pasos — tarda ~2 minutos
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {/* Paso 1 */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                  <ExternalLink className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Paso 1 — Abre el chat de soporte de Exness
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Inicia sesión en tu área de cliente de Exness. Abre el chat (burbuja abajo a la derecha).
                  </p>
                  <Button
                    onClick={() => window.open('https://my.exness.com/', '_blank', 'noopener,noreferrer')}
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir portal de Exness
                  </Button>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-gradient-to-br from-teal-ink/10 via-teal-ink/5 to-background border border-teal-ink/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-ink to-teal-dark rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Paso 2 — Escribe la frase mágica
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    En el chat, escribe exactamente:
                  </p>
                  <div className="bg-muted/50 border border-line/50 rounded-xl p-4 flex items-center justify-between">
                    <code className="text-primary font-mono text-lg font-semibold">change partner</code>
                    <Button
                      onClick={() => handleCopy('change partner', 'phrase', 'Frase')}
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground hover:bg-white/10"
                    >
                      {copiedItems.phrase ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-200/80 text-sm">
                      <strong>Nota:</strong> El asistente te devolverá un enlace "Partner change". Ábrelo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-gradient-to-br from-success/10 via-success/5 to-background border border-success/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                  <ClipboardCheck className="h-5 w-5 text-success-foreground" />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Paso 3 — Completa el formulario "Partner change"
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    En la página "Partner change", rellena así:
                  </p>
                  
                  <div className="space-y-4">
                    {/* Partner Link Option */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        <strong>New partner's link or wallet account number</strong> → Pega el <strong>link de partner de Tálamo</strong> (recomendado):
                      </p>
                      <div className="bg-muted/50 border border-line/50 rounded-xl p-4 flex items-center justify-between">
                        <span className="text-primary font-mono text-sm">Link del partner (recomendado)</span>
                        <Button
                          onClick={handleCopyPartnerLink}
                          size="sm"
                          variant="ghost"
                          disabled={loadingPartnerLink}
                          className="text-muted-foreground hover:text-foreground hover:bg-white/10"
                        >
                          {loadingPartnerLink ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : copiedItems.partnerLink ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Partner ID Option */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        <strong>O usa el Partner ID</strong> (alternativo):
                      </p>
                      <div className="bg-muted/50 border border-line/50 rounded-xl p-4 flex items-center justify-between">
                        <code className="text-primary font-mono text-sm">{PARTNER_ID}</code>
                        <Button
                          onClick={() => handleCopy(PARTNER_ID, 'partnerId', 'Partner ID')}
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground hover:bg-white/10"
                        >
                          {copiedItems.partnerId ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Additional Fields */}
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Where did you find your new partner? (URL)</strong> → <code className="text-primary">talamo.ai</code>
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Leave a comment (opcional)</strong> → <code className="text-primary">"Requesting switch to Tálamo partner."</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-4 justify-end pt-6 border-t border-line/30">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-line/50 text-muted-foreground hover:bg-muted/50"
            >
              Cerrar
            </Button>
            <Button 
              onClick={handleRetryAndClose}
              className="bg-gradient-primary hover:shadow-glow font-semibold"
            >
              Ya lo hice, volver a validar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePartnerModal;