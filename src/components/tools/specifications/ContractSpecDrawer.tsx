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

  const InfoSection = ({ icon: Icon, title, content, tip }: any) => (
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
        <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
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
