import { useState, useEffect } from "react";
import { DollarSign, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorLayout } from "./CalculatorLayout";
import { useCalculator } from "@/hooks/useCalculator";
import { SymbolSelector } from "./SymbolSelector";
import { ContractSpecDrawer } from "../specifications/ContractSpecDrawer";
import { useContractSpec, getPipSize } from "@/hooks/useContractSpec";
import type { CalculatorConfig, CalculatorResult } from "@/types/calculators";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const config: CalculatorConfig = {
  id: 'pip-value',
  title: 'Calculadora de Valor del Pip',
  description: 'Calcula cuánto vale cada pip en tu operación',
  category: 'basic',
  icon: DollarSign,
  tags: ['Pip Value', 'Money Management'],
  requiresContractSpec: true,
  inputs: [
    {
      id: 'symbol',
      label: 'Símbolo',
      type: 'select',
      tooltip: 'Instrumento para cargar automáticamente el tamaño del contrato y posición del pip',
      defaultValue: '',
      required: true,
    },
    {
      id: 'lots',
      label: 'Lotes',
      type: 'number',
      tooltip: 'Tamaño de tu posición en lotes (1 lote = 100,000 unidades estándar)',
      min: 0.01,
      step: 0.01,
      defaultValue: 1,
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de Valor del Pip',
    description: 'Determina el valor monetario de un movimiento de 1 pip',
    steps: [
      {
        step: 1,
        description: 'Calcular el valor del pip en la moneda cotizada',
        formula: 'Valor Pip = Lotes × Tamaño Contrato × Tamaño Pip',
        variables: {
          'Lotes': 'Tamaño de posición',
          'Tamaño Contrato': 'Unidades por lote (ej: 100,000)',
          'Tamaño Pip': '0.0001 para EUR/USD, 0.01 para USD/JPY',
        },
        example: '1 lote EUR/USD: 1 × 100,000 × 0.0001 = $10/pip',
      },
    ],
    references: ['Pip Value', 'Contract Specifications'],
  },
};

function calculatePipValue(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const lots = Number(inputs.lots);
  const contractSize = Number(inputs.contractSize) || 100000;
  const pipSize = Number(inputs.pipSize) || 0.0001;

  const pipValue = lots * contractSize * pipSize;

  return [
    {
      id: 'pipValue',
      label: 'Valor del Pip',
      value: pipValue,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      highlight: true,
      tooltip: 'Valor en USD de un movimiento de 1 pip con este tamaño de posición',
    },
    {
      id: 'pipValue10',
      label: 'Valor de 10 Pips',
      value: pipValue * 10,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      sentiment: 'neutral',
    },
    {
      id: 'pipValue100',
      label: 'Valor de 100 Pips',
      value: pipValue * 100,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      sentiment: 'positive',
    },
  ];
}

export function PipValueCalculator() {
  const calculator = useCalculator(config, calculatePipValue);
  const symbol = calculator.getInputValue('symbol') as string;
  const { data: contractSpec } = useContractSpec(symbol);
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  useEffect(() => {
    if (contractSpec) {
      calculator.updateInput('contractSize', contractSpec.contract_size);
      const pipSize = getPipSize(contractSpec.pip_position);
      calculator.updateInput('pipSize', pipSize);
    }
  }, [contractSpec]);

  const InputsSection = (
    <TooltipProvider>
      <div className="space-y-4">
        <SymbolSelector
          value={calculator.getInputValue('symbol') as string}
          onValueChange={(value) => {
            calculator.updateInput('symbol', value);
            setSelectedSymbol(value);
          }}
          onViewSpec={(sym) => {
            setSelectedSymbol(sym);
            setShowSpecDrawer(true);
          }}
        />

        {contractSpec && (
          <div className="p-3 rounded-lg bg-teal/5 border border-teal/20 text-sm space-y-1">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Tamaño Contrato:</span> {contractSpec.contract_size.toLocaleString()}
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Tamaño Pip:</span> {calculator.getInputValue('pipSize')}
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
      </div>
    </TooltipProvider>
  );

  return (
    <>
      <CalculatorLayout
        config={config}
        inputs={InputsSection}
        results={calculator.state.results}
        onCalculate={calculator.calculate}
        onReset={calculator.reset}
        isCalculating={calculator.state.isCalculating}
        showResults={calculator.state.results.length > 0}
      />
      <ContractSpecDrawer
        symbol={selectedSymbol}
        open={showSpecDrawer}
        onOpenChange={setShowSpecDrawer}
      />
    </>
  );
}
