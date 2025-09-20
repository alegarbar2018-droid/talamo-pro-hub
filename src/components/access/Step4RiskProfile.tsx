import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, AlertTriangle, TrendingUp } from "lucide-react";

interface Step4RiskProfileProps {
  data: {
    riskProfile?: string;
  };
  onUpdate: (data: { riskProfile: string }) => void;
  onNext: () => void;
}

const Step4RiskProfile = ({ data, onUpdate, onNext }: Step4RiskProfileProps) => {
  const [selectedProfile, setSelectedProfile] = useState(data.riskProfile || "");

  const riskProfiles = [
    {
      id: "conservative",
      title: "Conservador",
      description: "Priorizo la preservación del capital",
      icon: Shield,
      color: "risk-low",
      details: "Prefiero operaciones de bajo riesgo con retornos estables"
    },
    {
      id: "moderate",
      title: "Moderado",
      description: "Balance entre riesgo y retorno",
      icon: AlertTriangle,
      color: "risk-medium", 
      details: "Acepto cierto nivel de riesgo por mejores oportunidades"
    },
    {
      id: "aggressive",
      title: "Agresivo",
      description: "Busco maximizar las ganancias",
      icon: TrendingUp,
      color: "risk-high",
      details: "Estoy dispuesto a asumir riesgos altos por retornos elevados"
    }
  ];

  const handleNext = () => {
    if (!selectedProfile) return;
    
    onUpdate({ riskProfile: selectedProfile });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">¿Cuál es tu perfil de riesgo?</h2>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Tu tolerancia al riesgo nos ayuda a recomendarte las estrategias más adecuadas.
        </p>
      </div>

      <div className="space-y-4">
        {riskProfiles.map((profile) => {
          const Icon = profile.icon;
          return (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedProfile === profile.id
                  ? "border-primary bg-primary/5 shadow-glow-subtle"
                  : "border-line bg-surface hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  selectedProfile === profile.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">{profile.title}</h3>
                  <p className="text-muted-foreground font-medium">{profile.description}</p>
                  <p className="text-sm text-muted-foreground">{profile.details}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedProfile}
        size="lg"
        className="w-full bg-gradient-primary hover:shadow-glow h-12"
      >
        Continuar
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
};

export default Step4RiskProfile;