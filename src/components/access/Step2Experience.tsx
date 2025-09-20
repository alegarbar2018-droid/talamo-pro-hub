import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Target } from "lucide-react";

interface Step2ExperienceProps {
  data: {
    experience?: string;
  };
  onUpdate: (data: { experience: string }) => void;
  onNext: () => void;
}

const Step2Experience = ({ data, onUpdate, onNext }: Step2ExperienceProps) => {
  const [selectedExperience, setSelectedExperience] = useState(data.experience || "");

  const experienceOptions = [
    {
      id: "beginner",
      title: "Principiante",
      description: "Menos de 1 año de experiencia",
      icon: Target,
      details: "Estoy comenzando en el mundo del trading"
    },
    {
      id: "intermediate", 
      title: "Intermedio",
      description: "1-3 años de experiencia",
      icon: BarChart3,
      details: "Tengo conocimientos básicos y algo de experiencia"
    },
    {
      id: "advanced",
      title: "Avanzado", 
      description: "3+ años de experiencia",
      icon: TrendingUp,
      details: "Soy un trader experimentado con historial comprobado"
    }
  ];

  const handleNext = () => {
    if (!selectedExperience) return;
    
    onUpdate({ experience: selectedExperience });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">¿Cuál es tu experiencia en trading?</h2>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Esto nos ayuda a personalizar tu experiencia en Tálamo según tu nivel.
        </p>
      </div>

      <div className="space-y-4">
        {experienceOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => setSelectedExperience(option.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedExperience === option.id
                  ? "border-primary bg-primary/5 shadow-glow-subtle"
                  : "border-line bg-surface hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  selectedExperience === option.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">{option.title}</h3>
                  <p className="text-muted-foreground font-medium">{option.description}</p>
                  <p className="text-sm text-muted-foreground">{option.details}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedExperience}
        size="lg"
        className="w-full bg-gradient-primary hover:shadow-glow h-12"
      >
        Continuar
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
};

export default Step2Experience;