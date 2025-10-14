import { useState, useEffect } from "react";
import { TrendingUp, HelpCircle } from "lucide-react";
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

const config: CalculatorConfig = {
  id: 'profit-loss',
  title: 'Calculadora de Ganancias/Pérdidas',
  description: 'Calcula el P&L de una operación cerrada o en curso',
  category: 'basic',
  icon: TrendingUp,
  tags: ['P&L', 'Profit', 'Loss'],
  requiresContractSpec: true,
  inputs: [
    {
      id: 'orderType',
      label: 'Tipo de Orden',
      type: 'select',
      tooltip: 'BUY si compraste, SELL si vendiste',
      defaultValue: 'buy',
      options: [
        { value: 'buy', label: 'BUY (Compra)' },
        { value: 'sell', label: 'SELL (Venta)' },
      ],
      required: true,
    },
    {
      id: 'symbol',
      label: 'Símbolo',
      type: 'select',
      tooltip: 'Instrumento tradeado',
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
      id: 'openPrice',
      label: 'Precio de Apertura',
      type: 'number',
      tooltip: 'Precio al que abriste la posición',
      min: 0,
      step: 0.00001,
      defaultValue: 1.1000,
      required: true,
    },
    {
      id: 'closePrice',
      label: 'Precio de Cierre',
      type: 'number',
      tooltip: 'Precio al que cerraste (o precio actual)',
      min: 0,
      step: 0.00001,
      defaultValue: 1.1050,
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de Profit/Loss',
    description: 'Determina la ganancia o pérdida de una operación',
    steps: [
      {
        step: 1,
        description: 'Calcular cambio de precio en pips',
        formula: 'BUY: (Precio Cierre - Precio Apertura) ÷ Tamaño Pip\nSELL: (Precio Apertura - Precio Cierre) ÷ Tamaño Pip',
        variables: {
          'Precio Apertura': 'Precio entrada',
          'Precio Cierre': 'Precio salida',
          'Tamaño Pip': '0.0001 o 0.01',
        },
        example: 'BUY EUR/USD: 1.1050 - 1.1000 = 0.0050 ÷ 0.0001 = 50 pips',
      },
      {
        step: 2,
        description: 'Calcular P&L en dinero',
        formula: 'P&L = Pips × Valor del Pip',
        example: '50 pips × $10/pip = $500',
      },
    ],
    references: ['P&L Calculation'],
  },
};

function calculateProfitLoss(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const orderType = String(inputs.orderType);
  const lots = Number(inputs.lots);
  const openPrice = Number(inputs.openPrice);
  const closePrice = Number(inputs.closePrice);
  const contractSize = Number(inputs.contractSize) || 100000;
  const pipSize = Number(inputs.pipSize) || 0.0001;

  // Step 1: Calculate price change in pips
  let priceChangePips: number;
  if (orderType === 'buy') {
    priceChangePips = (closePrice - openPrice) / pipSize;
  } else {
    priceChangePips = (openPrice - closePrice) / pipSize;
  }

  // Step 2: Calculate pip value
  const pipValue = lots * contractSize * pipSize;

  // Step 3: Calculate P&L
  const profitLoss = priceChangePips * pipValue;

  // Calculate ROI if we had capital info (simplified)
  const sentiment = profitLoss > 0 ? 'positive' : profitLoss < 0 ? 'negative' : 'neutral';

  return [
    {
      id: 'profitLoss',
      label: 'Ganancia/Pérdida',
      value: profitLoss,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      highlight: true,
      sentiment,
      tooltip: profitLoss > 0 ? 'Ganancia obtenida' : 'Pérdida incurrida',
    },
    {
      id: 'pips',
      label: 'Movimiento en Pips',
      value: priceChangePips,
      unit: 'pips',
      format: 'number',
      decimals: 1,
      sentiment,
    },
    {
      id: 'pipValue',
      label: 'Valor del Pip',
      value: pipValue,
      unit: 'USD',
      format: 'currency',
      decimals: 2,
      sentiment: 'neutral',
    },
  ];
}

export function ProfitLossCalculator() {
  const calculator = useCalculator(config, calculateProfitLoss);
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
          <div className="p-3 rounded-lg bg-teal/5 border border-teal/20 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Tamaño Pip:</span> {calculator.getInputValue('pipSize')}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="lots">{config.inputs[2].label}</Label>
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
            id="lots"
            type="number"
            value={Number(calculator.getInputValue('lots'))}
            onChange={(e) => calculator.updateInput('lots', Number(e.target.value))}
            min={config.inputs[2].min}
            step={config.inputs[2].step}
            className="bg-input border-line/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openPrice">{config.inputs[3].label}</Label>
            <Input
              id="openPrice"
              type="number"
              value={Number(calculator.getInputValue('openPrice'))}
              onChange={(e) => calculator.updateInput('openPrice', Number(e.target.value))}
              min={config.inputs[3].min}
              step={config.inputs[3].step}
              className="bg-input border-line/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closePrice">{config.inputs[4].label}</Label>
            <Input
              id="closePrice"
              type="number"
              value={Number(calculator.getInputValue('closePrice'))}
              onChange={(e) => calculator.updateInput('closePrice', Number(e.target.value))}
              min={config.inputs[4].min}
              step={config.inputs[4].step}
              className="bg-input border-line/50"
            />
          </div>
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
