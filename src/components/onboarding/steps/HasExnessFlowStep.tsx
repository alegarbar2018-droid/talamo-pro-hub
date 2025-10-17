import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Copy, ExternalLink, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { PARTNER_ID, PARTNER_LINK } from "@/lib/constants";

interface HasExnessFlowStepProps {
  onCompleted: () => void;
}

export const HasExnessFlowStep = ({ onCompleted }: HasExnessFlowStepProps) => {
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleOpenExness = () => {
    window.open("https://www.exness.com/accounts/", "_blank");
    console.info('open_exness_client_area');
  };

  const steps = [
    {
      number: 1,
      title: "Ve a tu área de cliente Exness",
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={handleOpenExness}
          className="border-primary/40 text-primary hover:bg-primary/5"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir Exness
        </Button>
      )
    },
    {
      number: 2,
      title: "Abre el chat y escribe",
      description: (
        <div className="flex items-center gap-2 flex-wrap">
          <code className="flex-1 min-w-0 bg-background/50 px-3 py-2 rounded-lg text-sm font-mono border border-border/30">
            change partner
          </code>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCopy("change partner", "Frase")}
            className="hover:bg-primary/10"
          >
            {copiedItem === "Frase" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    },
    {
      number: 3,
      title: "En el formulario, pega el link o ID",
      description: (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Link de afiliación:</p>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="flex-1 min-w-0 bg-background/50 px-3 py-2 rounded-lg text-xs font-mono border border-border/30 break-all">
                {PARTNER_LINK}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(PARTNER_LINK, "Link")}
                className="hover:bg-primary/10 flex-shrink-0"
              >
                {copiedItem === "Link" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">O usa el Partner ID:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background/50 px-3 py-2 rounded-lg text-sm font-mono border border-border/30">
                {PARTNER_ID}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(PARTNER_ID, "Partner ID")}
                className="hover:bg-primary/10"
              >
                {copiedItem === "Partner ID" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-glow-primary">
            <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Cambiar tu afiliación a Tálamo
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          No te preocupes, el proceso es simple y lo harás con el soporte de Exness
        </p>
      </div>

      {/* Steps */}
      <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="flex gap-4 p-4 rounded-xl bg-background/30 border border-border/30"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-primary">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <h3 className="font-semibold text-foreground text-base sm:text-lg">
                    {step.title}
                  </h3>
                  {step.description && (
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  )}
                  {step.action && <div>{step.action}</div>}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/30">
            <Button
              size="lg"
              onClick={onCompleted}
              className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Ya lo hice, validar ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
