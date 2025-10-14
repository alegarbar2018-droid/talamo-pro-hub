import { Calculator } from "lucide-react";

interface CalculatorEmptyProps {
  message?: string;
}

export function CalculatorEmpty({
  message = "Completa los campos y haz clic en Calcular",
}: CalculatorEmptyProps) {
  return (
    <div className="py-16 text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
        <Calculator className="w-10 h-10 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        {message}
      </p>
    </div>
  );
}
