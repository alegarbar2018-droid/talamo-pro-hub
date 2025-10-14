import { useState, useEffect } from "react";
import { Target } from "lucide-react";
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
  id: 'tp-sl',
  title: 'Calculadora de TP/SL',
  description: 'Calcula los niveles de Take Profit y Stop Loss',
  category: 'basic',
  icon: Target,
  tags: ['TP', 'SL', 'Risk Management'],
  requiresContractSpec: true,
  inputs: [
    {
      id: 'orderType',
      label: 'Tipo de Orden',
      type: 'select',
      tooltip: 'BUY si vas a comprar, SELL si vas a vender',
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
      tooltip: 'Instrumento que vas a tradear',
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
      label: 'Precio de Entrada',
      type: 'number',
      tooltip: 'Precio al que planeas entrar',
      min: 0,
      step: 0.00001,
      defaultValue: 1.1000,
      required: true,
    },
    {
      id: 'targetProfit',
      label: 'Ganancia Objetivo',
      type: 'number',
      unit: 'USD',
      tooltip: 'Cuánto quieres ganar en esta operación',
      min: 1,
      defaultValue: 100,
      required: true,
    },
    {
      id: 'maxLoss',
      label: 'Pérdida Máxima',
      type: 'number',
      unit: 'USD',
      tooltip: 'Cuánto estás dispuesto a perder',
      min: 1,
      defaultValue: 50,
      required: true,
    },
  ],
  formula: {
    title: 'Cálculo de TP/SL',
    description: 'Determina los precios exactos para tus niveles de TP y SL',
    steps: [
      {
        step: 1,
        description: 'Calcular cambio de precio necesario',
        formula: 'Cambio Precio = (Ganancia/Pérdida ÷ Valor Pip) × Tamaño Pip',
        variables: {
          'Ganancia/Pérdida': 'Objetivo en $',
          'Valor Pip': 'Valor de 1 pip',
          'Tamaño Pip': '0.0001 o 0.01',
        },
        example: '$100 objetivo ÷ $10/pip = 10 pips × 0.0001 = 0.0010',
      },
      {
        step: 2,
        description: 'Calcular precios de TP/SL',
        formula: 'BUY:\n  TP = Precio Entrada + Cambio\n  SL = Precio Entrada - Cambio\nSELL:\n  TP = Precio Entrada - Cambio\n  SL = Precio Entrada + Cambio',
        example: 'BUY 1.1000:\n  TP = 1.1000 + 0.0010 = 1.1010\n  SL = 1.1000 - 0.0005 = 1.0995',
      },
    ],
    references: ['TP/SL', 'Risk Management'],
  },
};

function calculateTPSL(inputs: Record<string, number | string | boolean>): CalculatorResult[] {
  const orderType = String(inputs.orderType);
  const lots = Number(inputs.lots);
  const openPrice = Number(inputs.openPrice);
  const targetProfit = Number(inputs.targetProfit);
  const maxLoss = Number(inputs.maxLoss);
  const contractSize = Number(inputs.contractSize) || 100000;
  const pipSize = Number(inputs.pipSize) || 0.0001;

  // Calculate pip value
  const pipValue = lots * contractSize * pipSize;

  // Step 1: Calculate price change for TP and SL
  const tpPriceChange = (targetProfit / pipValue) * pipSize;
  const slPriceChange = (maxLoss / pipValue) * pipSize;

  // Step 2: Calculate TP and SL prices
  let tpPrice: number;
  let slPrice: number;

  if (orderType === 'buy') {
    tpPrice = openPrice + tpPriceChange;
    slPrice = openPrice - slPriceChange;
  } else {
    tpPrice = openPrice - tpPriceChange;
    slPrice = openPrice + slPriceChange;
  }

  // Calculate R/R ratio
  const rrRatio = targetProfit / maxLoss;

  return [
    {
      id: 'tpPrice',
      label: 'Precio Take Profit',
      value: tpPrice,
      format: 'number',
      decimals: 5,
      highlight: true,
      sentiment: 'positive',
      tooltip: 'Precio al que cerrarás con ganancia objetivo',
    },
    {
      id: 'slPrice',
      label: 'Precio Stop Loss',
      value: slPrice,
      format: 'number',
      decimals: 5,
      sentiment: 'negative',
      tooltip: 'Precio al que cerrarás para limitar pérdida',
    },
    {
      id: 'rrRatio',
      label: 'Ratio Riesgo/Recompensa',
      value: rrRatio,
      format: 'number',
      decimals: 2,
      sentiment: rrRatio >= 2 ? 'positive' : rrRatio >= 1.5 ? 'neutral' : 'warning',
      tooltip: rrRatio >= 2 ? 'Excelente R/R' : rrRatio >= 1.5 ? 'R/R aceptable' : 'Considera aumentar tu R/R',
    },
  ];
}

export function TPSLCalculator() {
  const calculator = useCalculator(config, calculateTPSL);
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="targetProfit">{config.inputs[4].label}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{config.inputs[4].tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="targetProfit"
              type="number"
              value={Number(calculator.getInputValue('targetProfit'))}
              onChange={(e) => calculator.updateInput('targetProfit', Number(e.target.value))}
              min={config.inputs[4].min}
              className="bg-input border-line/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="maxLoss">{config.inputs[5].label}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{config.inputs[5].tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="maxLoss"
              type="number"
              value={Number(calculator.getInputValue('maxLoss'))}
              onChange={(e) => calculator.updateInput('maxLoss', Number(e.target.value))}
              min={config.inputs[5].min}
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
