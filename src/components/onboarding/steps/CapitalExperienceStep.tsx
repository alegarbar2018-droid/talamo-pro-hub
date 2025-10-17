import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CapitalBand, ExperienceLevel } from '@/hooks/useOnboardingState';

interface CapitalExperienceStepProps {
  capital: CapitalBand | null;
  experience: ExperienceLevel | null;
  onCapitalSelect: (capital: CapitalBand) => void;
  onExperienceSelect: (experience: ExperienceLevel) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CapitalExperienceStep: React.FC<CapitalExperienceStepProps> = ({
  capital,
  experience,
  onCapitalSelect,
  onExperienceSelect,
  onBack,
  onContinue
}) => {
  const capitalOptions = [
    { id: '<500' as CapitalBand, label: 'Menos de $500', description: 'Ideal para empezar con micro-lotes' },
    { id: '500-2000' as CapitalBand, label: '$500 - $2,000', description: 'Buen balance para operar' },
    { id: '2000-10000' as CapitalBand, label: '$2,000 - $10,000', description: 'Capital intermedio sólido' },
    { id: '>10000' as CapitalBand, label: 'Más de $10,000', description: 'Acceso a cuentas premium' }
  ];

  const experienceOptions = [
    { id: 'ninguna' as ExperienceLevel, label: 'Nunca he operado', description: 'Quiero aprender desde cero' },
    { id: 'basica' as ExperienceLevel, label: 'Experiencia básica', description: 'He probado en demo o hecho pocas operaciones reales' },
    { id: 'intermedia' as ExperienceLevel, label: 'Experiencia intermedia', description: 'Opero regularmente, tengo mi estrategia' },
    { id: 'avanzada' as ExperienceLevel, label: 'Experiencia avanzada', description: 'Trader consistente con historial verificable' }
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Capital Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">¿Con cuánto capital iniciarías?</h2>
          <p className="text-muted-foreground">
            Esto nos ayuda a recomendarte la cuenta ideal
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {capitalOptions.map((option) => {
            const isSelected = capital === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onCapitalSelect(option.id)}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-surface/80"
                )}
              >
                <div className={cn(
                  "text-2xl font-bold mb-2",
                  isSelected ? "text-foreground" : "text-foreground"
                )}>
                  {option.label}
                </div>
                <p className={cn(
                  "text-sm",
                  isSelected ? "text-foreground/80 font-medium" : "text-muted-foreground"
                )}>
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Section - appears after capital selection */}
      <AnimatePresence>
        {capital && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">¿Cuál es tu nivel de experiencia?</h2>
              <p className="text-muted-foreground">
                Último paso para personalizar tu ruta
              </p>
            </div>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              {experienceOptions.map((option) => {
                const isSelected = experience === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onExperienceSelect(option.id)}
                    className={cn(
                      "w-full p-6 rounded-xl border-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-surface/80"
                    )}
                  >
                    <div className={cn(
                      "font-semibold text-lg mb-1",
                      isSelected ? "text-foreground" : "text-foreground"
                    )}>
                      {option.label}
                    </div>
                    <p className={cn(
                      "text-sm",
                      isSelected ? "text-foreground/80 font-medium" : "text-muted-foreground"
                    )}>
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Atrás
        </Button>
        
        <Button
          onClick={onContinue}
          disabled={!capital || !experience}
          size="lg"
        >
          Ver mi plan
        </Button>
      </div>
    </div>
  );
};
