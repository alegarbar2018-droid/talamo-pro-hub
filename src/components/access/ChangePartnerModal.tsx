import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, CheckCircle } from "lucide-react";

interface ChangePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryValidation?: () => void;
}

const ChangePartnerModal = ({ isOpen, onClose, onRetryValidation }: ChangePartnerModalProps) => {
  const [copiedText, setCopiedText] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const partnerId = "1141465940423171000";
  const changeText = "change partner";

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(changeText);
      setCopiedText("text");
      setTimeout(() => setCopiedText(""), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(partnerId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (error) {
      console.error("Failed to copy ID:", error);
    }
  };

  const handleClose = () => {
    setCopiedText("");
    setCopiedId(false);
    onClose();
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-partner-title"
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5 text-white/60" />
        </button>

        <div className="space-y-6">
          <div>
            <h3 id="change-partner-title" className="text-xl font-bold text-white">
              Cambio de partner en Exness (3 pasos)
            </h3>
            <p className="text-white/80 text-sm mt-2">
              Sigue estos pasos para cambiar tu Partner ID a Tálamo:
            </p>
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="text-white/90">
                <p className="font-medium">Abre el chat de soporte en tu Área Personal de Exness</p>
                <p className="text-sm text-white/70 mt-1">
                  (icono abajo a la derecha)
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="text-white/90 flex-1">
                <p className="font-medium">Escribe exactamente:</p>
                <div className="mt-2 p-3 bg-white/10 rounded-lg flex items-center justify-between">
                  <code className="text-cyan-300 font-mono text-sm">{changeText}</code>
                  <Button
                    onClick={handleCopyText}
                    size="sm"
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 h-auto p-1"
                    aria-label="Copiar texto"
                  >
                    {copiedText === "text" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="text-white/90 flex-1">
                <p className="font-medium">En el formulario:</p>
                <ul className="mt-1 space-y-1 text-xs text-white/70">
                  <li>• Selecciona la cuenta a cambiar</li>
                  <li>• En "Please specify the new partner" pega este número:</li>
                </ul>
                <div className="mt-2 p-3 bg-white/10 rounded-lg flex items-center justify-between">
                  <code className="text-cyan-300 font-mono text-sm">{partnerId}</code>
                  <Button
                    onClick={handleCopyId}
                    size="sm"
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 h-auto p-1"
                    aria-label="Copiar Partner ID"
                  >
                    {copiedId ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  Motivo sugerido: <em>Quiero afiliar mi cuenta a Tálamo</em>
                </p>
              </div>
            </li>
          </ol>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <p className="text-cyan-300 text-sm font-medium">Nota:</p>
            <p className="text-cyan-200/80 text-sm mt-1">
              Cuando Exness confirme el cambio, vuelve y presiona "Volver a validar".
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-medium">Alternativa:</p>
            <p className="text-blue-200/80 text-sm mt-1">
              Crea una cuenta nueva con nuestro enlace y valida acceso directamente.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleCopyText}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              {copiedText === "text" ? "¡Copiado!" : "Copiar texto"}
              {copiedText === "text" ? (
                <CheckCircle className="h-4 w-4 ml-2 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4 ml-2" />
              )}
            </Button>
            <Button
              onClick={handleCopyId}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              {copiedId ? "¡Copiado!" : "Copiar ID"}
              {copiedId ? (
                <CheckCircle className="h-4 w-4 ml-2 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4 ml-2" />
              )}
            </Button>
            {onRetryValidation && (
              <Button
                onClick={() => {
                  handleClose();
                  onRetryValidation();
                }}
                variant="outline"
                className="border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10"
              >
                Volver a validar
              </Button>
            )}
            <Button 
              onClick={handleClose}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            >
              Listo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePartnerModal;