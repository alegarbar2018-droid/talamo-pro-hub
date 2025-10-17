import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Target } from "lucide-react";
import { motion } from "framer-motion";
import { CapitalBand, ExperienceLevel } from "@/hooks/useOnboardingState";

interface CapitalExperienceStepProps {
  capital: CapitalBand | null;
  experience: ExperienceLevel | null;
  onCapitalChange: (capital: CapitalBand) => void;
  onExperienceChange: (experience: ExperienceLevel) => void;
  onContinue: () => void;
}

export const CapitalExperienceStep = ({
  capital,
  experience,
  onCapitalChange,
  onExperienceChange,
  onContinue
}: CapitalExperienceStepProps) => {
  const capitalOptions: { value: CapitalBand; label: string }[] = [
    { value: "<500", label: "Menos de $500" },
    { value: "500-2000", label: "$500 - $2,000" },
    { value: "2000-10000", label: "$2,000 - $10,000" },
    { value: ">10000", label: "Más de $10,000" }
  ];

  const experienceOptions: { value: ExperienceLevel; label: string; description: string }[] = [
    { value: "ninguna", label: "Ninguna", description: "Empezando desde cero" },
    { value: "basica", label: "Básica", description: "Menos de 6 meses" },
    { value: "intermedia", label: "Intermedia", description: "6 meses - 2 años" },
    { value: "avanzada", label: "Avanzada", description: "Más de 2 años" }
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
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Ayúdanos a recomendarte lo mejor
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Esta información nos permite personalizar tu experiencia
        </p>
      </div>

      <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Capital Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                ¿Con cuánto capital empezarás?
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capitalOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.2 }}
                  onClick={() => onCapitalChange(option.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    capital === option.value
                      ? "border-primary bg-primary/10 shadow-glow-primary"
                      : "border-border/30 bg-background/30 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      capital === option.value ? "border-primary" : "border-border"
                    }`}>
                      {capital === option.value && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                ¿Cuánta experiencia tienes?
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {experienceOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.2 }}
                  onClick={() => onExperienceChange(option.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    experience === option.value
                      ? "border-primary bg-primary/10 shadow-glow-primary"
                      : "border-border/30 bg-background/30 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      experience === option.value ? "border-primary" : "border-border"
                    }`}>
                      {experience === option.value && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground mb-0.5">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <Button
            size="lg"
            onClick={onContinue}
            disabled={!capital || !experience}
            className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
