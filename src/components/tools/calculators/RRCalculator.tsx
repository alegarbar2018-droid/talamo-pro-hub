import { Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorLayout } from "./CalculatorLayout";
import { useCalculator } from "@/hooks/useCalculator";
import type { CalculatorConfig, CalculatorResult } from "@/types/calculators";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

const config: CalculatorConfig = {
  id: 'rr-expectancy',
  title: 'Calculadora de R/R y Expectativa',
  description: 'Determina si tu estrategia es matemáticamente rentable',
  category: 'advanced',
  icon: Scale,
  tags: ['Risk/Reward', 'Expectancy', 'Strategy Analysis'],
  inputs: [
    {
      id: 'winRate',
      label: 'Tasa de Acierto',
      type: 'number',
      unit: '%',
      tooltip: 'Porcentaje de operaciones ganadoras (ej: 60% = 6 de cada 10 ganan)',
      min: 0,
      max: 100,
      defaultValue: 60,
      required: true,
    },
    {
      id: 'avgWin',
      label: 'Ganancia Promedio',
      type: 'number',
      unit: 'USD',
      tooltip: 'Ganancia promedio cuando ganas',
      min: 1,
      defaultValue: 150,
      required: true,
    },
    {
      id: 'avgLoss',
      label: 'Pérdida Promedio',
      type: 'number',
      unit: 'USD',
      tooltip: 'Pérdida promedio cuando pierdes',
      min: 1,
      defaultValue: 100,
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de Expectativa Matemática',
    description: 'Determina si una estrategia es rentable a largo plazo',
    steps: [
      {
        step: 1,
        description: 'Calcular ratio Riesgo/Recompensa',
        formula: 'R/R = Ganancia Promedio ÷ Pérdida Promedio',
        example: '$150 ÷ $100 = 1.5',
      },
      {
        step: 2,
        description: 'Calcular expectativa matemática',
        formula: 'Expectativa = (Win Rate × Avg Win) - (Loss Rate × Avg Loss)',
        variables: {
          'Win Rate': 'Probabilidad de ganar',
          'Loss Rate': '(100 - Win Rate)',
          'Avg Win': 'Ganancia promedio',
          'Avg Loss': 'Pérdida promedio',
        },
        example: '(0.60 × $150) - (0.40 × $100) = $90 - $40 = $50 por operación',
      },
    ],
    references: ['Mathematical Expectancy', 'Kelly Criterion'],
  },
};

function calculateRRExpectancy(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const winRate = Number(inputs.winRate);
  const avgWin = Number(inputs.avgWin);
  const avgLoss = Number(inputs.avgLoss);

  const lossRate = 100 - winRate;
  const rrRatio = avgWin / avgLoss;
  const expectancy = (winRate / 100 * avgWin) - (lossRate / 100 * avgLoss);

  // Determine if strategy is viable
  const isViable = expectancy > 0;
  const viabilityMessage = isViable
    ? 'Estrategia matemáticamente rentable ✓'
    : 'Estrategia no rentable a largo plazo ✗';

  // Calculate trades needed to make $1000
  const tradesFor1000 = expectancy > 0 ? Math.ceil(1000 / expectancy) : null;

  return [
    {
      id: 'rrRatio',
      label: 'Ratio Riesgo/Recompensa',
      value: rrRatio,
      format: 'number',
      decimals: 2,
      sentiment: rrRatio >= 2 ? 'positive' : rrRatio >= 1.5 ? 'neutral' : 'warning',
      tooltip: rrRatio >= 2 ? 'Excelente R/R' : rrRatio >= 1.5 ? 'R/R aceptable' : 'Considera mejorar tu R/R',
    },
    {
      id: 'expectancy',
      label: 'Expectativa Matemática',
      value: expectancy,
      unit: 'USD/trade',
      format: 'currency',
      decimals: 2,
      highlight: true,
      sentiment: expectancy > 0 ? 'positive' : 'negative',
      tooltip: 'Ganancia o pérdida esperada por operación a largo plazo',
    },
    {
      id: 'viability',
      label: 'Viabilidad',
      value: viabilityMessage,
      format: 'number',
      decimals: 0,
      sentiment: isViable ? 'positive' : 'negative',
    },
    ...(tradesFor1000 !== null
      ? [{
          id: 'tradesFor1000',
          label: 'Operaciones para $1,000',
          value: tradesFor1000,
          unit: 'trades',
          format: 'number' as const,
          decimals: 0,
          sentiment: 'neutral' as const,
          tooltip: 'Número aproximado de operaciones necesarias para ganar $1,000',
        }]
      : []),
  ];
}

export function RRCalculator() {
  const calculator = useCalculator(config, calculateRRExpectancy);

  const expectancy = calculator.state.results.find(r => r.id === 'expectancy')?.value;
  const isViable = typeof expectancy === 'number' && expectancy > 0;

  const InputsSection = (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="winRate">{config.inputs[0].label}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{config.inputs[0].tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="winRate"
            type="number"
            value={Number(calculator.getInputValue('winRate'))}
            onChange={(e) => calculator.updateInput('winRate', Number(e.target.value))}
            min={config.inputs[0].min}
            max={config.inputs[0].max}
            className="bg-input border-line/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="avgWin">{config.inputs[1].label}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{config.inputs[1].tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="avgWin"
              type="number"
              value={Number(calculator.getInputValue('avgWin'))}
              onChange={(e) => calculator.updateInput('avgWin', Number(e.target.value))}
              min={config.inputs[1].min}
              className="bg-input border-line/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="avgLoss">{config.inputs[2].label}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{config.inputs[2].tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="avgLoss"
              type="number"
              value={Number(calculator.getInputValue('avgLoss'))}
              onChange={(e) => calculator.updateInput('avgLoss', Number(e.target.value))}
              min={config.inputs[2].min}
              className="bg-input border-line/50"
            />
          </div>
        </div>

        {calculator.state.results.length > 0 && (
          <div className={`p-4 rounded-lg border ${
            isViable
              ? 'bg-success/10 border-success/30'
              : 'bg-destructive/10 border-destructive/30'
          }`}>
            <div className="flex items-start gap-3">
              {isViable ? (
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <p className={`font-semibold text-sm ${
                  isViable ? 'text-success' : 'text-destructive'
                }`}>
                  {isViable ? 'Estrategia Rentable' : 'Estrategia No Rentable'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isViable
                    ? 'A largo plazo, esta estrategia es matemáticamente rentable. Mantén la disciplina.'
                    : 'Esta combinación de win rate y R/R no es rentable. Mejora tu tasa de acierto o tu ratio R/R.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );

  return (
    <CalculatorLayout
      config={config}
      inputs={InputsSection}
      results={calculator.state.results}
      onCalculate={calculator.calculate}
      onReset={calculator.reset}
      isCalculating={calculator.state.isCalculating}
      showResults={calculator.state.results.length > 0}
    />
  );
}
