import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Wallet, DollarSign, Target, Clock, Scale } from "lucide-react";
import { CalculatorModal } from "@/components/tools/calculators/CalculatorModal";
import { ToolsOverview } from "@/components/tools/ToolsOverview";
import { ContractSpecifications } from "@/components/tools/specifications";
import { TradingFormulasGuide } from "@/components/tools/TradingFormulasGuide";
import { TradingJournal } from "@/components/tools/TradingJournal";
import { AuditDashboard } from "@/components/tools/audit";
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
  const navigate = useNavigate();

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
      <div className="relative overflow-hidden border-b border-line/50 bg-gradient-to-br from-background via-teal/5 to-primary/5">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-8 hover:bg-surface/80 backdrop-blur-sm group"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Button>
          
          <div className="space-y-6 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/20 via-teal/10 to-transparent border border-teal/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-sm font-medium text-teal">Herramientas Profesionales</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Herramientas de Trading
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-3xl">
                Suite completa de calculadoras, especificaciones y análisis profesionales para{" "}
                <span className="text-teal font-medium">optimizar tu gestión de riesgo</span>
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-line/50">
                <Calculator className="w-4 h-4 text-teal" />
                <span className="text-sm text-muted-foreground">7 Calculadoras</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-line/50">
                <TrendingUp className="w-4 h-4 text-teal" />
                <span className="text-sm text-muted-foreground">Análisis en Tiempo Real</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-line/50">
                <Target className="w-4 h-4 text-teal" />
                <span className="text-sm text-muted-foreground">Precisión Profesional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center mb-8 overflow-x-auto px-4">
            <TabsList className="bg-gradient-to-br from-surface via-surface/95 to-surface/90 backdrop-blur-sm border border-line/50 shadow-lg p-1.5 rounded-xl inline-flex gap-1 flex-nowrap min-w-min">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal/20 data-[state=active]:to-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-md rounded-lg px-3 sm:px-4 py-2 font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="calculators" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal/20 data-[state=active]:to-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-md rounded-lg px-3 sm:px-4 py-2 font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Calculadoras
              </TabsTrigger>
              <TabsTrigger 
                value="formulas" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal/20 data-[state=active]:to-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-md rounded-lg px-3 sm:px-4 py-2 font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Fórmulas
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal/20 data-[state=active]:to-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-md rounded-lg px-3 sm:px-4 py-2 font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Especificaciones
              </TabsTrigger>
              <TabsTrigger 
                value="journal" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal/20 data-[state=active]:to-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-md rounded-lg px-3 sm:px-4 py-2 font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Journal
              </TabsTrigger>
              <TabsTrigger 
                value="audit" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal/20 data-[state=active]:to-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-md rounded-lg px-3 sm:px-4 py-2 font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Audit
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <ToolsOverview
              onNavigateToCalculators={() => setActiveTab("calculators")}
              onNavigateToContracts={() => setActiveTab("specifications")}
              onNavigateToFormulas={() => setActiveTab("formulas")}
              onNavigateToJournal={() => setActiveTab("journal")}
              onNavigateToAudit={() => setActiveTab("audit")}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

          {/* Fórmulas Tab */}
          <TabsContent value="formulas" className="space-y-6">
            <TradingFormulasGuide />
          </TabsContent>

          {/* Especificaciones Tab */}
          <TabsContent value="specifications" className="space-y-6">
            <ContractSpecifications />
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <TradingJournal />
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <AuditDashboard />
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
