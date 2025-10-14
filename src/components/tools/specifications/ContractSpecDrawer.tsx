import { useContractSpec } from "@/hooks/useContractSpec";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Scale,
  TrendingUp,
  Zap,
  Activity,
  Clock,
  AlertCircle,
  Percent,
  Target,
  Shield,
  TrendingDown,
  Info,
  Lightbulb,
  Calculator,
  Gauge,
  ChevronRight,
  AlertTriangle,
  ArrowLeftRight,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface ContractSpecDrawerProps {
  symbol: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractSpecDrawer({
  symbol,
  open,
  onOpenChange,
}: ContractSpecDrawerProps) {
  const { data: spec, isLoading } = useContractSpec(symbol);

  if (!open) return null;

  const getAssetClassColor = (assetClass: string) => {
    const colors: Record<string, string> = {
      forex: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      commodities: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      indices: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      crypto: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      stocks: "bg-green-500/10 text-green-600 border-green-500/20",
    };
    return colors[assetClass] || "bg-muted text-muted-foreground";
  };

  const SpecCard = ({ icon: Icon, title, value, subtitle, variant = "default", explanation }: any) => {
    const variantStyles = {
      default: "border-border",
      positive: "border-teal/30 bg-teal/5",
      negative: "border-red-500/30 bg-red-500/5",
      warning: "border-amber-500/30 bg-amber-500/5",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border p-5 ${variantStyles[variant as keyof typeof variantStyles]} hover:shadow-lg transition-all`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-teal/10">
            <Icon className="w-5 h-5 text-teal" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1 font-medium">{title}</p>
            <p className="text-2xl font-bold mb-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {explanation && (
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50 italic">
                {explanation}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const InfoSection = ({ icon: Icon, title, content, tip, children }: any) => (
    <Card className="border-line hover:border-teal/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-teal/10">
            <Icon className="w-4 h-4 text-teal" />
          </div>
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {content && <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>}
        {children}
        {tip && (
          <div className="flex gap-2 mt-3 p-2 rounded-md bg-teal/5 border border-teal/10">
            <Lightbulb className="w-4 h-4 text-teal shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground italic">{tip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {isLoading ? (
          <div className="space-y-4 p-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : spec ? (
          <div className="space-y-0">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-teal/10 via-primary/5 to-transparent p-8 border-b border-border">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <DialogHeader>
                      <DialogTitle className="text-4xl mb-2 font-bold">{spec.symbol}</DialogTitle>
                    </DialogHeader>
                    <p className="text-xl text-muted-foreground mb-3">{spec.name}</p>
                    <div className="flex gap-3 flex-wrap">
                      <Badge className={`${getAssetClassColor(spec.asset_class)} capitalize text-sm px-3 py-1`}>
                        {spec.asset_class}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {spec.base_currency}
                      </Badge>
                      {spec.quote_currency && (
                        <Badge variant="outline" className="text-sm">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {spec.quote_currency}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Key Specs Grid */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Target className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Especificaciones Clave</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SpecCard
                    icon={DollarSign}
                    title="Valor del Pip"
                    value={`$${spec.pip_value}`}
                    subtitle="Por lote estándar (1.0)"
                    variant="positive"
                    explanation="Cuánto ganas/pierdes por cada pip de movimiento"
                  />
                  <SpecCard
                    icon={Scale}
                    title="Tamaño del Contrato"
                    value={spec.contract_size.toLocaleString()}
                    subtitle="Unidades por lote"
                    explanation="Un lote representa esta cantidad de unidades base"
                  />
                  <SpecCard
                    icon={TrendingUp}
                    title="Spread Típico"
                    value={spec.spread_typical || "Variable"}
                    subtitle={spec.spread_typical ? "pips promedio" : "Consultar broker"}
                    variant="warning"
                    explanation="Diferencia entre precio de compra y venta"
                  />
                  <SpecCard
                    icon={Zap}
                    title="Apalancamiento"
                    value={spec.leverage_max ? `1:${spec.leverage_max}` : "N/A"}
                    subtitle="Máximo disponible"
                    variant="warning"
                    explanation="Controla más capital del que tienes depositado"
                  />
                </div>
              </div>

              <Separator />

              {/* Trading Parameters */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Gauge className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Parámetros de Operación</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-line">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Scale className="w-4 h-4 text-teal" />
                        Tamaño de Posición
                      </CardTitle>
                      <CardDescription>Límites de volumen operado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Mínimo:</span>
                        <span className="font-semibold text-base">{spec.min_lot} lotes</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Máximo:</span>
                        <span className="font-semibold text-base">{spec.max_lot} lotes</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Incremento:</span>
                        <span className="font-semibold text-base">{spec.lot_step} lotes</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        Puedes operar desde {spec.min_lot} hasta {spec.max_lot} lotes, ajustando en incrementos de {spec.lot_step}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-line">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal" />
                        Precisión del Precio
                      </CardTitle>
                      <CardDescription>Cómo se mide el movimiento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Decimales:</span>
                        <span className="font-semibold text-base">{spec.pip_position}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">1 pip vale:</span>
                        <span className="font-semibold text-base">${spec.pip_value}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Tamaño pip:</span>
                        <span className="font-semibold text-base">{Math.pow(10, -spec.pip_position)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        Los precios se cotizan con {spec.pip_position} decimales de precisión
                      </p>
                    </CardContent>
                  </Card>

                  {spec.margin_percentage && (
                    <Card className="border-line">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Percent className="w-4 h-4 text-teal" />
                          Margen Requerido
                        </CardTitle>
                        <CardDescription>Capital necesario bloqueado</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                          <span className="text-sm text-muted-foreground">Porcentaje:</span>
                          <span className="font-semibold text-base">{spec.margin_percentage}%</span>
                        </div>
                        <div className="p-3 rounded bg-teal/5 border border-teal/20">
                          <p className="text-xs font-medium text-foreground mb-1">Ejemplo práctico:</p>
                          <p className="text-xs text-muted-foreground">
                            Para abrir 1 lote (${spec.contract_size.toLocaleString()}), necesitas aproximadamente ${((spec.contract_size * spec.margin_percentage) / 100).toLocaleString()} de margen
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                          El resto lo cubre el broker mediante apalancamiento
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Costs Section */}
              {(spec.swap_long !== null || spec.swap_short !== null) && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Clock className="w-5 h-5 text-teal" />
                      <h3 className="text-xl font-semibold">Costos de Financiamiento (Swap)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {spec.swap_long !== null && (
                        <Card className={`${spec.swap_long >= 0 ? "border-teal/30 bg-teal/5" : "border-red-500/30 bg-red-500/5"}`}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Swap Long (Compra)
                            </CardTitle>
                            <CardDescription>Mantener posición de compra overnight</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-4xl font-bold mb-2 ${spec.swap_long >= 0 ? "text-teal" : "text-red-500"}`}>
                              {spec.swap_long > 0 ? "+" : ""}{spec.swap_long}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">puntos por lote/día</p>
                            <div className="p-3 rounded bg-background/50 border border-border">
                              <p className="text-xs text-muted-foreground">
                                {spec.swap_long >= 0 
                                  ? "✓ Recibes un crédito por mantener esta posición" 
                                  : "✗ Pagas este costo por mantener esta posición"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {spec.swap_short !== null && (
                        <Card className={`${spec.swap_short >= 0 ? "border-teal/30 bg-teal/5" : "border-red-500/30 bg-red-500/5"}`}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingDown className="w-5 h-5" />
                              Swap Short (Venta)
                            </CardTitle>
                            <CardDescription>Mantener posición de venta overnight</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-4xl font-bold mb-2 ${spec.swap_short >= 0 ? "text-teal" : "text-red-500"}`}>
                              {spec.swap_short > 0 ? "+" : ""}{spec.swap_short}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">puntos por lote/día</p>
                            <div className="p-3 rounded bg-background/50 border border-border">
                              <p className="text-xs text-muted-foreground">
                                {spec.swap_short >= 0 
                                  ? "✓ Recibes un crédito por mantener esta posición" 
                                  : "✗ Pagas este costo por mantener esta posición"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <strong>¿Qué es el swap?</strong> Son intereses que se cobran o pagan por mantener posiciones abiertas de un día para otro, 
                      basados en la diferencia de tasas de interés entre las dos monedas (en Forex) o el costo de financiamiento (en otros activos).
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Educational Insights */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Lightbulb className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Guía Práctica: Cómo Usar Esta Información</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoSection
                    icon={Shield}
                    title="1. Calcula tu Riesgo"
                    content="Usa el valor del pip para determinar cuánto dinero arriesgas por cada pip de stop loss. Por ejemplo, si tu SL es 50 pips y operas 1 lote, tu riesgo es 50 × $10 = $500."
                    tip="Regla de oro: nunca arriesgues más del 1-2% de tu capital en una sola operación."
                  />
                  <InfoSection
                    icon={Calculator}
                    title="2. Determina el Tamaño"
                    content="Conociendo tu riesgo máximo en dólares y la distancia de tu SL en pips, usa nuestra calculadora de Position Size para saber exactamente cuántos lotes operar."
                    tip="Si tu cuenta es de $10,000 y quieres arriesgar $100, con SL de 50 pips deberías operar 0.2 lotes en este instrumento."
                  />
                  <InfoSection
                    icon={Zap}
                    title="3. Comprende el Apalancamiento"
                    content={`Con 1:${spec.leverage_max || 100} puedes controlar ${spec.leverage_max || 100}x tu capital. Esto amplifica ganancias Y pérdidas. Un movimiento del 1% contra ti con apalancamiento 1:100 significa perder el 100% de tu margen.`}
                    tip="El apalancamiento es una herramienta, no una estrategia. Úsalo con precaución y stop loss bien definidos."
                  />
                  <InfoSection
                    icon={Clock}
                    title="4. Considera los Costos"
                    content="Los swaps afectan operaciones intraday que se extienden. Si el swap es negativo y mantienes la posición 10 días, multiplica el swap diario × 10 para conocer el costo adicional."
                    tip={`En este instrumento, ${spec.swap_long && spec.swap_long < 0 ? "evita mantener compras" : spec.swap_short && spec.swap_short < 0 ? "evita mantener ventas" : "ambas direcciones tienen costo"} por periodos largos si el swap es negativo.`}
                  />
                </div>
              </div>

              <Separator />

              {/* Pip Size and Point Size */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Target className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Pip Size y Point Size</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprende la precisión de precios según el tipo de instrumento que operas
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-3 text-left font-semibold"></th>
                        <th className="border border-border p-3 text-center font-semibold">Standard Currencies</th>
                        <th className="border border-border p-3 text-center font-semibold">Gold, Silver, JPY</th>
                        <th className="border border-border p-3 text-center font-semibold">Cryptocurrencies</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium bg-muted/30">Price format</td>
                        <td className="border border-border p-3 text-center">EURUSD: 1.21568</td>
                        <td className="border border-border p-3 text-center">USDJPY: 113.115</td>
                        <td className="border border-border p-3 text-center">BTCUSD: 6845.25</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium bg-muted/30">Pip</td>
                        <td className="border border-border p-3 text-center font-mono">4th decimal</td>
                        <td className="border border-border p-3 text-center font-mono">2nd decimal</td>
                        <td className="border border-border p-3 text-center font-mono">1st decimal</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium bg-muted/30">Point</td>
                        <td className="border border-border p-3 text-center font-mono">5th decimal</td>
                        <td className="border border-border p-3 text-center font-mono">3rd decimal</td>
                        <td className="border border-border p-3 text-center font-mono">2nd decimal</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium bg-muted/30">Pip Size</td>
                        <td className="border border-border p-3 text-center font-mono text-primary">0.0001</td>
                        <td className="border border-border p-3 text-center font-mono text-primary">0.01</td>
                        <td className="border border-border p-3 text-center font-mono text-primary">0.1</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium bg-muted/30">Point Size</td>
                        <td className="border border-border p-3 text-center font-mono text-muted-foreground">0.00001</td>
                        <td className="border border-border p-3 text-center font-mono text-muted-foreground">0.001</td>
                        <td className="border border-border p-3 text-center font-mono text-muted-foreground">0.01</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Contract Sizes */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <DollarSign className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Tamaños de Contrato</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Cada instrumento tiene un tamaño de contrato estándar diferente. Esto determina cuánto estás realmente controlando cuando operas 1 lote.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-3 text-left font-semibold">Trading Instrument</th>
                        <th className="border border-border p-3 text-left font-semibold">Contract Size</th>
                        <th className="border border-border p-3 text-left font-semibold bg-destructive/10">Exceptions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium">Currency Pairs</td>
                        <td className="border border-border p-3">100,000 of the Base Currency</td>
                        <td className="border border-border p-3 text-center text-muted-foreground">-</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Metals</td>
                        <td className="border border-border p-3">
                          <div className="space-y-1">
                            <div>Gold (XAU): <span className="font-mono text-primary">100 Troy Ounces</span></div>
                            <div>Silver (XAG): <span className="font-mono text-primary">5000 Troy Ounces</span></div>
                            <div>Platinum (XPT): <span className="font-mono text-primary">100 Troy Ounces</span></div>
                            <div>Palladium (XPD): <span className="font-mono text-primary">100 Troy Ounces</span></div>
                          </div>
                        </td>
                        <td className="border border-border p-3 text-center text-muted-foreground">-</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Cryptocurrencies</td>
                        <td className="border border-border p-3 font-mono">1 coin</td>
                        <td className="border border-border p-3 text-center text-muted-foreground">-</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Indices</td>
                        <td className="border border-border p-3 font-mono">1</td>
                        <td className="border border-border p-3">
                          <ul className="text-xs space-y-1 list-disc list-inside">
                            <li>US30_x10 - 10</li>
                            <li>USTEC_x100 - 100</li>
                            <li>US500_x100 - 100</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Stocks</td>
                        <td className="border border-border p-3 font-mono">100 shares</td>
                        <td className="border border-border p-3 text-center text-muted-foreground">-</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Energies</td>
                        <td className="border border-border p-3 font-mono">1000 BBL (Barrels)</td>
                        <td className="border border-border p-3 text-center text-muted-foreground">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="my-8" />

              {/* CFD Formulae */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Fórmulas CFD Esenciales</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Domina estas fórmulas fundamentales para calcular correctamente tus operaciones y gestionar tu riesgo
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-3 text-left font-semibold">Parameter</th>
                        <th className="border border-border p-3 text-left font-semibold">Formula</th>
                        <th className="border border-border p-3 text-left font-semibold">Measure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium">Trading Volume</td>
                        <td className="border border-border p-3 font-mono text-sm">Lots × Contract Size</td>
                        <td className="border border-border p-3">Base Currency</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Spread</td>
                        <td className="border border-border p-3 font-mono text-sm">(Ask Price - Bid Price) / Pip Size</td>
                        <td className="border border-border p-3">Pips</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Margin</td>
                        <td className="border border-border p-3">
                          <div className="space-y-1">
                            <div className="font-mono text-sm">(Lots × Contract Size) / Leverage</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Converting Margin to Account Currency</span> depends on currencies and instrument involved.
                            </div>
                          </div>
                        </td>
                        <td className="border border-border p-3">
                          <div>Calculated in Base currency.</div>
                          <div className="text-xs text-muted-foreground">Held in account currency.</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Free Margin</td>
                        <td className="border border-border p-3 font-mono text-sm">Equity - Margin</td>
                        <td className="border border-border p-3">Account Currency</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Pip Value</td>
                        <td className="border border-border p-3 font-mono text-sm">Lots × Contract Size × Pip Size</td>
                        <td className="border border-border p-3">Quote Currency</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Additional Formulas */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Fórmulas Adicionales</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Otros cálculos importantes que todo trader profesional debe dominar
                </p>
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" />
                      Margin Level
                    </h4>
                    <div className="pl-6 space-y-2">
                      <div className="font-mono text-sm bg-muted/50 p-2 rounded">
                        (Equity / Margin) × 100
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Measure:</span> %
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El Margin Level indica qué tan cerca estás de un margin call. <span className="font-semibold text-amber-600">Mantén siempre por encima de 100%</span> para evitar liquidaciones.
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Cost of Spread
                    </h4>
                    <div className="pl-6 space-y-2">
                      <div className="font-mono text-sm bg-muted/50 p-2 rounded">
                        Spread in pips × Pip value
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Measure:</span> Quote Currency
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Este es el <span className="font-semibold">costo inmediato</span> de entrar en una operación. Considera esto en tu análisis riesgo/beneficio. Para {spec.symbol}, con un spread típico de {spec.spread_typical} pips, el costo es aproximadamente ${(spec.spread_typical * spec.pip_value).toFixed(2)} por lote.
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      [GKB] Slippage Rule
                    </h4>
                    <div className="pl-6 space-y-2">
                      <div className="space-y-1 text-sm">
                        <div className="bg-muted/50 p-2 rounded">
                          <span className="font-medium">|RP - MP|</span>/pip size ≤ Slippage-free range: Order executed at <span className="font-mono text-primary">MP</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <span className="font-medium">|RP - MP|</span>/pip size &gt; Slippage-free range: Order executed at <span className="font-mono text-primary">RP</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><span className="font-medium">RP:</span> Request Price (precio solicitado)</p>
                        <p><span className="font-medium">MP:</span> Market Price (precio de mercado actual)</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Measure:</span> Pips
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Profit/Loss Calculation */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Cálculo de Profit/Loss (TP, SL y SO)</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Aprende a calcular correctamente tus niveles de Take Profit, Stop Loss y Stop Out. Esta es una de las habilidades más importantes en trading.
                </p>
                <Card className="p-6 bg-blue-500/5 border-blue-500/20">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Step 1: Calcular el cambio de precio
                      </h4>
                      <p className="text-sm mb-2">Find price change using this formula:</p>
                      <div className="font-mono text-sm bg-muted/50 p-3 rounded mb-2 border border-border">
                        (Profit or Loss / Pip Value) × Pip Size
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Esto te dice cuántos puntos de precio equivalen a tu ganancia o pérdida deseada.
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400 underline decoration-blue-500 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Step 2 (if you have only the opening price given):
                      </h4>
                      <p className="text-sm mb-3">Calculate price of TP, SL and SO in the following way:</p>
                      
                      <div className="space-y-4">
                        <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2 text-teal">Buy orders:</p>
                          <ul className="text-sm space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                              <span className="text-teal">•</span>
                              <span className="font-mono text-xs">TP = Opening price + Price change</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-teal">•</span>
                              <span className="font-mono text-xs">SL/SO = Opening price - Price change</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">Sell orders:</p>
                          <ul className="text-sm space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400">•</span>
                              <span className="font-mono text-xs">TP = Opening price - Price change</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400">•</span>
                              <span className="font-mono text-xs">SL/SO = Opening price + Price change</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400 underline decoration-blue-500 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Step 2 (if you have the current price in the market given):
                      </h4>
                      <p className="text-sm mb-2 text-destructive font-medium">*Not relevant during on-boarding assessment</p>
                      <p className="text-sm mb-3">Calculate price of TP, SL and SO based on current market price:</p>
                      
                      <div className="space-y-4">
                        <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2 text-teal">Buy orders:</p>
                          <ul className="text-sm space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                              <span className="text-teal">•</span>
                              <span className="font-mono text-xs">TP = Closing price (bid) + Price change</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-teal">•</span>
                              <span className="font-mono text-xs">SL/SO = Closing price (bid) - Price change</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">Sell orders:</p>
                          <ul className="text-sm space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400">•</span>
                              <span className="font-mono text-xs">TP = Closing price (ask) - Price change</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400">•</span>
                              <span className="font-mono text-xs">SL/SO = Closing price (ask) + Price change</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <h5 className="font-semibold text-sm mb-3 text-primary flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Formula Completa: Price Change in Pips × Pip Value
                      </h5>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium mb-2">Step 1: Calculate Price Change in Pips</p>
                          <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                            <li>For <span className="font-medium text-teal">BUY</span> orders: <span className="font-mono">[Closing Price (BID) - Opening Price (ASK)] / Pip size</span></li>
                            <li>For <span className="font-medium text-red-600">SELL</span> orders: <span className="font-mono">[Opening Price (BID) - Closing Price (ASK)] / Pip size</span></li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 2: Multiply Price Change in Pips with the Pip Value</p>
                          <p className="text-xs text-muted-foreground">
                            El resultado te dará tu ganancia o pérdida en la moneda cotizada (Quote Currency). 
                            Para {spec.symbol}, con un pip value de ${spec.pip_value}, cada pip de movimiento representa ese valor por lote.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Separator className="my-8" />

              {/* Swap Calculation */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <ArrowLeftRight className="w-5 h-5 text-teal" />
                  <h3 className="text-xl font-semibold">Cálculo de Swap (Costos Overnight)</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Entiende cómo se calculan los costos de financiamiento cuando mantienes posiciones abiertas de un día para otro
                </p>
                <Card className="p-6 bg-accent/5">
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-teal" />
                        Fórmula de Swap
                      </h4>
                      <div className="font-mono text-sm bg-muted/50 p-3 rounded border border-border">
                        Swap size (long/short) × Number of days × Pip Value
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        <span className="font-medium">Measure:</span> Quote Currency
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-3 text-amber-700 dark:text-amber-400">
                        ⚠️ Importante: Horarios y días de cargo triple
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>Charged only on weekdays at <span className="font-semibold">22:00 GMT +0</span> in Winter. In summer, it is charged at <span className="font-semibold">21:00 GMT +0</span>.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>Triple swap for <span className="font-semibold">forex & metals</span> on <span className="font-semibold text-amber-700 dark:text-amber-400">Wednesdays</span></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>For other instruments, swap is triple on <span className="font-semibold text-amber-700 dark:text-amber-400">Fridays</span></span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-sm mb-3">Tipos de órdenes:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-teal/5 border border-teal/20 rounded-lg p-3">
                          <p className="font-semibold text-sm mb-1 text-teal">Buy orders:</p>
                          <p className="text-xs text-muted-foreground">Use Long swap rate</p>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                          <p className="font-semibold text-sm mb-1 text-red-600 dark:text-red-400">Sell orders:</p>
                          <p className="text-xs text-muted-foreground">Use Short swap rate</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                      <div className="flex gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="font-medium text-sm text-blue-700 dark:text-blue-400">Tip profesional para {spec.symbol}:</p>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        {spec.swap_long !== null && spec.swap_short !== null ? (
                          <>
                            Para este instrumento, el swap long es <span className={spec.swap_long >= 0 ? "text-teal font-semibold" : "text-red-600 font-semibold"}>{spec.swap_long > 0 ? "+" : ""}{spec.swap_long}</span> y el swap short es <span className={spec.swap_short >= 0 ? "text-teal font-semibold" : "text-red-600 font-semibold"}>{spec.swap_short > 0 ? "+" : ""}{spec.swap_short}</span> puntos por lote/día.
                            {spec.swap_long < 0 && spec.swap_short < 0 && " Ambas direcciones tienen costo, así que considera el swap en estrategias de swing trading."}
                            {spec.swap_long >= 0 && spec.swap_short < 0 && " Las posiciones de compra son favorables para carry trade."}
                            {spec.swap_long < 0 && spec.swap_short >= 0 && " Las posiciones de venta son favorables para carry trade."}
                          </>
                        ) : (
                          "Si mantienes posiciones durante varios días, los swaps pueden sumar significativamente. Considera los swaps positivos para estrategias de carry trade y swaps negativos como un costo adicional."
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Separator />

              {/* Quick Action */}
              <Card className="border-teal/30 bg-gradient-to-r from-teal/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal" />
                    Siguiente Paso: Usa las Calculadoras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ahora que conoces las especificaciones, usa nuestras calculadoras profesionales para planificar tus operaciones con precisión:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-teal/10 transition-colors">
                      Position Size
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-teal/10 transition-colors">
                      Pip Value
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-teal/10 transition-colors">
                      Profit/Loss
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-teal/10 transition-colors">
                      Margen
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Warning */}
              <Card className="border-red-500/30 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    Advertencia de Riesgo Importante
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    El trading con instrumentos apalancados conlleva un alto nivel de riesgo para su capital. Es posible perder todo el capital invertido. 
                    No opere con dinero que no pueda permitirse perder. Asegúrese de comprender completamente los riesgos y considere 
                    buscar asesoramiento de un profesional independiente si es necesario. El rendimiento pasado no es indicativo de resultados futuros.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No se encontraron especificaciones para este símbolo
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
