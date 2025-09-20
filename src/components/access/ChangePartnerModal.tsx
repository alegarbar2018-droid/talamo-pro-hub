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
              Solicitar cambio de partner
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Paso 1: Abre el chat de soporte de Exness y escribe:</h4>
              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                <code className="text-cyan-300 font-mono text-sm">{changeText}</code>
                <Button
                  onClick={handleCopyText}
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 h-auto p-1"
                >
                  {copiedText === "text" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Paso 2: Cuando te pidan el nuevo partner, ingresa:</h4>
              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                <code className="text-cyan-300 font-mono text-sm">{partnerId}</code>
                <Button
                  onClick={handleCopyId}
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 h-auto p-1"
                >
                  {copiedId ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-200/80 text-sm">
                <strong>Ayuda:</strong> Luego de confirmar el cambio, regresa aquí y presiona "Volver a validar".
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleCopyText}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Copiar texto
            </Button>
            <Button
              onClick={handleCopyId}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Copiar Partner ID
            </Button>
            <Button 
              onClick={handleClose}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePartnerModal;