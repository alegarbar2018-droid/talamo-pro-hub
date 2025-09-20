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
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          ¡Bienvenido a Tálamo!
        </CardTitle>
        <CardDescription>
          Tu cuenta ha sido configurada exitosamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-950 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Próximos pasos:</h3>
          <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
            <li>✓ Explora la Academia estructurada</li>
            <li>✓ Configura tu Journal de trading</li>
            <li>✓ Revisa las herramientas disponibles</li>
            <li>✓ Únete a la comunidad</li>
          </ul>
        </div>
        
        <Button
          onClick={handleGoToDashboard}
          className="w-full bg-gradient-primary hover:shadow-glow h-11"
        >
          Ir a mi panel
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};