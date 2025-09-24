import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Shield, Sparkles, Gift, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingHeaderProps {
  stepNumber: number;
  progress: number;
}

export const OnboardingHeader = ({ stepNumber, progress }: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg" />
        </div>
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl p-2"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold">Premium Access</span>
            </div>
          </div>
          
          {/* Free Access Banner */}
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Gift className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium">100% Gratuito</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Acceso Exclusivo a Tálamo
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Herramientas profesionales de trading sin costo alguno
            </p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-gradient-to-r from-surface/95 to-background/95 backdrop-blur-xl border-b border-line/30 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Step Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Paso {stepNumber} de 5</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-line" />
              <Badge variant="secondary" className="text-xs">
                Validación Gratuita
              </Badge>
            </div>
            
            {/* Why Free Info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-green-500" />
              <span>Powered by Exness Partnership</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso del Setup</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2 bg-muted/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};