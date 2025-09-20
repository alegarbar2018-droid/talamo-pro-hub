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
    <div className="border-b border-line bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Solicitar acceso</h1>
              <p className="text-sm text-muted-foreground">Paso {stepNumber} de 5</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary text-primary">
            Tálamo
          </Badge>
        </div>
        <div className="pb-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};