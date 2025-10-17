import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingHeaderProps {
  stepNumber: number;
  progress: number;
}

export const OnboardingHeader = ({ stepNumber, progress }: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-surface/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>

          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-base sm:text-lg font-semibold gradient-text">Tálamo</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              Acceso
            </Badge>
          </div>

          {/* Step Indicator */}
          <div className="text-sm text-muted-foreground font-medium">
            {stepNumber}/6
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pb-3 sm:pb-4">
          <Progress 
            value={progress} 
            className="h-1 bg-muted/30"
          />
        </div>
      </div>
    </header>
  );
};