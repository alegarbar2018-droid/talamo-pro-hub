import { ReactNode } from "react";
import { Calculator, RotateCcw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormulaExplainer } from "./FormulaExplainer";
import { CalculatorEmpty } from "./CalculatorEmpty";
import { motion } from "framer-motion";
import type { CalculatorConfig, CalculatorResult } from "@/types/calculators";

interface CalculatorLayoutProps {
  config: CalculatorConfig;
  inputs: ReactNode;
  results: CalculatorResult[];
  onCalculate: () => void;
  onReset: () => void;
  isCalculating?: boolean;
  showResults?: boolean;
  className?: string;
}

export function CalculatorLayout({
  config,
  inputs,
  results,
  onCalculate,
  onReset,
  isCalculating = false,
  showResults = false,
  className = "",
}: CalculatorLayoutProps) {
  const Icon = config.icon;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-success/10 text-success border-success/30';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'basic':
        return 'Básica';
      case 'intermediate':
        return 'Intermedia';
      case 'advanced':
        return 'Avanzada';
      default:
        return category;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-loss';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-neutral';
    }
  };

  return (
    <div className={`grid lg:grid-cols-[1fr,400px] gap-6 ${className}`}>
      {/* Left Column: Inputs & Formula */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/30">
              <Icon className="w-6 h-6 text-teal" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
                <Badge className={getCategoryColor(config.category)}>
                  {getCategoryLabel(config.category)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>

          {/* Tags */}
          {config.tags && config.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-line/50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-line/50" />

        {/* Inputs Section */}
        <Card className="border-line/50 bg-surface/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal" />
              Parámetros
            </CardTitle>
            <CardDescription>
              Ingresa los valores para realizar el cálculo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div role="form" aria-label={`${config.title} calculator inputs`}>
              {inputs}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onCalculate}
                disabled={isCalculating}
                className="flex-1 bg-gradient-to-r from-teal to-teal-dark hover:shadow-glow-subtle transition-all"
                aria-label="Calculate results"
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Calcular
                  </>
                )}
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                className="border-line/50 hover:bg-surface/50"
                aria-label="Reset calculator"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formula Explainer */}
        <FormulaExplainer formula={config.formula} />
      </motion.div>

      {/* Right Column: Results (Sticky) */}
      <motion.div 
        className="lg:sticky lg:top-6 lg:h-fit"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-line/50 bg-gradient-to-br from-surface/50 to-surface/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Resultados</CardTitle>
            <CardDescription>
              {showResults ? 'Cálculo completado' : 'Los resultados aparecerán aquí'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div role="region" aria-label="Calculation results" aria-live="polite">
              {!showResults ? (
                <CalculatorEmpty />
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <div className="space-y-4 pr-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`p-4 rounded-lg border transition-all ${
                          result.highlight
                            ? 'bg-gradient-to-br from-teal/10 to-teal/5 border-teal/30 shadow-glow-subtle'
                            : 'bg-muted/20 border-line/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs text-muted-foreground font-medium">
                            {result.label}
                          </p>
                          {result.tooltip && (
                            <span className="text-xs text-muted-foreground/50" aria-label="More information">ⓘ</span>
                          )}
                        </div>
                        <p
                          className={`text-2xl font-bold ${
                            result.highlight
                              ? 'bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent'
                              : getSentimentColor(result.sentiment)
                          }`}
                        >
                          {typeof result.value === 'number'
                            ? result.value.toFixed(result.decimals)
                            : result.value}
                          {result.unit && (
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                              {result.unit}
                            </span>
                          )}
                        </p>
                        {result.tooltip && (
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            {result.tooltip}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
