import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "./CalculatorLayout";
import { useCalculator } from "@/hooks/useCalculator";
import { SymbolSelector } from "./SymbolSelector";
import { useContractSpec } from "@/hooks/useContractSpec";
import type { CalculatorConfig, CalculatorResult } from "@/types/calculators";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";

const config: CalculatorConfig = {
  id: 'margin',
  title: 'Calculadora de Margen',
  description: 'Calcula el margen requerido para abrir una posición',
  category: 'basic',
  icon: Wallet,
  tags: ['Margin', 'Leverage', 'Risk Management'],
  requiresContractSpec: true,
  inputs: [
    {
      id: 'symbol',
      label: 'Símbolo',
      type: 'select',
      tooltip: 'Instrumento que vas a tradear',
      defaultValue: '',
      required: true,
    },
    {
      id: 'lots',
      label: 'Lotes',
      type: 'number',
      tooltip: 'Tamaño de tu posición en lotes',
      min: 0.01,
      step: 0.01,
      defaultValue: 1,
      required: true,
    },
    {
      id: 'leverage',
      label: 'Apalancamiento',
      type: 'select',
      tooltip: 'Nivel de apalancamiento de tu cuenta (ej: 1:100 significa que por cada $1 controlas $100)',
      defaultValue: '100',
      options: [
        { value: '50', label: '1:50' },
        { value: '100', label: '1:100' },
        { value: '200', label: '1:200' },
        { value: '500', label: '1:500' },
        { value: '1000', label: '1:1000' },
      ],
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de Margen Requerido',
    description: 'Determina cuánto capital necesitas reservar para abrir la posición',
    steps: [
      {
        step: 1,
        description: 'Calcular el margen en moneda base',
        formula: 'Margen = (Lotes × Tamaño Contrato) ÷ Apalancamiento',
        variables: {
          'Lotes': 'Tamaño de posición',
          'Tamaño Contrato': 'Unidades por lote',
          'Apalancamiento': 'Nivel de apalancamiento',
        },
        example: '1 lote EUR/USD con 1:100: (1 × 100,000) ÷ 100 = $1,000',
      },
    ],
    references: ['Margin', 'Leverage', 'Account Management'],
  },
};

function calculateMargin(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const lots = Number(inputs.lots);
  const contractSize = Number(inputs.contractSize) || 100000;
  const leverage = Number(inputs.leverage);

  const marginBase = (lots * contractSize) / leverage;
  const totalExposure = lots * contractSize;

  return [
    {
      id: 'margin',
      label: 'Margen Requerido',
      value: marginBase,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      highlight: true,
      tooltip: 'Capital que necesitas tener disponible para abrir esta posición',
    },
    {
      id: 'exposure',
      label: 'Exposición Total',
      value: totalExposure,
      unit: 'USD',
      format: 'currency',
      decimals: 0,
      sentiment: 'neutral',
      tooltip: 'Valor total de la posición sin apalancamiento',
    },
    {
      id: 'leverage',
      label: 'Apalancamiento Usado',
      value: leverage,
      unit: 'x',
      format: 'number',
      decimals: 0,
      sentiment: leverage > 200 ? 'warning' : 'neutral',
      tooltip: 'Multiplicador del capital disponible',
    },
  ];
}

export function MarginCalculator() {
  const calculator = useCalculator(config, calculateMargin);
  const symbol = calculator.getInputValue('symbol') as string;
  const { data: contractSpec } = useContractSpec(symbol);

  useEffect(() => {
    if (contractSpec) {
      calculator.updateInput('contractSize', contractSpec.contract_size);
    }
  }, [contractSpec]);

  const InputsSection = (
    <TooltipProvider>
      <div className="space-y-4">
        <SymbolSelector
          value={calculator.getInputValue('symbol') as string}
          onValueChange={(value) => calculator.updateInput('symbol', value)}
        />

        {contractSpec && (
          <div className="p-3 rounded-lg bg-teal/5 border border-teal/20 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Tamaño Contrato:</span> {contractSpec.contract_size.toLocaleString()}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="lots">{config.inputs[1].label}</Label>
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
            id="lots"
            type="number"
            value={Number(calculator.getInputValue('lots'))}
            onChange={(e) => calculator.updateInput('lots', Number(e.target.value))}
            min={config.inputs[1].min}
            step={config.inputs[1].step}
            className="bg-input border-line/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="leverage">{config.inputs[2].label}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{config.inputs[2].tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={String(calculator.getInputValue('leverage'))}
            onValueChange={(value) => calculator.updateInput('leverage', Number(value))}
          >
            <SelectTrigger className="bg-input border-line/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {config.inputs[2].options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
