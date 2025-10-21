import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface OnboardingHeaderProps {
  stepNumber: number;
  progress: number;
}

export const OnboardingHeader = ({ stepNumber, progress }: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-surface/95 backdrop-blur-xl sticky top-0 z-50">
      <div className={cn(DESIGN_TOKENS.container.narrow, "px-3 sm:px-6 lg:px-8")}>
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Title */}
          <div className={cn("flex items-center", DESIGN_TOKENS.spacing.gap.sm)}>
            <h1 className="text-base sm:text-lg font-semibold gradient-text">Tálamo</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              Acceso
            </Badge>
          </div>

          {/* Step Indicator */}
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {stepNumber}/8
          </div>

          {/* Exit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2"
          >
            <X className={cn(DESIGN_TOKENS.icon.md)} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="pb-2 sm:pb-3">
          <Progress 
            value={progress} 
            className="h-1 sm:h-1.5 bg-muted/30"
          />
        </div>
      </div>
    </header>
  );
};