import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DoneStepProps {
  onClearState: () => void;
}

export const DoneStep = ({ onClearState }: DoneStepProps) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onClearState();
    navigate("/dashboard");
  };

  return (
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          ¡Bienvenido a Tálamo!
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Tu cuenta ha sido configurada exitosamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 dark:bg-green-950 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">Próximos pasos:</h3>
          <ul className="space-y-1 text-xs sm:text-sm text-green-800 dark:text-green-200">
            <li>✓ Explora la Academia estructurada</li>
            <li>✓ Configura tu Journal de trading</li>
            <li>✓ Revisa las herramientas disponibles</li>
            <li>✓ Únete a la comunidad</li>
          </ul>
        </div>
        
        <Button
          onClick={handleGoToDashboard}
          className="w-full bg-gradient-primary hover:shadow-glow h-10 sm:h-11"
        >
          Ir a mi panel
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};