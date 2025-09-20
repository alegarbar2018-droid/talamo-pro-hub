import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Calendar } from "lucide-react";

interface Step3PreferencesProps {
  data: {
    tradingStyle?: string;
  };
  onUpdate: (data: { tradingStyle: string }) => void;
  onNext: () => void;
}

const Step3Preferences = ({ data, onUpdate, onNext }: Step3PreferencesProps) => {
  const [selectedStyle, setSelectedStyle] = useState(data.tradingStyle || "");

  const tradingStyles = [
    {
      id: "scalping",
      title: "Scalping",
      description: "Operaciones rápidas (minutos)",
      icon: Zap,
      details: "Busco ganancias pequeñas pero frecuentes en marcos temporales muy cortos"
    },
    {
      id: "day_trading",
      title: "Day Trading",
      description: "Operaciones intradiarias (horas)",
      icon: Clock,
      details: "Prefiero abrir y cerrar posiciones dentro del mismo día"
    },
    {
      id: "swing_trading",
      title: "Swing Trading",
      description: "Operaciones a medio plazo (días/semanas)",
      icon: Calendar,
      details: "Me gusta mantener posiciones por varios días o semanas"
    }
  ];

  const handleNext = () => {
    if (!selectedStyle) return;
    
    onUpdate({ tradingStyle: selectedStyle });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">¿Cuál es tu estilo de trading preferido?</h2>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Esto nos permite mostrarte las señales y estrategias más relevantes para ti.
        </p>
      </div>

      <div className="space-y-4">
        {tradingStyles.map((style) => {
          const Icon = style.icon;
          return (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedStyle === style.id
                  ? "border-primary bg-primary/5 shadow-glow-subtle"
                  : "border-line bg-surface hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  selectedStyle === style.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">{style.title}</h3>
                  <p className="text-muted-foreground font-medium">{style.description}</p>
                  <p className="text-sm text-muted-foreground">{style.details}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedStyle}
        size="lg"
        className="w-full bg-gradient-primary hover:shadow-glow h-12"
      >
        Continuar
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
};

export default Step3Preferences;