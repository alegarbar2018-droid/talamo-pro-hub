import { useState } from "react";
import { ArrowLeft, Calculator, TrendingUp, Shield, DollarSign, PieChart, Activity, Target, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskCalculator } from "@/components/tools/RiskCalculator";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import Navigation from "@/components/Navigation";

export default function Tools() {
  const [activeTab, setActiveTab] = useState("risk-calculator");

  const calculators = [
    {
      id: "risk-calculator",
      name: "Calculadora de Riesgo",
      icon: Calculator,
      description: "Determina el tamaño óptimo de posición según tu riesgo",
      category: "risk",
    },
    {
      id: "pip-calculator",
      name: "Calculadora de Pips",
      icon: TrendingUp,
      description: "Calcula el valor monetario de los pips",
      category: "risk",
      disabled: true,
    },
    {
      id: "margin-calculator",
      name: "Calculadora de Margen",
      icon: Shield,
      description: "Calcula el margen requerido para tu operación",
      category: "risk",
      disabled: true,
    },
    {
      id: "profit-loss",
      name: "Calculadora P/L",
      icon: DollarSign,
      description: "Calcula ganancias y pérdidas potenciales",
      category: "analysis",
      disabled: true,
    },
    {
      id: "position-sizing",
      name: "Tamaño de Posición",
      icon: PieChart,
      description: "Calcula tamaño óptimo basado en múltiples factores",
      category: "analysis",
      disabled: true,
    },
    {
      id: "compound-growth",
      name: "Crecimiento Compuesto",
      icon: Activity,
      description: "Proyecta el crecimiento de tu cuenta",
      category: "planning",
      disabled: true,
    },
    {
      id: "risk-reward",
      name: "Riesgo/Beneficio",
      icon: Target,
      description: "Calcula la relación riesgo-beneficio",
      category: "planning",
      disabled: true,
    },
    {
      id: "break-even",
      name: "Punto de Equilibrio",
      icon: BarChart3,
      description: "Calcula el win rate necesario para break-even",
      category: "advanced",
      disabled: true,
    },
    {
      id: "kelly-criterion",
      name: "Criterio de Kelly",
      icon: Zap,
      description: "Optimiza el tamaño de posición según probabilidades",
      category: "advanced",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Premium */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-surface via-background to-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-8 hover:bg-surface/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal via-cyan to-teal bg-clip-text text-transparent">
              Herramientas de Trading
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Suite profesional de calculadoras para optimizar tus operaciones
            </p>
            
            <div className="flex gap-4">
              <Card className="flex-1 bg-surface/50 backdrop-blur-sm border-line/50">
                <CardContent className="pt-6 text-center">
                  <Calculator className="w-8 h-8 mx-auto mb-2 text-teal" />
                  <p className="text-2xl font-bold">{calculators.length}</p>
                  <p className="text-sm text-muted-foreground">Calculadoras</p>
                </CardContent>
              </Card>
              
              <Card className="flex-1 bg-surface/50 backdrop-blur-sm border-line/50">
                <CardContent className="pt-6 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-cyan" />
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Precisión</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Grid & Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Calculator Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              const isActive = activeTab === calc.id;
              
              return (
                <Card
                  key={calc.id}
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    calc.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : isActive
                      ? 'border-teal bg-gradient-to-br from-teal/10 to-cyan/10'
                      : 'border-line hover:border-teal/50 hover:bg-surface/50'
                  }`}
                  onClick={() => !calc.disabled && setActiveTab(calc.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        isActive ? 'bg-gradient-to-br from-teal to-cyan' : 'bg-surface'
                      }`}>
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{calc.name}</CardTitle>
                        {calc.disabled && (
                          <span className="text-xs text-muted-foreground">Próximamente</span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="mt-2">{calc.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Calculator Content */}
          <Card className="border-line bg-surface/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                {calculators.find(c => c.id === activeTab)?.name}
              </CardTitle>
              <CardDescription>
                {calculators.find(c => c.id === activeTab)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="risk-calculator" className="mt-0">
                <RiskCalculator />
              </TabsContent>
              
              {calculators.filter(c => c.disabled).map(calc => (
                <TabsContent key={calc.id} value={calc.id} className="mt-0">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Esta calculadora estará disponible próximamente
                    </p>
                  </div>
                </TabsContent>
              ))}
            </CardContent>
          </Card>
        </Tabs>

        <div className="mt-12">
          <TradingDisclaimer />
        </div>
      </section>
    </div>
  );
}