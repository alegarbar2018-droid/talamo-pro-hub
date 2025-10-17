import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { CapitalBand } from "@/hooks/useOnboardingState";

interface CapitalStepProps {
  capital: CapitalBand | null;
  onSelect: (capital: CapitalBand) => void;
}

export const CapitalStep = ({ capital, onSelect }: CapitalStepProps) => {
  const options: { value: CapitalBand; label: string; description: string }[] = [
    {
      value: "<500",
      label: "Menos de $500",
      description: "Ideal para empezar con poco riesgo"
    },
    {
      value: "500-2000",
      label: "$500 - $2,000",
      description: "Capital inicial sólido"
    },
    {
      value: "2000-10000",
      label: "$2,000 - $10,000",
      description: "Cuenta seria para trading activo"
    },
    {
      value: ">10000",
      label: "Más de $10,000",
      description: "Capital significativo"
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
            <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          ¿Con cuánto capital empezarás?
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Esto nos ayuda a recomendarte el tipo de cuenta y estrategias adecuadas
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-glow-primary ${
                capital === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 bg-surface/30 hover:border-primary/30'
              }`}
              onClick={() => onSelect(option.value)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {option.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  {capital === option.value && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {capital && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            size="lg"
            className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Continuar
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};