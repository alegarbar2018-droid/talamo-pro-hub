import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PARTNER_ID } from "@/lib/constants";

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerModal = ({ isOpen, onClose }: PartnerModalProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl max-w-lg w-full p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">Cambiar Partner</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              1. Contacta al soporte de Exness
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. Copia este mensaje:
            </p>
            <div className="bg-surface border rounded p-3 text-sm">
              "Hola, quiero cambiar mi partner actual por el partner ID {PARTNER_ID}. Gracias."
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Hola, quiero cambiar mi partner actual por el partner ID ${PARTNER_ID}. Gracias.`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-2 flex items-center gap-2 text-primary text-sm hover:underline"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar mensaje"}
            </button>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              3. Si te piden el Partner ID:
            </p>
            <div className="bg-surface border rounded p-3 text-sm font-mono">
              {PARTNER_ID}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(PARTNER_ID);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-2 flex items-center gap-2 text-primary text-sm hover:underline"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar Partner ID
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cerrar
          </Button>
          <Button 
            onClick={() => {
              onClose();
              navigate("/onboarding?step=validate");
            }}
            className="flex-1"
          >
            Ya lo hice, validar
          </Button>
        </div>
      </div>
    </div>
  );
};
