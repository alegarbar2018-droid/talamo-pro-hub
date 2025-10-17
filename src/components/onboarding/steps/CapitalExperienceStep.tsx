import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Target, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { CapitalBand, ExperienceLevel } from "@/hooks/useOnboardingState";

interface CapitalExperienceStepProps {
  capital: CapitalBand | null;
  experience: ExperienceLevel | null;
  onCapitalChange: (capital: CapitalBand) => void;
  onExperienceChange: (experience: ExperienceLevel) => void;
  onContinue: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const CapitalExperienceStep = ({
  capital,
  experience,
  onCapitalChange,
  onExperienceChange,
  onContinue,
  onBack,
  canGoBack
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 sm:space-y-10"
    >
      {/* Header */}
      <div className="text-center space-y-6 sm:space-y-8 relative">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent rounded-full" />
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight tracking-tight"
        >
          Ayúdanos a recomendarte lo mejor
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Esta información nos permite personalizar tu experiencia
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="border-2 border-border/40 bg-gradient-to-br from-surface/90 via-surface/60 to-surface/30 backdrop-blur-2xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)]">
          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Capital Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <DollarSign className="h-6 w-6 text-primary" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  ¿Con cuánto capital empezarás?
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capitalOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (0.08 * index), duration: 0.3 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCapitalChange(option.value)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 backdrop-blur-sm ${
                      capital === option.value
                        ? "border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-[0_8px_30px_rgba(var(--primary),0.3)]"
                        : "border-border/40 bg-background/40 hover:border-primary/50 hover:bg-background/60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        capital === option.value ? "border-primary bg-primary" : "border-border/50"
                      }`}>
                        {capital === option.value && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 rounded-full bg-primary-foreground" 
                          />
                        )}
                      </div>
                      <span className={`font-semibold transition-colors duration-300 ${
                        capital === option.value ? "text-primary" : "text-foreground"
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-5 pt-6 border-t-2 border-border/30">
              <div className="flex items-center gap-4 pb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Target className="h-6 w-6 text-primary" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  ¿Cuánta experiencia tienes?
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {experienceOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (0.08 * index), duration: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onExperienceChange(option.value)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 backdrop-blur-sm ${
                      experience === option.value
                        ? "border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-[0_8px_30px_rgba(var(--primary),0.3)]"
                        : "border-border/40 bg-background/40 hover:border-primary/50 hover:bg-background/60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                        experience === option.value ? "border-primary bg-primary" : "border-border/50"
                      }`}>
                        {experience === option.value && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 rounded-full bg-primary-foreground" 
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold mb-1 transition-colors duration-300 ${
                          experience === option.value ? "text-primary" : "text-foreground"
                        }`}>
                          {option.label}
                        </p>
                        <p className="text-sm text-muted-foreground/80">{option.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <motion.div 
              className="flex gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              {canGoBack && onBack && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={onBack}
                  className="h-16 sm:h-18 px-7 rounded-2xl border-2 border-border/40 hover:border-primary/40 hover:bg-background/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
                </Button>
              )}
              <Button
                size="lg"
                onClick={onContinue}
                disabled={!capital || !experience}
                className="group relative flex-1 h-16 sm:h-18 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary hover:via-primary/90 hover:to-primary/80 text-base sm:text-xl font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] active:scale-[0.98] border-2 border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-3 text-primary-foreground drop-shadow-sm">
                  Continuar
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
