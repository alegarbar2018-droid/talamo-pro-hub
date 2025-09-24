import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingHeaderProps {
  stepNumber: number;
  progress: number;
}

export const OnboardingHeader = ({ stepNumber, progress }: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-surface/90 to-surface/70 backdrop-blur-xl border-b border-line/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl p-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Solicitar Acceso
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Paso {stepNumber} de 5 • Tálamo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 px-4 py-2 text-sm font-semibold">
              Tálamo
            </Badge>
          </div>
        </div>
        <div className="pb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted/50" />
        </div>
      </div>
    </div>
  );
};