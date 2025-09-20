import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    experience: "",
    objective: "",
    timeframe: "",
    instruments: [] as string[],
    riskTolerance: ""
  });
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile and go to dashboard
      localStorage.setItem("profileCompleted", "true");
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Cuál es tu nivel de experiencia en trading?
              </h3>
              <Select value={profileData.experience} onValueChange={(value) => 
                setProfileData({ ...profileData, experience: value })
              }>
                <SelectTrigger className="bg-input border-line">
                  <SelectValue placeholder="Selecciona tu nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Principiante (0-6 meses)</SelectItem>
                  <SelectItem value="intermediate">Intermedio (6 meses - 2 años)</SelectItem>
                  <SelectItem value="advanced">Avanzado (2+ años)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Cuál es tu objetivo principal?
              </h3>
              <Select value={profileData.objective} onValueChange={(value) => 
                setProfileData({ ...profileData, objective: value })
              }>
                <SelectTrigger className="bg-input border-line">
                  <SelectValue placeholder="Selecciona tu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learn">Aprender fundamentos</SelectItem>
                  <SelectItem value="improve">Mejorar resultados actuales</SelectItem>
                  <SelectItem value="scale">Escalar capital</SelectItem>
                  <SelectItem value="live">Generar ingresos constantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿En qué ventana temporal prefieres operar?
              </h3>
              <Select value={profileData.timeframe} onValueChange={(value) => 
                setProfileData({ ...profileData, timeframe: value })
              }>
                <SelectTrigger className="bg-input border-line">
                  <SelectValue placeholder="Selecciona timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scalping">Scalping (M1-M5)</SelectItem>
                  <SelectItem value="intraday">Intraday (M15-H1)</SelectItem>
                  <SelectItem value="swing">Swing (H4-D1)</SelectItem>
                  <SelectItem value="position">Posición (W1-MN)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Cuál es tu tolerancia al riesgo?
              </h3>
              <Select value={profileData.riskTolerance} onValueChange={(value) => 
                setProfileData({ ...profileData, riskTolerance: value })
              }>
                <SelectTrigger className="bg-input border-line">
                  <SelectValue placeholder="Selecciona tolerancia al riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservador (1-2% por trade)</SelectItem>
                  <SelectItem value="moderate">Moderado (2-3% por trade)</SelectItem>
                  <SelectItem value="aggressive">Agresivo (3-5% por trade)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Configuración Inicial</h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia en Tálamo
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-line bg-surface shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal" />
              Paso {currentStep}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Esta información nos ayuda a personalizar tu experiencia
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !profileData.experience) ||
                  (currentStep === 2 && !profileData.objective) ||
                  (currentStep === 3 && !profileData.timeframe) ||
                  (currentStep === 4 && !profileData.riskTolerance)
                }
                className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow"
              >
                {currentStep === totalSteps ? "Finalizar" : "Siguiente"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground text-center">
          <p>Puedes cambiar esta configuración más tarde desde tu perfil</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;