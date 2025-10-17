import { Button } from "@/components/ui/button";
import { Target, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ExperienceLevel } from "@/hooks/useOnboardingState";

interface ExperienceStepProps {
  experience: ExperienceLevel | null;
  onExperienceChange: (experience: ExperienceLevel) => void;
  onContinue: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const ExperienceStep = ({
  experience,
  onExperienceChange,
  onContinue,
  onBack,
  canGoBack
}: ExperienceStepProps) => {
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
          ¿Cuánta experiencia tienes?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Personalizaremos tu ruta según tu nivel
        </motion.p>
      </div>

      {/* Options */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto"
      >
        {experienceOptions.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: 0.5 + (0.08 * index), 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onExperienceChange(option.value);
              setTimeout(() => onContinue(), 300);
            }}
            className={`group relative p-8 rounded-3xl border-2 text-center transition-all duration-300 backdrop-blur-sm overflow-hidden ${
              experience === option.value
                ? "border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-[0_8px_40px_rgba(var(--primary),0.3)]"
                : "border-border/40 bg-gradient-to-br from-surface/90 to-surface/60 hover:border-primary/50 hover:bg-surface/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative space-y-3">
              <h3 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                experience === option.value ? "text-primary" : "text-foreground group-hover:text-primary"
              }`}>
                {option.label}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground/80">
                {option.description}
              </p>
            </div>
            
            {experience === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 text-primary-foreground" strokeWidth={3} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Back Button */}
      {canGoBack && onBack && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex justify-center"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={2.5} />
            Atrás
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
