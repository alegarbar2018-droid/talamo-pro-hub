import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Wallet, DollarSign, Target, Clock, Scale } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { getSEOConfig } from "@/lib/seo-config";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { CalculatorModal } from "@/components/tools/calculators/CalculatorModal";
import { ToolsOverview } from "@/components/tools/ToolsOverview";
import { ContractSpecifications } from "@/components/tools/specifications";
import { TradingFormulasGuide } from "@/components/tools/TradingFormulasGuide";
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
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const navigate = useNavigate();

  const seoConfig = getSEOConfig('tools', i18n.language);
  const structuredData = getBreadcrumbSchema([
    { name: "Inicio", url: "https://talamo.app/" },
    { name: "Herramientas", url: "https://talamo.app/tools" }
  ]);

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
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalPath="/tools"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="relative border-b border-pink-500/10 bg-gradient-to-br from-pink-950/40 via-background to-rose-950/30 backdrop-blur-xl py-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 backdrop-blur-md border border-pink-500/20 shadow-sm shadow-pink-500/10">
              <Calculator className="h-4 w-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-400">Herramientas Profesionales</span>
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_30px_rgba(244,114,182,0.3)]">
                Herramientas de Trading
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2 font-light">
                Suite completa de calculadoras, especificaciones y análisis profesionales para{" "}
                <span className="text-pink-400 font-semibold">optimizar tu gestión de riesgo</span>
              </p>
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
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <ToolsOverview
              onNavigateToCalculators={() => setActiveTab("calculators")}
              onNavigateToContracts={() => setActiveTab("specifications")}
              onNavigateToFormulas={() => setActiveTab("formulas")}
              onNavigateToJournal={() => navigate("/journal")}
              onNavigateToAudit={() => navigate("/audit")}
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
