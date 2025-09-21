import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Copy, 
  Check, 
  ArrowRight, 
  Users, 
  MessageSquare,
  ExternalLink 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryValidation?: () => void;
}

export const PremiumModal = ({ isOpen, onClose, onRetryValidation }: PremiumModalProps) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopy = async (text: string, stepNumber: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepNumber);
      toast({
        title: "✅ Copiado",
        description: "Texto copiado al portapapeles",
      });
      
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo copiar el texto",
        variant: "destructive",
      });
    }
  };

  const steps = [
    {
      number: 1,
      title: "Accede a tu cuenta Exness",
      description: "Inicia sesión en tu plataforma web de Exness",
      action: (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open("https://my.exness.com", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ir a Exness
        </Button>
      )
    },
    {
      number: 2,
      title: "Solicita cambio de partner",
      description: "Copia este mensaje y envíalo al soporte de Exness",
      copyText: "Hola, quiero cambiar mi partner actual por el partner ID 1141465940423171000. Gracias.",
      action: (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleCopy("Hola, quiero cambiar mi partner actual por el partner ID 1141465940423171000. Gracias.", 2)}
        >
          {copiedStep === 2 ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          Copiar mensaje
        </Button>
      )
    },
    {
      number: 3,
      title: "Proporciona el Partner ID",
      description: "Si te solicitan el ID del partner, proporciona este número",
      copyText: "1141465940423171000",
      action: (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleCopy("1141465940423171000", 3)}
        >
          {copiedStep === 3 ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          Copiar Partner ID
        </Button>
      )
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="text-center space-y-4 pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              Cambiar Partner en Exness
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed mt-2">
              Sigue estos pasos para cambiar tu partner actual por Tálamo. 
              El proceso es rápido y el soporte de Exness te asistirá.
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-surface/50 border border-line rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-semibold text-foreground text-lg">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  {step.copyText && (
                    <div className="bg-background border border-line rounded-xl p-4">
                      <p className="text-sm font-mono text-foreground break-all">
                        "{step.copyText}"
                      </p>
                    </div>
                  )}
                  
                  {step.action}
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4"
          >
            <MessageSquare className="h-8 w-8 text-primary mx-auto" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                ¿Ya completaste el cambio?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Una vez confirmado el cambio por Exness, valida tu afiliación aquí
              </p>
              <div className="flex gap-3">
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
                    onRetryValidation?.();
                  }}
                  className="flex-1 bg-gradient-primary hover:shadow-glow"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Volver a validar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;