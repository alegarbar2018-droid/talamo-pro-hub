import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import SizingDemo from "@/components/public/demos/SizingDemo";
import { 
  Zap, Target, CheckCircle, ArrowRight, Users, Calculator, AlertTriangle,
  TrendingUp, DollarSign, Shield, Layers, BookOpen, Copy, Settings,
  BarChart3, PieChart, Activity, Clock, Bookmark, ExternalLink,
  Info, ChevronRight, Sparkles, Globe, Coins, CandlestickChart
} from "lucide-react";

export default function ToolsInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();
  const [activeTab, setActiveTab] = useState("calculators");

  useEffect(() => {
    document.title = "Herramientas — Información";
    trackPageView("tools-info");
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 md:w-[500px] md:h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 md:pt-20 pb-12 md:pb-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-surface/90 backdrop-blur-xl border border-primary/20 text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-6 md:mb-8"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Herramientas Profesionales
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 px-2"
              >
                <span className="text-white">Menos errores.</span>
                <br />
                <span className="text-primary">Mejor ejecución.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed px-4"
              >
                Calculadoras y utilidades que convierten criterios en números y límites reales.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate("/access")}
                  className="bg-gradient-primary hover:shadow-glow text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto rounded-2xl group w-full sm:w-auto"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Validar afiliación
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  onClick={() => navigate("/tools")}
                  className="border-2 border-primary/30 bg-surface/50 backdrop-blur-xl text-primary hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto rounded-2xl w-full sm:w-auto"
                >
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Explorar calculadoras
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Main Content Hub */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
          
          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-6 md:mb-8 px-4">
                <div className="bg-surface/90 backdrop-blur-xl border border-primary/30 p-2 rounded-2xl overflow-hidden">
                  <TabsList className="bg-transparent p-0 h-auto grid grid-cols-2 lg:grid-cols-4 gap-2 w-full min-w-0">
                    <TabsTrigger 
                      value="calculators" 
                      className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow text-muted-foreground bg-transparent rounded-xl px-3 py-3 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 min-w-0 whitespace-nowrap"
                    >
                      <Calculator className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden md:inline">Calculadoras</span>
                      <span className="md:hidden">Calc</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="contracts" 
                      className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow text-muted-foreground bg-transparent rounded-xl px-3 py-3 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 min-w-0 whitespace-nowrap"
                    >
                      <CandlestickChart className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden md:inline">Contratos</span>
                      <span className="md:hidden">Cont</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="formulas" 
                      className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow text-muted-foreground bg-transparent rounded-xl px-3 py-3 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 min-w-0 whitespace-nowrap"
                    >
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden md:inline">Fórmulas</span>
                      <span className="md:hidden">Form</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="features" 
                      className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow text-muted-foreground bg-transparent rounded-xl px-3 py-3 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 min-w-0 whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden md:inline">Extras</span>
                      <span className="md:hidden">Ext</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Calculadoras Principales Tab */}
              <TabsContent value="calculators" className="space-y-6 md:space-y-8">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Calculadoras Profesionales</h2>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto px-4">
                    Suite completa de herramientas para gestión de riesgo, costos y análisis de operaciones
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { 
                      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Tamaño de Posición", 
                      desc: "Cálculo de lotes/volumen según riesgo y SL",
                      color: "from-blue-500/20 to-cyan-500/20",
                      textColor: "text-blue-400"
                    },
                    { 
                      icon: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Valor del Pip", 
                      desc: "En moneda de la cuenta para cualquier par",
                      color: "from-green-500/20 to-emerald-500/20",
                      textColor: "text-green-400"
                    },
                    { 
                      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Margen & Nivel", 
                      desc: "Margen usado, libre y nivel de margen",
                      color: "from-purple-500/20 to-violet-500/20",
                      textColor: "text-purple-400"
                    },
                    { 
                      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "TP/SL a Precio", 
                      desc: "Desde porcentaje o pips a precio exacto",
                      color: "from-orange-500/20 to-red-500/20",
                      textColor: "text-orange-400"
                    },
                    { 
                      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "P&L Calculator", 
                      desc: "Pérdida/Ganancia en tiempo real",
                      color: "from-teal-500/20 to-cyan-500/20",
                      textColor: "text-teal-400"
                    },
                    { 
                      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Risk/Reward", 
                      desc: "Ratio riesgo/beneficio y expectativa",
                      color: "from-pink-500/20 to-rose-500/20",
                      textColor: "text-pink-400"
                    },
                    { 
                      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Costo de Spread", 
                      desc: "Impacto del spread en tu operación",
                      color: "from-indigo-500/20 to-blue-500/20",
                      textColor: "text-indigo-400"
                    },
                    { 
                      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Swap Calculator", 
                      desc: "Financing/rollover para posiciones overnight",
                      color: "from-yellow-500/20 to-amber-500/20",
                      textColor: "text-yellow-400"
                    },
                    { 
                      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />, 
                      title: "Slippage Rule", 
                      desc: "Ejecución según rango de mercado",
                      color: "from-slate-500/20 to-gray-500/20",
                      textColor: "text-slate-400"
                    }
                  ].map((calc, index) => (
                    <motion.div
                      key={calc.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-4 sm:p-6 group hover:border-primary/40 hover:shadow-glow transition-all duration-300">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${calc.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                          <div className={calc.textColor}>{calc.icon}</div>
                        </div>
                        <h3 className="font-bold text-white mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                          {calc.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {calc.desc}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pro Features */}
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-xl border-primary/30 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Versión Pro</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">Funciones avanzadas para traders profesionales</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex items-center gap-3">
                      <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Exposición y Correlación</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Comisiones/Bonos (educativo)</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Especificaciones de Contrato Tab */}
              <TabsContent value="contracts" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">Fichas Técnicas por Activo</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Especificaciones completas de cada instrumento para que sepas exactamente cómo operar sin sorpresas
                  </p>
                </div>

                {/* Context and Purpose */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <Card className="bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-xl border-primary/20 p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                          <Info className="w-6 h-6 text-primary" />
                          ¿Qué son las Fichas Técnicas?
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Cada instrumento financiero tiene características únicas que afectan directamente tus cálculos de riesgo y costos. 
                          Nuestras fichas técnicas centralizan esta información crítica.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Evita errores de cálculo por datos incorrectos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Optimiza tu gestión de riesgo por instrumento</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Conoce costos reales antes de operar</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                          <Target className="w-6 h-6 text-primary" />
                          ¿Para qué las ofrecemos?
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Porque cada pip, cada punto de spread, cada requirement de margen impacta tu rentabilidad. 
                          No dejes nada al azar.
                        </p>
                        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <p className="text-sm text-white font-semibold mb-2">Ejemplo práctico:</p>
                          <p className="text-sm text-muted-foreground">
                            En EURUSD necesitas $10 de margen por microlote, pero en USDJPY son $9. 
                            Esa diferencia puede significar 10% más de apalancamiento disponible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      category: "Forex", 
                      icon: <Globe className="w-8 h-8" />, 
                      pairs: "28 pares mayores",
                      color: "from-blue-500/20 to-cyan-500/20",
                      borderColor: "border-blue-500/30"
                    },
                    { 
                      category: "Metales", 
                      icon: <Coins className="w-8 h-8" />, 
                      pairs: "Oro, Plata, Platino",
                      color: "from-yellow-500/20 to-amber-500/20",
                      borderColor: "border-yellow-500/30"
                    },
                    { 
                      category: "Índices", 
                      icon: <BarChart3 className="w-8 h-8" />, 
                      pairs: "US30, NAS100, SPX500",
                      color: "from-purple-500/20 to-violet-500/20",
                      borderColor: "border-purple-500/30"
                    },
                    { 
                      category: "Crypto", 
                      icon: <Activity className="w-8 h-8" />, 
                      pairs: "BTC, ETH, Top altcoins",
                      color: "from-orange-500/20 to-red-500/20",
                      borderColor: "border-orange-500/30"
                    }
                  ].map((asset, index) => (
                    <motion.div
                      key={asset.category}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`bg-surface/50 backdrop-blur-xl ${asset.borderColor} border-2 p-6 group hover:shadow-glow transition-all duration-300`}>
                        <div className={`w-16 h-16 bg-gradient-to-br ${asset.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                          <div className="text-white">{asset.icon}</div>
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">
                          {asset.category}
                        </h3>
                        <p className="text-muted-foreground text-sm text-center">
                          {asset.pairs}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Contract Details */}
                <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Datos incluidos por instrumento:</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      "Contract Size", "Pip/Tick Value", "Lotaje Min/Step", 
                      "Horarios de Trading", "Apalancamiento Máx", "Margen Requerido",
                      "Swaps Long/Short", "Spread Promedio", "Distancia Mín Stop"
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Glosario de Fórmulas Tab */}
              <TabsContent value="formulas" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">Calculadora de Fórmulas</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Todas las fórmulas que necesitas con nombres claros, ejemplos prácticos y casos de uso
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      category: "🎯 Gestión de Riesgo",
                      description: "Fórmulas esenciales para controlar tu exposición",
                      formulas: [
                        { 
                          name: "¿Cuántos lotes comprar?", 
                          formula: "Lotes = (Capital × % Riesgo) ÷ (Stop Loss en pips × Valor del pip)",
                          example: "Ejemplo: $10,000 × 2% ÷ (20 pips × $10) = 1 lote",
                          explanation: "Determina el tamaño exacto de tu posición basado en cuánto estás dispuesto a perder"
                        },
                        { 
                          name: "¿Cuánto dinero arriesgo?", 
                          formula: "Dinero en riesgo = Capital × Porcentaje de riesgo ÷ 100",
                          example: "Ejemplo: $10,000 × 2% ÷ 100 = $200",
                          explanation: "Calcula la cantidad exacta en dólares que pondrás en riesgo"
                        },
                        { 
                          name: "¿Vale la pena la operación?", 
                          formula: "Ratio R:R = (Take Profit - Entrada) ÷ (Entrada - Stop Loss)",
                          example: "Ejemplo: (1.2100 - 1.2000) ÷ (1.2000 - 1.1980) = 5:1",
                          explanation: "Evalúa si la recompensa potencial justifica el riesgo asumido"
                        }
                      ]
                    },
                    {
                      category: "💰 Ganancias y Pérdidas",
                      description: "Calcula tus resultados en tiempo real",
                      formulas: [
                        { 
                          name: "¿Cuánto gané/perdí en Forex?", 
                          formula: "P&L = (Precio de cierre - Precio de apertura) × Tamaño del lote × Valor del pip",
                          example: "Ejemplo: (1.2100 - 1.2000) × 1 lote × $10 = $1,000",
                          explanation: "Calcula tu ganancia o pérdida exacta en pares de divisas"
                        },
                        { 
                          name: "¿Cuánto gané/perdí en Índices?", 
                          formula: "P&L = (Precio de cierre - Precio de apertura) × Tamaño del contrato × Valor del tick",
                          example: "Ejemplo: (15,500 - 15,000) × 1 × $5 = $2,500",
                          explanation: "Calcula resultados en índices como SPX500, NAS100, etc."
                        },
                        { 
                          name: "¿Qué porcentaje gané?", 
                          formula: "% Ganancia = (P&L ÷ Inversión inicial) × 100",
                          example: "Ejemplo: ($500 ÷ $10,000) × 100 = 5%",
                          explanation: "Convierte tu ganancia en dólares a porcentaje de tu cuenta"
                        }
                      ]
                    },
                    {
                      category: "🏦 Margen y Apalancamiento",
                      description: "Controla tu capacidad de compra",
                      formulas: [
                        { 
                          name: "¿Cuánto margen necesito?", 
                          formula: "Margen requerido = (Lotes × Tamaño del contrato) ÷ Apalancamiento",
                          example: "Ejemplo: (1 × $100,000) ÷ 100 = $1,000",
                          explanation: "Calcula cuánto dinero necesitas para abrir una posición"
                        },
                        { 
                          name: "¿Qué tan segura está mi cuenta?", 
                          formula: "Nivel de margen = (Patrimonio ÷ Margen usado) × 100",
                          example: "Ejemplo: ($12,000 ÷ $8,000) × 100 = 150%",
                          explanation: "Mide qué tan cerca estás del margin call (peligro bajo 100%)"
                        },
                        { 
                          name: "¿Cuánto puedo operar aún?", 
                          formula: "Margen libre = Patrimonio - Margen usado",
                          example: "Ejemplo: $12,000 - $8,000 = $4,000",
                          explanation: "Dinero disponible para abrir nuevas posiciones"
                        }
                      ]
                    },
                    {
                      category: "💸 Costos de Operación",
                      description: "Conoce el costo real de cada trade",
                      formulas: [
                        { 
                          name: "¿Cuánto me cuesta el spread?", 
                          formula: "Costo del spread = Spread en pips × Tamaño del lote × Valor del pip",
                          example: "Ejemplo: 2 pips × 1 lote × $10 = $20",
                          explanation: "El costo inmediato al abrir cualquier posición"
                        },
                        { 
                          name: "¿Cuánto pago por mantener la posición?", 
                          formula: "Swap = Tamaño del lote × Tamaño del contrato × Puntos swap × Días",
                          example: "Ejemplo: 1 × $100,000 × 0.5 × 1 = $50",
                          explanation: "Costo o ganancia por mantener posiciones abiertas overnight"
                        },
                        { 
                          name: "¿Cuánto es la comisión total?", 
                          formula: "Comisión = Tamaño del lote × Tarifa por lote",
                          example: "Ejemplo: 1 lote × $3.5 = $3.5 por lado",
                          explanation: "Comisiones fijas que cobra tu broker por operación"
                        }
                      ]
                    }
                  ].map((section, sectionIndex) => (
                    <motion.div
                      key={section.category}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.1 }}
                    >
                      <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-primary/20">
                          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            {section.category}
                          </h3>
                          <p className="text-muted-foreground">{section.description}</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                          {section.formulas.map((formula, index) => (
                            <motion.div 
                              key={formula.name} 
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group"
                            >
                              <div className="bg-gradient-to-r from-muted/5 to-primary/5 rounded-xl p-6 border border-muted/20 group-hover:border-primary/30 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                    {formula.name}
                                  </h4>
                                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                                    Ver en Academia
                                  </Badge>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="bg-muted/10 rounded-lg p-4 border border-muted/20">
                                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Fórmula:</p>
                                    <code className="text-sm text-primary font-mono bg-primary/10 px-3 py-2 rounded-md block">
                                      {formula.formula}
                                    </code>
                                  </div>
                                  
                                  <div className="bg-teal/5 rounded-lg p-4 border border-teal/20">
                                    <p className="text-xs text-teal-400 mb-2 uppercase tracking-wider">Ejemplo práctico:</p>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {formula.example}
                                    </p>
                                  </div>
                                  
                                  <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                                    <p className="text-xs text-accent mb-2 uppercase tracking-wider">Para qué sirve:</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formula.explanation}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/20">
                                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Calculadora integrada disponible</span>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Extras de UX Tab */}
              <TabsContent value="features" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">Funciones Premium</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Herramientas adicionales para maximizar tu productividad
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Presets Inteligentes",
                      description: "Guarda configuraciones por estrategia y símbolo para acceso rápido",
                      icon: <Bookmark className="w-6 h-6" />,
                      features: ["Presets por par de divisas", "Configuraciones de estrategia", "Acceso con un clic"]
                    },
                    {
                      title: "Exportar Resultados",
                      description: "Copia resultados al clipboard o exporta a diferentes formatos",
                      icon: <Copy className="w-6 h-6" />,
                      features: ["Copiar al clipboard", "Exportar a Excel", "Compartir configuración"]
                    },
                    {
                      title: "Integración Journal",
                      description: "Registra setup completo directamente en tu journal de trading",
                      icon: <Settings className="w-6 h-6" />,
                      features: ["Registro automático", "Tags personalizados", "Análisis de performance"]
                    },
                    {
                      title: "Links a Academia",
                      description: "Cada concepto enlazado con lecciones detalladas en la Academia",
                      icon: <ExternalLink className="w-6 h-6" />,
                      features: ["Conceptos enlazados", "Video tutoriales", "Ejemplos prácticos"]
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 hover:shadow-glow transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <div className="text-white">{feature.icon}</div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          {feature.features.map((item) => (
                            <div key={item} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Demo Interactivo</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Prueba la calculadora de position sizing para ver cómo determinar el tamaño exacto de tus operaciones
              </p>
            </div>
            
            <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8">
              <SizingDemo />
            </Card>
            
            <div className="text-center mt-4">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Fórmula base del sistema completo
              </Badge>
            </div>
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-xl border-primary/30 p-8 text-center">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Hub Completo de Trading</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Todas las calculadoras de riesgo, costos y gestión en un solo lugar. 
                  Fichas técnicas de instrumentos y repositorio de fórmulas, 
                  todo integrado con la Academia y el Journal para una experiencia completa.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30">11 Calculadoras</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">4 Categorías de Activos</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">16+ Fórmulas</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">Integración Completa</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground">
                <b className="text-white">Aviso:</b> Contenido educativo para fines informativos. No constituye asesoría financiera.
              </p>
            </div>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}