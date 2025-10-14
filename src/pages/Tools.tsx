import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Wallet, DollarSign, Target, Clock, Scale } from "lucide-react";
import { CalculatorModal } from "@/components/tools/calculators/CalculatorModal";
import { ToolsOverview } from "@/components/tools/ToolsOverview";
import { ContractSpecifications } from "@/components/tools/specifications";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import {
  PositionSizeCalculator,
  PipValueCalculator,
  MarginCalculator,
  ProfitLossCalculator,
  TPSLCalculator,
  SwapCalculator,
  RRCalculator,
} from "@/components/tools/calculators";
import { CalculatorCard } from "@/components/tools/calculators/CalculatorCard";

const calculators = [
  {
    id: 'position-size',
    title: 'Calculadora de Tamaño de Posición',
    description: 'Determina el tamaño óptimo de lote basado en tu gestión de riesgo',
    icon: TrendingUp,
    category: 'basic' as const,
    tags: ['Gestión de Riesgo', 'Position Sizing'],
    component: PositionSizeCalculator,
    requiresContractSpec: true,
  },
  {
    id: 'pip-value',
    title: 'Calculadora de Valor del Pip',
    description: 'Calcula cuánto vale cada pip en tu operación',
    icon: DollarSign,
    category: 'basic' as const,
    tags: ['Pip Value', 'Money Management'],
    component: PipValueCalculator,
    requiresContractSpec: true,
  },
  {
    id: 'margin',
    title: 'Calculadora de Margen',
    description: 'Calcula el margen requerido para abrir una posición',
    icon: Wallet,
    category: 'basic' as const,
    tags: ['Margin', 'Leverage'],
    component: MarginCalculator,
    requiresContractSpec: true,
  },
  {
    id: 'profit-loss',
    title: 'Calculadora de P&L',
    description: 'Calcula ganancias o pérdidas de una operación',
    icon: TrendingUp,
    category: 'basic' as const,
    tags: ['P&L', 'Profit', 'Loss'],
    component: ProfitLossCalculator,
    requiresContractSpec: true,
  },
  {
    id: 'tp-sl',
    title: 'Calculadora de TP/SL',
    description: 'Calcula niveles de Take Profit y Stop Loss',
    icon: Target,
    category: 'basic' as const,
    tags: ['TP', 'SL', 'Risk Management'],
    component: TPSLCalculator,
    requiresContractSpec: true,
  },
  {
    id: 'swap',
    title: 'Calculadora de Swap',
    description: 'Calcula el costo de mantener una posición overnight',
    icon: Clock,
    category: 'advanced' as const,
    tags: ['Swap', 'Overnight'],
    component: SwapCalculator,
    requiresContractSpec: true,
  },
  {
    id: 'rr-expectancy',
    title: 'Calculadora de R/R',
    description: 'Analiza la expectativa matemática de tu estrategia',
    icon: Scale,
    category: 'advanced' as const,
    tags: ['Risk/Reward', 'Expectancy'],
    component: RRCalculator,
    requiresContractSpec: false,
  },
];

const Tools = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  // Handle deep linking from URL
  useEffect(() => {
    const calcId = searchParams.get('calc');
    if (calcId && calculators.some(c => c.id === calcId)) {
      setSelectedCalculator(calcId);
      setActiveTab('calculators');
    }
  }, [searchParams]);

  const openCalculator = (calcId: string) => {
    setSelectedCalculator(calcId);
    setSearchParams({ calc: calcId });
  };

  const closeCalculator = () => {
    setSelectedCalculator(null);
    searchParams.delete('calc');
    setSearchParams(searchParams);
  };

  const selectedCalc = calculators.find(c => c.id === selectedCalculator);
  const basicCalculators = calculators.filter(c => c.category === 'basic');
  const advancedCalculators = calculators.filter(c => c.category === 'advanced');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-line/50 bg-gradient-to-br from-teal/5 via-surface to-teal/5">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-surface/50"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Dashboard
          </Button>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/30">
                <Calculator className="w-8 h-8 text-teal" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Herramientas de Trading
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Calculadoras profesionales para optimizar tu gestión de riesgo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-surface/50 border border-line/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal">
              Overview
            </TabsTrigger>
            <TabsTrigger value="calculators" className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal">
              Calculadoras
            </TabsTrigger>
            <TabsTrigger value="specifications" className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal">
              Especificaciones
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <ToolsOverview
              onNavigateToCalculators={() => setActiveTab("calculators")}
              onNavigateToContracts={() => {}}
              onNavigateToFormulas={() => {}}
            />
          </TabsContent>

          {/* Calculadoras Tab */}
          <TabsContent value="calculators" className="space-y-12">
            {/* Calculadoras Básicas */}
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Calculadoras Básicas
                </h2>
                <p className="text-muted-foreground">
                  Herramientas esenciales para gestión de riesgo y position sizing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {basicCalculators.map((calc) => (
                  <CalculatorCard
                    key={calc.id}
                    title={calc.title}
                    description={calc.description}
                    icon={calc.icon}
                    category={calc.category}
                    requiresContractSpec={calc.requiresContractSpec}
                    tags={calc.tags}
                    onOpen={() => openCalculator(calc.id)}
                  />
                ))}
              </div>
            </section>

            {/* Calculadoras Avanzadas */}
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Calculadoras Avanzadas
                </h2>
                <p className="text-muted-foreground">
                  Análisis profundo de swap, expectativa y optimización de estrategias
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedCalculators.map((calc) => (
                  <CalculatorCard
                    key={calc.id}
                    title={calc.title}
                    description={calc.description}
                    icon={calc.icon}
                    category={calc.category}
                    requiresContractSpec={calc.requiresContractSpec}
                    tags={calc.tags}
                    onOpen={() => openCalculator(calc.id)}
                  />
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Especificaciones Tab */}
          <TabsContent value="specifications" className="space-y-6">
            <ContractSpecifications />
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-12">
          <TradingDisclaimer />
        </div>
      </div>

      {/* Calculator Modal */}
      {selectedCalc && (
        <CalculatorModal
          isOpen={!!selectedCalculator}
          onClose={closeCalculator}
          calculatorId={selectedCalc.id}
        >
          <selectedCalc.component />
        </CalculatorModal>
      )}
    </div>
  );
};

export default Tools;
