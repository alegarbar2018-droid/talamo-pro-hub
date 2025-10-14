import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "./CalculatorLayout";
import { useCalculator } from "@/hooks/useCalculator";
import { SymbolSelector } from "./SymbolSelector";
import { ContractSpecDrawer } from "../specifications/ContractSpecDrawer";
import { useContractSpec, getPipSize } from "@/hooks/useContractSpec";
import type { CalculatorConfig, CalculatorResult } from "@/types/calculators";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const config: CalculatorConfig = {
  id: 'swap',
  title: 'Calculadora de Swap',
  description: 'Calcula el costo o crédito de mantener una posición overnight',
  category: 'advanced',
  icon: Clock,
  tags: ['Swap', 'Overnight', 'Financing'],
  requiresContractSpec: true,
  inputs: [
    {
      id: 'orderType',
      label: 'Tipo de Orden',
      type: 'select',
      tooltip: 'BUY usa swap long, SELL usa swap short',
      defaultValue: 'buy',
      options: [
        { value: 'buy', label: 'BUY (Long)' },
        { value: 'sell', label: 'SELL (Short)' },
      ],
      required: true,
    },
    {
      id: 'symbol',
      label: 'Símbolo',
      type: 'select',
      tooltip: 'Instrumento con tasas de swap específicas',
      defaultValue: '',
      required: true,
    },
    {
      id: 'lots',
      label: 'Lotes',
      type: 'number',
      tooltip: 'Tamaño de la posición',
      min: 0.01,
      step: 0.01,
      defaultValue: 1,
      required: true,
    },
    {
      id: 'days',
      label: 'Número de Días',
      type: 'number',
      tooltip: 'Días que mantendrás la posición abierta (miércoles cuenta triple)',
      min: 1,
      defaultValue: 1,
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de Swap',
    description: 'Determina el costo de financiamiento overnight',
    steps: [
      {
        step: 1,
        description: 'Calcular swap diario',
        formula: 'Swap = Tamaño Swap × Número días × Valor Pip',
        variables: {
          'Tamaño Swap': 'Long/Short swap del símbolo',
          'Número días': 'Días manteniendo posición',
          'Valor Pip': 'Valor de 1 pip',
        },
        example: 'Swap -0.5 pips × 3 días × $10/pip = -$15',
      },
    ],
    references: ['Swap', 'Rollover', 'Overnight Interest'],
  },
};

function calculateSwap(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const orderType = String(inputs.orderType);
  const lots = Number(inputs.lots);
  const days = Number(inputs.days);
  const contractSize = Number(inputs.contractSize) || 100000;
  const pipSize = Number(inputs.pipSize) || 0.0001;
  const swapLong = Number(inputs.swapLong) || 0;
  const swapShort = Number(inputs.swapShort) || 0;

  // Select appropriate swap rate
  const swapRate = orderType === 'buy' ? swapLong : swapShort;

  // Calculate pip value
  const pipValue = lots * contractSize * pipSize;

  // Calculate swap
  const dailySwap = swapRate * pipValue;
  const totalSwap = dailySwap * days;

  const sentiment = totalSwap > 0 ? 'positive' : totalSwap < 0 ? 'negative' : 'neutral';

  return [
    {
      id: 'dailySwap',
      label: 'Swap Diario',
      value: dailySwap,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      sentiment,
      tooltip: dailySwap > 0 ? 'Crédito que recibes cada día' : 'Costo que pagas cada día',
    },
    {
      id: 'totalSwap',
      label: 'Swap Total',
      value: totalSwap,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      highlight: true,
      sentiment,
      tooltip: `Swap total por ${days} día(s)`,
    },
    {
      id: 'swapRate',
      label: 'Tasa Swap',
      value: swapRate,
      unit: 'pips',
      format: 'number',
      decimals: 2,
      sentiment: 'neutral',
    },
  ];
}

export function SwapCalculator() {
  const calculator = useCalculator(config, calculateSwap);
  const symbol = calculator.getInputValue('symbol') as string;
  const { data: contractSpec } = useContractSpec(symbol);
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  useEffect(() => {
    if (contractSpec) {
      calculator.updateInput('contractSize', contractSpec.contract_size);
      const pipSize = getPipSize(contractSpec.pip_position);
      calculator.updateInput('pipSize', pipSize);
      calculator.updateInput('swapLong', contractSpec.swap_long || 0);
      calculator.updateInput('swapShort', contractSpec.swap_short || 0);
    }
  }, [contractSpec]);

  const InputsSection = (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{config.inputs[0].label}</Label>
          <Select
            value={String(calculator.getInputValue('orderType'))}
            onValueChange={(value) => calculator.updateInput('orderType', value)}
          >
            <SelectTrigger className="bg-input border-line/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {config.inputs[0].options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              <span className="font-semibold text-foreground">Swap Long:</span> {contractSpec.swap_long ?? 'N/A'} pips
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Swap Short:</span> {contractSpec.swap_short ?? 'N/A'} pips
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="lots">{config.inputs[2].label}</Label>
          <Input
            id="lots"
            type="number"
            value={Number(calculator.getInputValue('lots'))}
            onChange={(e) => calculator.updateInput('lots', Number(e.target.value))}
            min={config.inputs[2].min}
            step={config.inputs[2].step}
            className="bg-input border-line/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="days">{config.inputs[3].label}</Label>
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
            id="days"
            type="number"
            value={Number(calculator.getInputValue('days'))}
            onChange={(e) => calculator.updateInput('days', Number(e.target.value))}
            min={config.inputs[3].min}
            className="bg-input border-line/50"
          />
        </div>

        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-xs text-warning">
          <p className="font-semibold mb-1">Nota sobre Swap Triple:</p>
          <p>Los miércoles se cobra swap triple para Forex y Metales. Para otros instrumentos, el swap triple es el viernes.</p>
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
