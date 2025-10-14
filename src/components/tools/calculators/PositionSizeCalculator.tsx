import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorLayout } from "./CalculatorLayout";
import { useCalculator } from "@/hooks/useCalculator";
import { SymbolSelector } from "./SymbolSelector";
import { ContractSpecDrawer } from "../specifications/ContractSpecDrawer";
import { useContractSpec, getPipSize } from "@/hooks/useContractSpec";
import type { CalculatorConfig, CalculatorResult } from "@/types/calculators";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const config: CalculatorConfig = {
  id: 'position-size',
  title: 'Calculadora de Tamaño de Posición',
  description: 'Determina el tamaño óptimo de lote basado en tu gestión de riesgo',
  category: 'basic',
  icon: TrendingUp,
  tags: ['Gestión de Riesgo', 'Position Sizing', 'Money Management'],
  requiresContractSpec: true,
  inputs: [
    {
      id: 'symbol',
      label: 'Símbolo',
      type: 'select',
      tooltip: 'Instrumento que vas a tradear. Selecciona para cargar automáticamente el tamaño del contrato y valor del pip.',
      defaultValue: '',
      required: true,
    },
    {
      id: 'balance',
      label: 'Saldo de Cuenta',
      type: 'number',
      unit: 'USD',
      tooltip: 'Tu saldo total disponible para trading. No uses saldo prestado o en otras posiciones.',
      placeholder: '10000',
      min: 100,
      defaultValue: 10000,
      required: true,
    },
    {
      id: 'riskPercent',
      label: 'Riesgo por Operación',
      type: 'number',
      unit: '%',
      tooltip: 'Porcentaje de tu capital que estás dispuesto a perder en esta operación. Profesionales usan 1-2%.',
      placeholder: '1',
      min: 0.1,
      max: 10,
      step: 0.1,
      defaultValue: 1,
      required: true,
      warningThreshold: {
        value: 3,
        message: '⚠️ Riesgo mayor al 3% es muy agresivo y puede llevar a pérdidas significativas.',
        severity: 'high',
      },
    },
    {
      id: 'stopLoss',
      label: 'Stop Loss',
      type: 'number',
      unit: 'pips',
      tooltip: 'Distancia desde tu precio de entrada hasta tu Stop Loss, medida en pips.',
      placeholder: '50',
      min: 1,
      defaultValue: 50,
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de Tamaño de Posición',
    description: 'Determina cuántos lotes operar según tu nivel de riesgo aceptable',
    steps: [
      {
        step: 1,
        description: 'Calcular el monto en dólares que estás dispuesto a arriesgar',
        formula: 'Riesgo ($) = Saldo × (Riesgo % ÷ 100)',
        variables: {
          'Saldo': 'Tu capital disponible',
          'Riesgo %': 'Porcentaje que aceptas perder',
        },
        example: 'Con $10,000 y 1% de riesgo: $10,000 × 0.01 = $100',
      },
      {
        step: 2,
        description: 'Calcular el tamaño de posición en lotes',
        formula: 'Lotes = Riesgo ($) ÷ (Stop Loss en pips × Valor del pip)',
        variables: {
          'Riesgo ($)': 'Del paso 1',
          'Stop Loss': 'Distancia al SL en pips',
          'Valor del pip': 'Valor monetario de 1 pip',
        },
        example: 'Con $100 de riesgo, 50 pips de SL y $10/pip: 100 ÷ (50 × 10) = 0.20 lotes',
      },
    ],
    references: ['Money Management', 'Risk Management', 'Position Sizing'],
  },
};

function calculatePositionSize(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const balance = Number(inputs.balance);
  const riskPercent = Number(inputs.riskPercent);
  const stopLoss = Number(inputs.stopLoss);
  const contractSize = Number(inputs.contractSize) || 100000;
  const pipValue = Number(inputs.pipValue) || 10;

  // Step 1: Calculate risk amount
  const riskAmount = balance * (riskPercent / 100);

  // Step 2: Calculate lot size
  const lotSize = riskAmount / (stopLoss * pipValue);

  // Calculate potential loss
  const potentialLoss = riskAmount;

  return [
    {
      id: 'lotSize',
      label: 'Tamaño de Posición Recomendado',
      value: lotSize,
      unit: 'lotes',
      format: 'number',
      decimals: 2,
      highlight: true,
      tooltip: 'Este es el tamaño óptimo de posición según tu gestión de riesgo',
    },
    {
      id: 'riskUsd',
      label: 'Riesgo en USD',
      value: riskAmount,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      sentiment: 'warning',
      tooltip: 'Cantidad máxima que perderías si se activa el Stop Loss',
    },
    {
      id: 'riskPercent',
      label: 'Riesgo del Capital',
      value: riskPercent,
      unit: '%',
      format: 'percentage',
      decimals: 2,
      sentiment: riskPercent > 3 ? 'negative' : riskPercent > 2 ? 'warning' : 'positive',
      tooltip: 'Porcentaje de tu capital total en riesgo',
    },
    {
      id: 'potentialLoss',
      label: 'Pérdida Potencial si SL',
      value: potentialLoss,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      sentiment: 'negative',
      tooltip: 'Pérdida exacta si se alcanza el Stop Loss',
    },
  ];
}

export function PositionSizeCalculator() {
  const calculator = useCalculator(config, calculatePositionSize);
  const symbol = calculator.getInputValue('symbol') as string;
  const { data: contractSpec } = useContractSpec(symbol);
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  // Auto-populate contract size and pip value when symbol changes
  useEffect(() => {
    if (contractSpec) {
      calculator.updateInput('contractSize', contractSpec.contract_size);
      const pipSize = getPipSize(contractSpec.pip_position);
      const lots = 1; // Standard lot for calculation
      const pipValue = lots * contractSpec.contract_size * pipSize;
      calculator.updateInput('pipValue', pipValue);
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
              <span className="font-semibold text-foreground">Contrato:</span> {contractSpec.contract_size.toLocaleString()}
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Valor pip (1 lote):</span> ${calculator.getInputValue('pipValue')}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="balance">{config.inputs[1].label}</Label>
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
            id="balance"
            type="number"
            value={Number(calculator.getInputValue('balance'))}
            onChange={(e) => calculator.updateInput('balance', Number(e.target.value))}
            min={config.inputs[1].min}
            className="bg-input border-line/50"
          />
          {calculator.state.errors.balance && (
            <p className="text-xs text-destructive">{calculator.state.errors.balance}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="riskPercent">{config.inputs[2].label}</Label>
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
            id="riskPercent"
            type="number"
            value={Number(calculator.getInputValue('riskPercent'))}
            onChange={(e) => calculator.updateInput('riskPercent', Number(e.target.value))}
            min={config.inputs[2].min}
            max={config.inputs[2].max}
            step={config.inputs[2].step}
            className="bg-input border-line/50"
          />
          {calculator.state.warnings.riskPercent && (
            <div className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/30">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
              <p className="text-xs text-warning">{calculator.state.warnings.riskPercent}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="stopLoss">{config.inputs[3].label}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{config.inputs[3].tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="stopLoss"
            type="number"
            value={Number(calculator.getInputValue('stopLoss'))}
            onChange={(e) => calculator.updateInput('stopLoss', Number(e.target.value))}
            min={config.inputs[3].min}
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
