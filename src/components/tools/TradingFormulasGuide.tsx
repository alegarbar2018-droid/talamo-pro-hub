import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Calculator,
  Target,
  DollarSign,
  Percent,
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  Calendar,
  TrendingUp,
  Activity,
  Info,
  Lightbulb,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Gauge,
  Shield,
  Zap,
  BookOpen,
} from "lucide-react";

export function TradingFormulasGuide() {
  return (
    <TooltipProvider>
      <div className="space-y-12 pb-12">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Guía Educativa Profesional</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fórmulas y Especificaciones de Trading
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Aprende visualmente las fórmulas esenciales, tamaños de contrato y cálculos que todo trader necesita dominar
          </p>
        </div>

        {/* Pip Size and Point Size - Visual Cards */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Pip Size y Point Size</h3>
              <p className="text-sm text-muted-foreground">La base de todos los cálculos de trading</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/10 p-6 rounded-xl border border-primary/20 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">¿Qué es un Pip?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Un <span className="font-bold text-primary">pip</span> (percentage in point) es la unidad de medida más pequeña del movimiento de precio en trading. 
                  Es como los "centavos" del trading - te ayuda a medir cuánto ganas o pierdes en cada operación.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Currencies */}
            <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-500 hover:bg-blue-600">Standard</Badge>
                <Coins className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="font-bold text-lg mb-4">Pares de Divisas</h4>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Ejemplo de Precio:</p>
                  <p className="font-mono text-2xl font-bold text-center">1.21568</p>
                  <p className="text-xs text-center text-muted-foreground mt-1">EUR/USD</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm font-medium">Pip (4° decimal):</span>
                    <span className="font-mono font-bold text-primary text-lg">0.0001</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Point (5° decimal):</span>
                    <span className="font-mono text-muted-foreground">0.00001</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <Info className="w-3 h-3 inline mr-1" />
                    La mayoría de pares de divisas usan este formato
                  </p>
                </div>
              </div>
            </Card>

            {/* JPY and Metals */}
            <Card className="p-6 border-2 hover:border-amber-500/50 transition-all hover:shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">JPY & Metales</Badge>
                <Coins className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="font-bold text-lg mb-4">Yen y Oro/Plata</h4>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Ejemplo de Precio:</p>
                  <p className="font-mono text-2xl font-bold text-center">113.115</p>
                  <p className="text-xs text-center text-muted-foreground mt-1">USD/JPY o XAU/USD</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg">
                    <span className="text-sm font-medium">Pip (2° decimal):</span>
                    <span className="font-mono font-bold text-amber-600 text-lg">0.01</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Point (3° decimal):</span>
                    <span className="font-mono text-muted-foreground">0.001</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <Info className="w-3 h-3 inline mr-1" />
                    Incluye USDJPY, XAUUSD (oro), XAGUSD (plata)
                  </p>
                </div>
              </div>
            </Card>

            {/* Cryptocurrencies */}
            <Card className="p-6 border-2 hover:border-purple-500/50 transition-all hover:shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-purple-500 hover:bg-purple-600">Crypto</Badge>
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <h4 className="font-bold text-lg mb-4">Criptomonedas</h4>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Ejemplo de Precio:</p>
                  <p className="font-mono text-2xl font-bold text-center">6845.25</p>
                  <p className="text-xs text-center text-muted-foreground mt-1">BTC/USD</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                    <span className="text-sm font-medium">Pip (1° decimal):</span>
                    <span className="font-mono font-bold text-purple-600 text-lg">0.1</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Point (2° decimal):</span>
                    <span className="font-mono text-muted-foreground">0.01</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <Info className="w-3 h-3 inline mr-1" />
                    Bitcoin, Ethereum, y otras criptomonedas
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Contract Sizes - Visual Grid */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Tamaños de Contrato</h3>
              <p className="text-sm text-muted-foreground">¿Cuánto controlas cuando operas 1 lote?</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/20 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/10 p-6 rounded-xl border border-emerald-500/20 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">¿Por qué es importante?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El <span className="font-bold text-emerald-600">tamaño del contrato</span> determina cuántas unidades del activo estás controlando. 
                  Por ejemplo, 1 lote de EUR/USD = 100,000 euros. Esto afecta directamente cuánto ganas o pierdes por cada pip de movimiento.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Currency Pairs */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <ArrowLeftRight className="w-6 h-6 text-blue-500" />
                <h4 className="font-bold text-lg">Pares de Divisas</h4>
              </div>
              <div className="text-center my-6">
                <p className="text-4xl font-bold font-mono text-blue-600">100,000</p>
                <p className="text-sm text-muted-foreground mt-2">de la divisa base</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <p className="text-xs font-semibold mb-2">Ejemplo:</p>
                <p className="text-sm">1 lote de EUR/USD = <span className="font-bold text-blue-600">100,000 EUR</span></p>
                <p className="text-xs text-muted-foreground mt-2">
                  Sin excepciones - todos los pares usan este estándar
                </p>
              </div>
            </Card>

            {/* Metals */}
            <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-l-4 border-l-amber-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-6 h-6 text-amber-500" />
                <h4 className="font-bold text-lg">Metales</h4>
              </div>
              <div className="space-y-3 my-4">
                <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                  <span className="text-sm font-medium">Oro (XAU)</span>
                  <span className="font-mono font-bold text-amber-600">100 oz</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                  <span className="text-sm font-medium">Plata (XAG)</span>
                  <span className="font-mono font-bold text-amber-600">5,000 oz</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                  <span className="text-sm font-medium">Platino (XPT)</span>
                  <span className="font-mono font-bold text-amber-600">100 oz</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                  <span className="text-sm font-medium">Paladio (XPD)</span>
                  <span className="font-mono font-bold text-amber-600">100 oz</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <Info className="w-3 h-3 inline mr-1" />
                oz = Onzas Troy (31.1 gramos)
              </div>
            </Card>

            {/* Cryptocurrencies */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-transparent border-l-4 border-l-purple-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
                <h4 className="font-bold text-lg">Criptomonedas</h4>
              </div>
              <div className="text-center my-6">
                <p className="text-4xl font-bold font-mono text-purple-600">1</p>
                <p className="text-sm text-muted-foreground mt-2">moneda completa</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                <p className="text-xs font-semibold mb-2">Ejemplo:</p>
                <p className="text-sm">1 lote de BTC/USD = <span className="font-bold text-purple-600">1 Bitcoin</span></p>
                <p className="text-xs text-muted-foreground mt-2">
                  Simple y directo - 1 lote = 1 moneda
                </p>
              </div>
            </Card>

            {/* Indices */}
            <Card className="p-6 bg-gradient-to-br from-teal-500/5 to-transparent border-l-4 border-l-teal-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-teal-500" />
                <h4 className="font-bold text-lg">Índices</h4>
              </div>
              <div className="text-center my-6">
                <p className="text-4xl font-bold font-mono text-teal-600">1</p>
                <p className="text-sm text-muted-foreground mt-2">unidad del índice</p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-lg">
                <p className="text-xs font-semibold mb-2 text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Excepciones importantes:
                </p>
                <div className="space-y-1 text-xs">
                  <p>• US30_x10 → <span className="font-bold">10</span></p>
                  <p>• USTEC_x100 → <span className="font-bold">100</span></p>
                  <p>• US500_x100 → <span className="font-bold">100</span></p>
                </div>
              </div>
            </Card>

            {/* Stocks */}
            <Card className="p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-l-4 border-l-indigo-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-indigo-500" />
                <h4 className="font-bold text-lg">Acciones</h4>
              </div>
              <div className="text-center my-6">
                <p className="text-4xl font-bold font-mono text-indigo-600">100</p>
                <p className="text-sm text-muted-foreground mt-2">acciones</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg">
                <p className="text-xs font-semibold mb-2">Ejemplo:</p>
                <p className="text-sm">1 lote de AAPL = <span className="font-bold text-indigo-600">100 acciones</span> de Apple</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Estándar para todas las acciones
                </p>
              </div>
            </Card>

            {/* Energies */}
            <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-transparent border-l-4 border-l-orange-500 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-6 h-6 text-orange-500" />
                <h4 className="font-bold text-lg">Energías</h4>
              </div>
              <div className="text-center my-6">
                <p className="text-4xl font-bold font-mono text-orange-600">1,000</p>
                <p className="text-sm text-muted-foreground mt-2">barriles (BBL)</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                <p className="text-xs font-semibold mb-2">Ejemplo:</p>
                <p className="text-sm">1 lote de petróleo = <span className="font-bold text-orange-600">1,000 barriles</span></p>
                <p className="text-xs text-muted-foreground mt-2">
                  Incluye WTI, Brent, gas natural
                </p>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Essential Formulas - Interactive Cards */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calculator className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Fórmulas CFD Esenciales</h3>
              <p className="text-sm text-muted-foreground">Las matemáticas detrás de cada operación</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50/50 via-fuchsia-50/30 to-pink-50/20 dark:from-violet-950/20 dark:via-fuchsia-950/10 dark:to-pink-950/10 p-6 rounded-xl border border-violet-500/20 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Domina estos cálculos</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estas fórmulas son la base de la gestión de riesgo profesional. Entiéndelas bien y podrás calcular exactamente 
                  cuánto estás arriesgando, cuánto margen necesitas, y cuál es el valor de cada pip en tus operaciones.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trading Volume */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Volumen de Trading
                </h4>
                <Badge variant="outline" className="bg-blue-500/10">Básico</Badge>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-primary/5 p-5 rounded-lg mb-4 border border-blue-500/20">
                <p className="text-xs text-muted-foreground mb-2">Fórmula:</p>
                <p className="font-mono text-xl font-bold text-center">Lotes × Tamaño del Contrato</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Medida:</span> Divisa base del par</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <p className="font-semibold text-xs mb-2 text-blue-600">Ejemplo Práctico:</p>
                  <p className="text-xs leading-relaxed">
                    Si operas <span className="font-bold">0.5 lotes</span> de EUR/USD:<br />
                    0.5 × 100,000 = <span className="font-bold text-blue-600">50,000 EUR</span><br />
                    <span className="text-muted-foreground">Estás controlando 50 mil euros</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Spread */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-amber-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-amber-500" />
                  Spread
                </h4>
                <Badge variant="outline" className="bg-amber-500/10">Costo</Badge>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-5 rounded-lg mb-4 border border-amber-500/20">
                <p className="text-xs text-muted-foreground mb-2">Fórmula:</p>
                <p className="font-mono text-lg font-bold text-center">(Precio Ask - Precio Bid) / Pip Size</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Medida:</span> Pips</p>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
                  <p className="font-semibold text-xs mb-2 text-amber-600">Ejemplo Práctico:</p>
                  <p className="text-xs leading-relaxed">
                    EUR/USD: Bid 1.1200 / Ask 1.1202<br />
                    (1.1202 - 1.1200) / 0.0001 = <span className="font-bold text-amber-600">2 pips</span><br />
                    <span className="text-muted-foreground">Tu costo de entrada es 2 pips</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Margin */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-red-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Margen Requerido
                </h4>
                <Badge variant="outline" className="bg-red-500/10">Crítico</Badge>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/5 p-5 rounded-lg mb-4 border border-red-500/20">
                <p className="text-xs text-muted-foreground mb-2">Fórmula:</p>
                <p className="font-mono text-lg font-bold text-center">(Lotes × Tamaño) / Apalancamiento</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Percent className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Medida:</span> Divisa base (convertido a tu cuenta)</p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <p className="font-semibold text-xs mb-2 text-red-600">Ejemplo Práctico:</p>
                  <p className="text-xs leading-relaxed">
                    1 lote EUR/USD con apalancamiento 1:100:<br />
                    (1 × 100,000) / 100 = <span className="font-bold text-red-600">1,000 EUR</span><br />
                    <span className="text-muted-foreground">Necesitas 1,000€ como garantía</span>
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded border border-amber-500/30">
                  <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>El margen se convierte automáticamente a la divisa de tu cuenta</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Free Margin */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Margen Libre
                </h4>
                <Badge variant="outline" className="bg-emerald-500/10">Disponible</Badge>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-5 rounded-lg mb-4 border border-emerald-500/20">
                <p className="text-xs text-muted-foreground mb-2">Fórmula:</p>
                <p className="font-mono text-xl font-bold text-center">Equity - Margen</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Coins className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Medida:</span> Divisa de tu cuenta</p>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                  <p className="font-semibold text-xs mb-2 text-emerald-600">Ejemplo Práctico:</p>
                  <p className="text-xs leading-relaxed">
                    Equity = $10,000 | Margen usado = $2,000<br />
                    $10,000 - $2,000 = <span className="font-bold text-emerald-600">$8,000</span><br />
                    <span className="text-muted-foreground">Tienes $8,000 disponibles para operar</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Pip Value */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-purple-500/30 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Valor del Pip
                </h4>
                <Badge variant="outline" className="bg-purple-500/10">Fundamental</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/5 p-5 rounded-lg mb-4 border border-purple-500/20">
                    <p className="text-xs text-muted-foreground mb-2">Fórmula:</p>
                    <p className="font-mono text-lg font-bold text-center">Lotes × Tamaño × Pip Size</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p><span className="font-semibold">Medida:</span> Divisa cotizada (quote currency)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-5 rounded-lg">
                  <p className="font-semibold text-sm mb-3 text-purple-600">Ejemplo Detallado:</p>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">1 lote de EUR/USD:</p>
                    <p className="font-mono text-xs bg-background/50 p-2 rounded">
                      1 × 100,000 × 0.0001 = <span className="font-bold text-purple-600">$10 USD</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Esto significa que por cada pip que el precio se mueva a tu favor (o en contra), 
                      ganarás o perderás <span className="font-bold">$10 USD</span>
                    </p>
                    <div className="mt-4 pt-3 border-t border-purple-500/20">
                      <p className="text-xs font-semibold mb-1">0.5 lotes = $5 por pip</p>
                      <p className="text-xs font-semibold">0.1 lotes = $1 por pip</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Additional Important Formulas */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-500/10 rounded-lg">
              <Gauge className="w-7 h-7 text-violet-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Cálculos Avanzados</h3>
              <p className="text-sm text-muted-foreground">Para traders que quieren el control total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Margin Level */}
            <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-transparent hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="w-6 h-6 text-amber-500" />
                <h4 className="font-bold text-lg">Nivel de Margen</h4>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5 rounded-lg mb-4 border border-amber-500/20">
                <p className="font-mono text-center font-bold text-lg">(Equity / Margen) × 100</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Medida:</span>
                  <span className="font-semibold">Porcentaje (%)</span>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg space-y-2">
                  <p className="text-xs font-semibold text-amber-600">Niveles importantes:</p>
                  <div className="space-y-1 text-xs">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>&gt;200% - Excelente</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>100-200% - Aceptable</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>&lt;100% - ¡Peligro!</span>
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded border border-red-500/30">
                  <p className="text-xs text-red-700 dark:text-red-400 flex items-start gap-1">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Si cae por debajo de 100%, el broker puede cerrar tus posiciones (Margin Call)</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Cost of Spread */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-blue-500" />
                <h4 className="font-bold text-lg">Costo del Spread</h4>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-5 rounded-lg mb-4 border border-blue-500/20">
                <p className="font-mono text-center font-bold text-lg">Spread (pips) × Valor del Pip</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Medida:</span>
                  <span className="font-semibold">Divisa cotizada</span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <p className="text-xs font-semibold mb-2 text-blue-600">Ejemplo:</p>
                  <p className="text-xs leading-relaxed">
                    Spread de 2 pips en EUR/USD<br />
                    Valor del pip = $10<br />
                    Costo = 2 × $10 = <span className="font-bold text-blue-600">$20</span>
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded">
                  <p className="text-xs flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span>Este costo se paga automáticamente al abrir la posición. Tu operación empieza "en negativo" por esta cantidad.</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Slippage */}
            <Card className="p-6 bg-gradient-to-br from-red-500/5 to-transparent hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h4 className="font-bold text-lg">Regla de Slippage</h4>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 p-4 rounded-lg border border-red-500/20">
                  <p className="text-xs font-semibold mb-2">Condición 1:</p>
                  <p className="font-mono text-xs">|RP - MP| / pip ≤ Rango</p>
                  <p className="text-xs mt-1 text-muted-foreground">→ Orden ejecutada al precio de mercado (MP)</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 p-4 rounded-lg border border-orange-500/20">
                  <p className="text-xs font-semibold mb-2">Condición 2:</p>
                  <p className="font-mono text-xs">|RP - MP| / pip &gt; Rango</p>
                  <p className="text-xs mt-1 text-muted-foreground">→ Orden ejecutada a tu precio solicitado (RP)</p>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <p className="font-semibold">Definiciones:</p>
                <p><span className="font-bold text-red-600">RP:</span> Request Price (precio que solicitaste)</p>
                <p><span className="font-bold text-red-600">MP:</span> Market Price (precio actual del mercado)</p>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Profit/Loss Calculation - Step by Step */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Cálculo de Ganancias y Pérdidas</h3>
              <p className="text-sm text-muted-foreground">Cómo determinar tus niveles de TP, SL y Stop Out</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/20 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/10 p-6 rounded-xl border border-emerald-500/20 mb-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">¿Por qué es crucial?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Saber calcular tus niveles de <span className="font-bold text-emerald-600">Take Profit (TP)</span> y <span className="font-bold text-red-600">Stop Loss (SL)</span> 
                  te permite planificar exactamente cuánto ganarás si tu análisis es correcto, y cuánto perderás si estás equivocado. 
                  Esto es la base de la gestión de riesgo profesional.
                </p>
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <Card className="p-8 mb-6 border-2 border-primary/20 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                1
              </div>
              <h4 className="text-2xl font-bold">Calcula el Cambio de Precio</h4>
            </div>

            <p className="text-muted-foreground mb-6">
              Primero necesitas saber cuántos pips representan tu ganancia o pérdida objetivo:
            </p>

            <div className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/5 p-6 rounded-xl border-2 border-primary/30 mb-6">
              <p className="text-xs text-muted-foreground mb-3 text-center">FÓRMULA DEL CAMBIO DE PRECIO:</p>
              <p className="font-mono text-2xl font-bold text-center text-primary">
                (Profit o Loss / Valor del Pip) × Pip Size
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-lg border-l-4 border-l-emerald-500">
                <p className="font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Ejemplo: Ganancia Objetivo
                </p>
                <div className="space-y-2 text-sm">
                  <p>Quieres ganar: <span className="font-bold">$100</span></p>
                  <p>Valor del pip: <span className="font-bold">$10</span></p>
                  <p>Pip size: <span className="font-bold">0.0001</span></p>
                  <div className="mt-4 p-3 bg-background/50 rounded">
                    <p className="font-mono text-xs">($100 / $10) × 0.0001</p>
                    <p className="font-mono text-xs">= 10 × 0.0001</p>
                    <p className="font-mono text-lg font-bold text-emerald-600 mt-2">= 0.0010</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    El precio debe moverse <span className="font-bold">0.0010</span> (10 pips) a tu favor
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border-l-4 border-l-red-500">
                <p className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Ejemplo: Stop Loss
                </p>
                <div className="space-y-2 text-sm">
                  <p>Máxima pérdida: <span className="font-bold">$50</span></p>
                  <p>Valor del pip: <span className="font-bold">$10</span></p>
                  <p>Pip size: <span className="font-bold">0.0001</span></p>
                  <div className="mt-4 p-3 bg-background/50 rounded">
                    <p className="font-mono text-xs">($50 / $10) × 0.0001</p>
                    <p className="font-mono text-xs">= 5 × 0.0001</p>
                    <p className="font-mono text-lg font-bold text-red-600 mt-2">= 0.0005</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Tu SL debe estar a <span className="font-bold">0.0005</span> (5 pips) del precio de entrada
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-8 border-2 border-blue-500/20 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-600 text-lg">
                2
              </div>
              <h4 className="text-2xl font-bold">Calcula los Niveles de Precio</h4>
            </div>

            <p className="text-muted-foreground mb-6">
              Ahora suma o resta el cambio de precio según el tipo de orden:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Buy Orders */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 rounded-xl border-2 border-emerald-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                  <h5 className="text-xl font-bold text-emerald-600">Órdenes de Compra (BUY)</h5>
                </div>

                <div className="space-y-4">
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Take Profit:</p>
                    <p className="font-mono font-bold text-lg text-emerald-600">
                      TP = Precio de Apertura + Cambio
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Stop Loss / Stop Out:</p>
                    <p className="font-mono font-bold text-lg text-red-600">
                      SL = Precio de Apertura - Cambio
                    </p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-lg mt-4">
                    <p className="font-semibold text-xs mb-2 text-emerald-700 dark:text-emerald-400">Ejemplo Completo:</p>
                    <div className="space-y-1 text-xs">
                      <p>• Precio de entrada: <span className="font-bold">1.2000</span></p>
                      <p>• Cambio (TP): <span className="font-bold text-emerald-600">+0.0010</span></p>
                      <p>• Cambio (SL): <span className="font-bold text-red-600">-0.0005</span></p>
                      <div className="mt-3 pt-3 border-t border-emerald-500/30">
                        <p className="font-mono">TP = 1.2000 + 0.0010 = <span className="font-bold text-emerald-600">1.2010</span></p>
                        <p className="font-mono">SL = 1.2000 - 0.0005 = <span className="font-bold text-red-600">1.1995</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sell Orders */}
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 p-6 rounded-xl border-2 border-red-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowDownRight className="w-6 h-6 text-red-600" />
                  <h5 className="text-xl font-bold text-red-600">Órdenes de Venta (SELL)</h5>
                </div>

                <div className="space-y-4">
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Take Profit:</p>
                    <p className="font-mono font-bold text-lg text-emerald-600">
                      TP = Precio de Apertura - Cambio
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Stop Loss / Stop Out:</p>
                    <p className="font-mono font-bold text-lg text-red-600">
                      SL = Precio de Apertura + Cambio
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-lg mt-4">
                    <p className="font-semibold text-xs mb-2 text-red-700 dark:text-red-400">Ejemplo Completo:</p>
                    <div className="space-y-1 text-xs">
                      <p>• Precio de entrada: <span className="font-bold">1.2000</span></p>
                      <p>• Cambio (TP): <span className="font-bold text-emerald-600">-0.0010</span></p>
                      <p>• Cambio (SL): <span className="font-bold text-red-600">+0.0005</span></p>
                      <div className="mt-3 pt-3 border-t border-red-500/30">
                        <p className="font-mono">TP = 1.2000 - 0.0010 = <span className="font-bold text-emerald-600">1.1990</span></p>
                        <p className="font-mono">SL = 1.2000 + 0.0005 = <span className="font-bold text-red-600">1.2005</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Swap Calculation */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <Clock className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Cálculo de Swap (Interés Overnight)</h3>
              <p className="text-sm text-muted-foreground">Costo o ganancia por mantener posiciones abiertas</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/20 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/10 p-6 rounded-xl border border-indigo-500/20 mb-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">¿Qué es el Swap?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El <span className="font-bold text-indigo-600">swap</span> es el interés que pagas o recibes por mantener una posición abierta de un día para otro. 
                  Se calcula según la diferencia de tasas de interés entre las dos divisas del par que estás operando.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Formula Card */}
            <Card className="p-6 border-2 border-indigo-500/30">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-indigo-500" />
                Fórmula del Swap
              </h4>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 rounded-xl border-2 border-indigo-500/30 mb-6">
                <p className="font-mono text-center font-bold text-lg break-words">
                  (Valor del Contrato × Tasa Swap × Días) / 360
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-lg">
                  <p className="font-semibold text-sm mb-3 text-indigo-600">Ejemplo Práctico:</p>
                  <div className="space-y-2 text-sm">
                    <p>• 1 lote EUR/USD = <span className="font-bold">100,000 EUR</span></p>
                    <p>• Tasa swap long = <span className="font-bold">-2.5 puntos</span></p>
                    <p>• Días = <span className="font-bold">1</span></p>
                    <div className="mt-3 p-3 bg-background/50 rounded font-mono text-xs">
                      <p>(100,000 × -2.5 × 1) / 360</p>
                      <p className="text-red-600 font-bold mt-2">= -6.94 EUR (costo)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded border border-amber-500/30">
                  <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>El swap puede ser positivo (ganas) o negativo (pagas), dependiendo de las tasas de interés</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Timing and Tips */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-l-4 border-l-blue-500">
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Horarios del Swap
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Horario de aplicación:</p>
                      <p className="text-muted-foreground">00:00 hora del servidor (cierre del día de trading)</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Triple Swap (Miércoles):</p>
                      <p className="text-muted-foreground">Los miércoles se cobra swap por 3 días (incluye el fin de semana)</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-500/5 to-transparent border-l-4 border-l-emerald-500">
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-500" />
                  Tips Profesionales
                </h5>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                    <span>Revisa las tasas de swap antes de mantener posiciones overnight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                    <span>Los swaps positivos pueden ser una estrategia (carry trade)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                    <span>Considera los swaps en operaciones de largo plazo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold flex-shrink-0">⚠</span>
                    <span>Los swaps negativos acumulan y reducen tus ganancias</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Final Educational Note */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 p-8 rounded-2xl border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary rounded-lg flex-shrink-0">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-3">Práctica y Dominio</h4>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Estas fórmulas pueden parecer complejas al principio, pero con la práctica se vuelven segunda naturaleza. 
                Te recomendamos usar nuestras <span className="font-bold text-primary">calculadoras automáticas</span> mientras aprendes, 
                pero es importante que entiendas la lógica detrás de cada cálculo.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Target className="w-3 h-3 mr-1" />
                  Gestión de Riesgo
                </Badge>
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Calculator className="w-3 h-3 mr-1" />
                  Cálculos Precisos
                </Badge>
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Trading Profesional
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
