import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardNavigation from "@/components/DashboardNavigation";
import { Calculator, ArrowRight, TrendingUp, DollarSign, PieChart, Target, BarChart3, Activity, Zap, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { RiskCalculator } from "@/components/tools/RiskCalculator";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

const Tools = () => {
  const { t } = useTranslation(['tools']);
  const [activeCalculator, setActiveCalculator] = useState("risk-calculator");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

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

  // Use calculatorConfigs from DB or fallback
  const calculators = calculatorConfigs || [
    { id: "risk-calculator", calculator_id: "risk-calculator", name: t('tools:tools.risk_calculator'), icon: "Target", description: "Calcula el tamaño de posición óptimo", category: "Gestión de Riesgo", status: "active" }
  ];

  const filteredCalculators = filterCategory
    ? calculators.filter(calc => calc.category === filterCategory)
    : calculators;

  const categories = Array.from(new Set(calculators.map(c => c.category)));

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Target, Activity, DollarSign, TrendingUp, BarChart3, PieChart, Zap, FileText, Calculator };
    return icons[iconName] || Calculator;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      {/* Hero Section Premium */}
      <div className="relative overflow-hidden border-b border-line/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface to-accent/5" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            {t('tools:back_to_dashboard')}
          </Button>
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Wrench className="h-3 w-3 mr-1" />
              Professional Tools
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('tools:title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('tools:subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 border-r border-line bg-surface/30 min-h-screen sticky top-14 p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Categorías
            </h3>
            <div className="space-y-2">
              <Button
                variant={filterCategory === null ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setFilterCategory(null)}
              >
                Todas
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Calculators Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Calculadoras</h2>
              <Badge variant="outline">{filteredCalculators.length} disponibles</Badge>
            </div>
            
            {calculatorsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {categories.map((category) => {
                  const categoryCalcs = filteredCalculators.filter(c => c.category === category);
                  if (categoryCalcs.length === 0) return null;

                  return (
                    <AccordionItem key={category} value={category} className="border border-line rounded-lg bg-surface/50 px-6">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Calculator className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground">{category}</h3>
                            <p className="text-sm text-muted-foreground">{categoryCalcs.length} calculadora(s)</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="grid grid-cols-1 gap-4">
                          {categoryCalcs.map((calc) => {
                            const Icon = getIconComponent(calc.icon);
                            const isDisabled = calc.status !== "active";
                            
                            return (
                              <Card
                                key={calc.id}
                                className={`group transition-all duration-300 ${
                                  isDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:shadow-lg hover:border-primary/50"
                                }`}
                                onClick={() => !isDisabled && setActiveCalculator(calc.calculator_id)}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 rounded-lg bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <CardTitle className="text-base">{calc.name}</CardTitle>
                                        <CardDescription className="text-sm mt-1">{calc.description}</CardDescription>
                                      </div>
                                    </div>
                                    {isDisabled && (
                                      <Badge variant="secondary">Próximamente</Badge>
                                    )}
                                  </div>
                                </CardHeader>
                              </Card>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}

            {/* Active Calculator Display */}
            {activeCalculator === "risk-calculator" && (
              <div className="mt-8">
                <RiskCalculator />
              </div>
            )}
          </section>

          {/* Contract Specifications Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Especificaciones de Contratos
            </h2>
            
            {contractsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {groupedContracts && Object.entries(groupedContracts).map(([assetClass, items]) => (
                  <AccordionItem key={assetClass} value={assetClass} className="border border-line rounded-lg bg-surface/50 px-6">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{assetClass}</Badge>
                        <span className="text-sm text-muted-foreground">{items.length} contrato(s)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((contract) => (
                          <Card key={contract.id} className="border-line">
                            <CardHeader>
                              <CardTitle className="text-base">{contract.symbol}</CardTitle>
                              <CardDescription>{contract.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-muted-foreground">Contract Size:</span>
                                  <p className="font-medium">{contract.contract_size}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Pip Value:</span>
                                  <p className="font-medium">{contract.pip_value}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Min/Max Lot:</span>
                                  <p className="font-medium">{contract.min_lot} - {contract.max_lot}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Leverage:</span>
                                  <p className="font-medium">1:{contract.leverage_max}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>

          {/* Trading Formulas Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              Biblioteca de Fórmulas
            </h2>
            
            {formulasLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {groupedFormulas && Object.entries(groupedFormulas).map(([category, items]) => (
                  <AccordionItem key={category} value={category} className="border border-line rounded-lg bg-surface/50 px-6">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{category}</Badge>
                        <span className="text-sm text-muted-foreground">{items.length} fórmula(s)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      {items.map((formula) => (
                        <Card key={formula.id} className="border-line">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{formula.name}</CardTitle>
                                <CardDescription className="mt-1">{formula.description}</CardDescription>
                              </div>
                              <Badge variant="secondary">{formula.difficulty}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
                              {formula.formula_plain}
                            </div>
                            {formula.explanation && (
                              <p className="text-sm text-muted-foreground">{formula.explanation}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>

          {/* Trading Disclaimer */}
          <TradingDisclaimer context="tools" variant="compact" showCollapsible={true} />
        </main>
      </div>
    </div>
  );
};

export default Tools;
