import { useState } from "react";
import { ChevronDown, BookOpen, Code2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import type { CalculatorFormula } from "@/types/calculators";

interface FormulaExplainerProps {
  formula: CalculatorFormula;
  className?: string;
}

export function FormulaExplainer({ formula, className = "" }: FormulaExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`rounded-lg border border-line/50 bg-surface/50 backdrop-blur-sm ${className}`}
    >
      <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface/70 transition-colors">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-teal" />
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">
              Cómo funciona esta calculadora
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formula.description}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="px-6 pb-6 pt-2">
        <div className="space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            {formula.steps.map((step, index) => (
              <div
                key={step.step}
                className="relative pl-8 pb-4 border-l-2 border-teal/30 last:border-transparent last:pb-0"
              >
                {/* Step number badge */}
                <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center">
                  <span className="text-xs font-bold text-teal">{step.step}</span>
                </div>

                {/* Step content */}
                <div className="space-y-3">
                  <p className="text-sm text-foreground/90 font-medium">
                    {step.description}
                  </p>

                  {/* Formula */}
                  <div className="bg-muted/30 rounded-md p-3 border border-line/30">
                    <div className="flex items-start gap-2">
                      <Code2 className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                      <code className="text-sm font-mono text-teal-ink break-all">
                        {step.formula}
                      </code>
                    </div>
                  </div>

                  {/* Variables explanation */}
                  {step.variables && Object.keys(step.variables).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(step.variables).map(([variable, description]) => (
                        <div
                          key={variable}
                          className="text-xs bg-surface/50 rounded px-2 py-1.5 border border-line/20"
                        >
                          <span className="font-mono text-teal font-semibold">{variable}</span>
                          <span className="text-muted-foreground"> = {description}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Example */}
                  {step.example && (
                    <div className="bg-success/5 border border-success/20 rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-1">Ejemplo:</p>
                      <p className="text-sm text-foreground/80">{step.example}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* References */}
          {formula.references && formula.references.length > 0 && (
            <div className="pt-4 border-t border-line/30">
              <p className="text-xs text-muted-foreground mb-2">Referencias:</p>
              <div className="flex flex-wrap gap-2">
                {formula.references.map((ref, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-teal/30 text-muted-foreground"
                  >
                    {ref}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
