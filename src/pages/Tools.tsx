import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardNavigation from "@/components/DashboardNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, FileText, BookOpen, Target } from "lucide-react";
import { ToolsOverview } from "@/components/tools/ToolsOverview";
import { ExplainerCard } from "@/components/tools/ExplainerCard";
import { RiskCalculator } from "@/components/tools/RiskCalculator";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { Skeleton } from "@/components/ui/skeleton";

const Tools = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch calculator configs
  const { data: calculatorConfigs, isLoading: calculatorsLoading } = useQuery({
    queryKey: ["calculator_configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calculator_configs")
        .select("*")
        .eq("status", "active")
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Fetch contracts
  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ["contract_specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contract_specifications")
        .select("*")
        .eq("status", "active")
        .order("asset_class", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Fetch formulas
  const { data: formulas, isLoading: formulasLoading } = useQuery({
    queryKey: ["trading_formulas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_formulas")
        .select("*")
        .eq("status", "published")
        .order("category", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Group calculators by category
  const basicCalculators = calculatorConfigs?.filter(c => c.category === "Básicas") || [];
  const advancedCalculators = calculatorConfigs?.filter(c => c.category !== "Básicas") || [];

  // Group contracts by asset_class
  const groupedContracts = contracts?.reduce((acc, contract) => {
    if (!acc[contract.asset_class]) {
      acc[contract.asset_class] = [];
    }
    acc[contract.asset_class].push(contract);
    return acc;
  }, {} as Record<string, typeof contracts>);

  // Group formulas by category
  const groupedFormulas = formulas?.reduce((acc, formula) => {
    if (!acc[formula.category]) {
      acc[formula.category] = [];
    }
    acc[formula.category].push(formula);
    return acc;
  }, {} as Record<string, typeof formulas>);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Target, Calculator, FileText, BookOpen };
    return icons[iconName] || Calculator;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-line/50 bg-gradient-to-br from-primary/5 via-surface to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Herramientas de Trading
            </h1>
            <p className="text-muted-foreground">
              Calculadoras profesionales, especificaciones técnicas y fórmulas explicadas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculators">Calculadoras</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="formulas">Fórmulas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <ToolsOverview
              onNavigateToCalculators={() => setActiveTab("calculators")}
              onNavigateToContracts={() => setActiveTab("contracts")}
              onNavigateToFormulas={() => setActiveTab("formulas")}
            />
          </TabsContent>

          {/* Calculadoras Tab */}
          <TabsContent value="calculators" className="space-y-8">
            {/* Intro Card */}
            <ExplainerCard
              title="Calculadoras de Trading"
              description="Herramientas para calcular tamaño de posición, riesgo, P&L y más en segundos."
              icon={<Calculator className="h-6 w-6 text-primary" />}
              whenToUse={[
                "Antes de abrir cualquier trade",
                "Para verificar tu exposición total",
                "Al planificar escenarios de drawdown"
              ]}
              whatYouNeed={[
                "Saldo de cuenta actual",
                "% de riesgo por operación",
                "Especificaciones del contrato"
              ]}
              primaryCTA={{
                label: "Comenzar a calcular",
                onClick: () => {}
              }}
              secondaryCTA={{
                label: "Ver en Academia",
                href: "/academy"
              }}
            />

            {/* Básicas */}
            {basicCalculators.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">Calculadoras Básicas</h3>
                  <Badge variant="outline">{basicCalculators.length} disponibles</Badge>
                </div>
                
                {calculatorsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {basicCalculators.map((calc) => {
                      const Icon = getIconComponent(calc.icon);
                      return (
                        <Card key={calc.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-lg bg-primary/10">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle>{calc.name}</CardTitle>
                                <CardDescription>{calc.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button className="w-full">
                              Abrir
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Avanzadas */}
            {advancedCalculators.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">Calculadoras Avanzadas</h3>
                  <Badge variant="secondary">{advancedCalculators.length} disponibles</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {advancedCalculators.map((calc) => {
                    const Icon = getIconComponent(calc.icon);
                    const isComingSoon = calc.status === "coming_soon";
                    
                    return (
                      <Card key={calc.id} className={isComingSoon ? "opacity-60" : "hover:shadow-lg transition-shadow"}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-accent/10">
                              <Icon className="h-6 w-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle>{calc.name}</CardTitle>
                                {isComingSoon && <Badge variant="outline">Próximamente</Badge>}
                              </div>
                              <CardDescription>{calc.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" disabled={isComingSoon}>
                            {isComingSoon ? "Próximamente" : "Abrir"}
                            {!isComingSoon && <ArrowRight className="ml-2 h-4 w-4" />}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Demo: Risk Calculator */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Demo: Calculadora de Riesgo</h3>
              <RiskCalculator />
            </div>
          </TabsContent>

          {/* Contratos Tab */}
          <TabsContent value="contracts" className="space-y-8">
            {/* Intro Card */}
            <ExplainerCard
              title="Especificaciones de Contratos"
              description="La 'cédula técnica' completa de cada símbolo: contract size, pip value, swaps, horarios."
              icon={<FileText className="h-6 w-6 text-primary" />}
              whenToUse={[
                "Al operar un nuevo símbolo por primera vez",
                "Para calcular costos overnight (swaps)",
                "Verificar horarios de trading del instrumento"
              ]}
              whatYouNeed={[
                "Nombre o símbolo del instrumento",
                "Tipo de cuenta (estándar, pro, etc.)"
              ]}
              primaryCTA={{
                label: "Buscar contrato",
                onClick: () => {}
              }}
            />

            {contractsLoading ? (
              <div className="grid gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : groupedContracts && Object.keys(groupedContracts).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedContracts).map(([assetClass, contractList]) => (
                  <div key={assetClass} className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground capitalize">
                      {assetClass}
                      <Badge variant="outline" className="ml-3">{contractList.length}</Badge>
                    </h3>
                    <div className="grid gap-4">
                      {contractList.map((contract) => (
                        <Card key={contract.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="font-mono">{contract.symbol}</CardTitle>
                                <CardDescription>{contract.name}</CardDescription>
                              </div>
                              <Badge variant="default">Activo</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Contract Size:</span>
                              <p className="font-semibold">{contract.contract_size.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Pip Value:</span>
                              <p className="font-semibold">${contract.pip_value}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Min/Max Lot:</span>
                              <p className="font-semibold">{contract.min_lot} - {contract.max_lot}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Leverage:</span>
                              <p className="font-semibold">1:{contract.leverage_max}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay contratos disponibles</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Fórmulas Tab */}
          <TabsContent value="formulas" className="space-y-8">
            {/* Intro Card */}
            <ExplainerCard
              title="Glosario de Fórmulas de Trading"
              description="Definiciones claras con ejemplos prácticos para entender el 'por qué' detrás de cada cálculo."
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              whenToUse={[
                "Para aprender nuevas fórmulas de trading",
                "Al revisar tu estrategia de gestión de riesgo",
                "Cuando necesitas un recordatorio rápido"
              ]}
              whatYouNeed={[
                "Concepto o término que quieres aprender",
                "Tiempo para leer ejemplos y casos de uso"
              ]}
              primaryCTA={{
                label: "Explorar fórmulas",
                onClick: () => {}
              }}
              secondaryCTA={{
                label: "Ver en Academia",
                href: "/academy"
              }}
            />

            {formulasLoading ? (
              <div className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-28" />
                ))}
              </div>
            ) : groupedFormulas && Object.keys(groupedFormulas).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedFormulas).map(([category, formulaList]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground capitalize">
                      {category.replace('_', ' ')}
                      <Badge variant="outline" className="ml-3">{formulaList.length}</Badge>
                    </h3>
                    <div className="grid gap-4">
                      {formulaList.map((formula) => (
                        <Card key={formula.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{formula.name}</CardTitle>
                              <Badge variant="outline" className="capitalize">
                                {formula.difficulty}
                              </Badge>
                            </div>
                            <CardDescription>{formula.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="p-3 bg-muted rounded-lg">
                              <code className="text-sm font-mono">{formula.formula_plain}</code>
                            </div>
                            <p className="text-sm text-muted-foreground">{formula.explanation}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay fórmulas disponibles</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-12">
          <TradingDisclaimer />
        </div>
      </div>
    </div>
  );
};

export default Tools;
