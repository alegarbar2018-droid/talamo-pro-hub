import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
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
  HelpCircle,
} from "lucide-react";

export function TradingFormulasGuide() {
  return (
    <TooltipProvider>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Fórmulas y Especificaciones de Trading</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Guía completa de fórmulas, tamaños de contrato y especificaciones técnicas para operar con confianza y precisión
          </p>
        </div>

      {/* Pip Size and Point Size */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Tamaño de Pip y Point</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Comprende la precisión de precios según el tipo de instrumento que operas
        </p>
        <Card className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-4 text-left font-semibold"></th>
                <th className="border border-border p-4 text-center font-semibold">
                  Pares de Divisas Estándar
                </th>
                <th className="border border-border p-4 text-center font-semibold">
                  Oro, Plata, JPY
                </th>
                <th className="border border-border p-4 text-center font-semibold">
                  Criptomonedas
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Formato de Precio
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cómo se muestra el precio del instrumento en tu plataforma de trading</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 text-center">EURUSD: 1.21568</td>
                <td className="border border-border p-4 text-center">USDJPY: 113.115</td>
                <td className="border border-border p-4 text-center">BTCUSD: 6845.25</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Pip
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Unidad de medida estándar para cambios de precio en trading</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 text-center font-mono">4to decimal</td>
                <td className="border border-border p-4 text-center font-mono">2do decimal</td>
                <td className="border border-border p-4 text-center font-mono">1er decimal</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Point
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Unidad más pequeña de cambio de precio, 1/10 de un pip</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 text-center font-mono">5to decimal</td>
                <td className="border border-border p-4 text-center font-mono">3er decimal</td>
                <td className="border border-border p-4 text-center font-mono">2do decimal</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">
                  <Badge variant="outline">Tamaño de Pip</Badge>
                </td>
                <td className="border border-border p-4 text-center font-mono text-primary font-bold">0.0001</td>
                <td className="border border-border p-4 text-center font-mono text-primary font-bold">0.01</td>
                <td className="border border-border p-4 text-center font-mono text-primary font-bold">0.1</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">
                  <Badge variant="secondary">Tamaño de Point</Badge>
                </td>
                <td className="border border-border p-4 text-center font-mono text-muted-foreground">0.00001</td>
                <td className="border border-border p-4 text-center font-mono text-muted-foreground">0.001</td>
                <td className="border border-border p-4 text-center font-mono text-muted-foreground">0.01</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex gap-2 items-start">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">¿Qué es un Pip?</p>
                <p className="text-muted-foreground">
                  Un <strong>pip</strong> (percentage in point) es la unidad estándar para medir cambios de precio. 
                  Por ejemplo, si EUR/USD se mueve de 1.2150 a 1.2151, ha subido 1 pip. 
                  El <strong>point</strong> es una fracción más pequeña (1/10 de pip) para mayor precisión.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Contract Sizes */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Tamaños de Contrato</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Cada instrumento tiene un tamaño de contrato estándar diferente. Esto determina cuánto estás realmente controlando cuando operas 1 lote.
        </p>
        <Card className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-4 text-left font-semibold">Instrumento de Trading</th>
                <th className="border border-border p-4 text-left font-semibold">Tamaño de Contrato</th>
                <th className="border border-border p-4 text-left font-semibold bg-amber-500/10">Excepciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Pares de Divisas
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">EUR/USD, GBP/USD, USD/JPY, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4">100,000 de la Moneda Base</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Metales
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Metales preciosos: Oro, Plata, Platino, Paladio</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4">
                  <div className="space-y-1">
                    <div>Oro (XAU): <span className="font-mono text-primary">100 Onzas Troy</span></div>
                    <div>Plata (XAG): <span className="font-mono text-primary">5000 Onzas Troy</span></div>
                    <div>Platino (XPT): <span className="font-mono text-primary">100 Onzas Troy</span></div>
                    <div>Paladio (XPD): <span className="font-mono text-primary">100 Onzas Troy</span></div>
                  </div>
                </td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Criptomonedas
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Bitcoin, Ethereum, y otras criptomonedas</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">1 moneda</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Índices
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">S&P 500, Dow Jones, NASDAQ, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">1</td>
                <td className="border border-border p-4">
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>US30_x10 - 10</li>
                    <li>USTEC_x100 - 100</li>
                    <li>US500_x100 - 100</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Acciones
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Acciones de empresas como Apple, Tesla, Amazon, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">100 acciones</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Energías
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Petróleo crudo, gas natural, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">1000 BBL (Barriles)</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex gap-2 items-start">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">¿Por qué es importante el Tamaño de Contrato?</p>
                <p className="text-muted-foreground">
                  Cuando operas 1 lote de EUR/USD, estás controlando 100,000 euros. El tamaño del contrato determina 
                  cuánto capital estás moviendo y, por lo tanto, el riesgo de tu operación. Siempre verifica el tamaño 
                  de contrato antes de operar un nuevo instrumento.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* CFD Formulae */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Fórmulas CFD Esenciales</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Domina estas fórmulas fundamentales para calcular correctamente tus operaciones y gestionar tu riesgo
        </p>
        <Card className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-4 text-left font-semibold">Parámetro</th>
                <th className="border border-border p-4 text-left font-semibold">Fórmula</th>
                <th className="border border-border p-4 text-left font-semibold">Unidad de Medida</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Volumen de Trading
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cantidad total de unidades que controlas en tu operación</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">Lotes × Tamaño de Contrato</td>
                <td className="border border-border p-4">Moneda Base</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Spread
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Diferencia entre el precio de compra y venta. Es el costo de abrir una posición</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">(Precio Ask - Precio Bid) / Tamaño de Pip</td>
                <td className="border border-border p-4">Pips</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Margen
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cantidad de dinero que necesitas tener bloqueada para mantener una posición abierta</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4">
                  <div className="space-y-1">
                    <div className="font-mono">(Lotes × Tamaño de Contrato) / Apalancamiento</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">La conversión a tu moneda de cuenta</span> depende de las monedas y el instrumento involucrado.
                    </div>
                  </div>
                </td>
                <td className="border border-border p-4">
                  <div>Calculado en moneda base.</div>
                  <div className="text-xs text-muted-foreground">Mantenido en moneda de cuenta.</div>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Margen Libre
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Dinero disponible en tu cuenta para abrir nuevas posiciones</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">Equity - Margen</td>
                <td className="border border-border p-4">Moneda de Cuenta</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      Valor del Pip
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cuánto dinero ganas o pierdes por cada pip de movimiento en el precio</p>
                    </TooltipContent>
                  </Tooltip>
                </td>
                <td className="border border-border p-4 font-mono">Lotes × Tamaño de Contrato × Tamaño de Pip</td>
                <td className="border border-border p-4">Moneda de Cotización</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <div className="flex gap-2 items-start">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">Consejo para Principiantes</p>
                <p className="text-muted-foreground">
                  No necesitas memorizar todas estas fórmulas. La mayoría de plataformas calculan estos valores automáticamente. 
                  Sin embargo, entender cómo funcionan te ayuda a tomar mejores decisiones de trading y gestionar tu riesgo correctamente.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Additional Formulas */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Fórmulas Adicionales</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Otros cálculos importantes que todo trader profesional debe dominar
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              Nivel de Margen
            </h4>
            <div className="space-y-3">
              <div className="font-mono text-sm bg-muted/50 p-3 rounded border border-border">
                (Equity / Margen) × 100
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Unidad:</span> %
              </div>
              <p className="text-xs text-muted-foreground">
                El Nivel de Margen indica qué tan cerca estás de un margin call. <span className="font-semibold text-amber-600">Mantén siempre por encima de 100%</span>.
              </p>
              <div className="text-xs bg-amber-500/10 p-2 rounded border border-amber-500/20">
                <strong>⚠️ Importante:</strong> Si cae por debajo de 100%, el broker puede cerrar tus posiciones automáticamente.
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Costo del Spread
            </h4>
            <div className="space-y-3">
              <div className="font-mono text-sm bg-muted/50 p-3 rounded border border-border">
                Spread en pips × Valor del pip
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Unidad:</span> Moneda de Cotización
              </div>
              <p className="text-xs text-muted-foreground">
                Costo inmediato de entrar en una operación. Inclúyelo en tu análisis riesgo/beneficio.
              </p>
              <div className="text-xs bg-blue-500/10 p-2 rounded border border-blue-500/20">
                <strong>Ejemplo:</strong> Si el spread es 2 pips y el valor del pip es $10, pagas $20 al abrir la posición.
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 cursor-help">
                  Regla de Slippage
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Diferencia entre el precio solicitado y el precio ejecutado en una orden</p>
                </TooltipContent>
              </Tooltip>
            </h4>
            <div className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="bg-muted/50 p-2 rounded border border-border">
                  <span className="font-medium">|PS - PM|</span>/tamaño pip ≤ Rango: Orden a <span className="font-mono text-primary">PM</span>
                </div>
                <div className="bg-muted/50 p-2 rounded border border-border">
                  <span className="font-medium">|PS - PM|</span>/tamaño pip &gt; Rango: Orden a <span className="font-mono text-primary">PS</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">PS:</span> Precio Solicitado | <span className="font-medium">PM:</span> Precio de Mercado
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Profit/Loss Calculation */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Cálculo de Ganancias/Pérdidas (TP, SL y SO)</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Aprende a calcular correctamente tus niveles de <Tooltip>
            <TooltipTrigger className="underline decoration-dotted cursor-help">Take Profit (TP)</TooltipTrigger>
            <TooltipContent><p className="max-w-xs">Precio al que quieres cerrar con ganancia</p></TooltipContent>
          </Tooltip>, <Tooltip>
            <TooltipTrigger className="underline decoration-dotted cursor-help">Stop Loss (SL)</TooltipTrigger>
            <TooltipContent><p className="max-w-xs">Precio al que quieres cerrar para limitar pérdidas</p></TooltipContent>
          </Tooltip> y <Tooltip>
            <TooltipTrigger className="underline decoration-dotted cursor-help">Stop Out (SO)</TooltipTrigger>
            <TooltipContent><p className="max-w-xs">Precio al que el broker cierra automáticamente tu posición</p></TooltipContent>
          </Tooltip>
        </p>
        <Card className="p-8 bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent border-blue-500/20">
          <div className="space-y-8">
            {/* Step 1 */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Paso 1: Calcular el cambio de precio
              </h4>
              <p className="text-sm mb-3">Usa esta fórmula para encontrar el cambio de precio:</p>
              <div className="font-mono text-base bg-muted/50 p-4 rounded-lg border border-border mb-3">
                (Ganancia o Pérdida / Valor del Pip) × Tamaño del Pip
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Esto te dice cuántos puntos de precio equivalen a tu ganancia o pérdida deseada.
              </p>
              <div className="text-xs bg-blue-500/10 p-3 rounded border border-blue-500/20">
                <strong>Ejemplo práctico:</strong> Si quieres ganar $100 y cada pip vale $10, necesitas un movimiento de: 
                ($100 / $10) × 0.0001 = 10 pips de movimiento.
              </div>
            </div>

            <Separator />

            {/* Step 2a */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Paso 2 (solo con precio de apertura)
              </h4>
              <p className="text-sm mb-4">Calcula TP, SL y SO de la siguiente manera:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal/5 border border-teal/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-teal flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Órdenes de Compra (BUY)
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Precio de apertura + Cambio de precio
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Precio de apertura - Cambio de precio
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Por qué:</strong> Al comprar, ganas cuando el precio sube, por eso el TP está arriba.
                  </p>
                </div>
                
                <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Órdenes de Venta (SELL)
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Precio de apertura - Cambio de precio
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Precio de apertura + Cambio de precio
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Por qué:</strong> Al vender, ganas cuando el precio baja, por eso el TP está abajo.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 2b */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Paso 2 (con precio actual del mercado)
              </h4>
              <p className="text-sm mb-2 text-destructive font-medium">*No relevante durante evaluación de incorporación</p>
              <p className="text-sm mb-4">Basado en el precio actual del mercado:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal/5 border border-teal/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-teal flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Órdenes de Compra (BUY)
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Precio cierre (bid) + Cambio de precio
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Precio cierre (bid) - Cambio de precio
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Órdenes de Venta (SELL)
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Precio cierre (ask) - Cambio de precio
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Precio cierre (ask) + Cambio de precio
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Complete Formula */}
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
              <h5 className="font-bold text-base mb-4 text-primary flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Fórmula Completa: Cambio de Precio en Pips × Valor del Pip
              </h5>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-3">Paso 1: Calcular el Cambio de Precio en Pips</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Para <span className="font-semibold text-teal">COMPRA</span>: <span className="font-mono text-xs">[Precio Cierre (BID) - Precio Apertura (ASK)] / Tamaño de Pip</span></li>
                    <li>Para <span className="font-semibold text-red-600">VENTA</span>: <span className="font-mono text-xs">[Precio Apertura (BID) - Precio Cierre (ASK)] / Tamaño de Pip</span></li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Paso 2: Multiplicar por el Valor del Pip</p>
                  <p className="text-sm text-muted-foreground">
                    El resultado te da tu ganancia o pérdida en la moneda cotizada (Quote Currency).
                  </p>
                </div>
                
                <div className="text-xs bg-blue-500/10 p-3 rounded border border-blue-500/20 mt-3">
                  <strong>Nota importante:</strong> Recuerda usar el precio <strong>BID</strong> (venta) para compras y 
                  el precio <strong>ASK</strong> (compra) para ventas al calcular el cierre de posición.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Swap Calculation */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <ArrowLeftRight className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Cálculo de Swap (Costos Overnight)</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Los <Tooltip>
            <TooltipTrigger className="underline decoration-dotted cursor-help font-medium">swaps</TooltipTrigger>
            <TooltipContent><p className="max-w-xs">Costos o beneficios de mantener una posición abierta de un día para otro</p></TooltipContent>
          </Tooltip> son costos (o ganancias) de financiamiento cuando mantienes posiciones abiertas de un día para otro
        </p>
        <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Fórmula de Swap
              </h4>
              <div className="font-mono text-base bg-muted/50 p-4 rounded-lg border border-border">
                Tamaño de Swap (largo/corto) × Número de días × Valor del Pip
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <span className="font-medium">Unidad de medida:</span> Moneda de Cotización
              </p>
            </div>

            <Separator />
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-lg">
              <div className="flex gap-2 items-start mb-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="font-semibold text-sm">Ejemplo Práctico</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Si abres 1 lote de EUR/USD con un swap de -0.5 pips, y el valor del pip es $10, 
                pagarás <strong>$5 por cada noche</strong> que mantengas la posición abierta. 
                Después de 3 noches, habrás pagado $15 en swaps.
              </p>
            </div>

            <Separator />

            <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-lg">
              <p className="text-sm font-semibold mb-4 text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios y días de cargo triple
              </p>
              <ul className="text-sm space-y-3">
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Se cobra a las <span className="font-semibold">22:00 GMT +0</span> en Invierno, <span className="font-semibold">21:00 GMT +0</span> en Verano</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Swap triple para <span className="font-semibold">forex y metales</span> los <span className="font-semibold text-amber-700 dark:text-amber-400">Miércoles</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Swap triple para <span className="font-semibold">otros instrumentos</span> los <span className="font-semibold text-amber-700 dark:text-amber-400">Viernes</span></span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                <p className="font-semibold mb-2 text-teal">Órdenes de Compra (Buy):</p>
                <p className="text-sm text-muted-foreground">Usa la tasa de swap <strong>Long</strong> (largo)</p>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <p className="font-semibold mb-2 text-red-600 dark:text-red-400">Órdenes de Venta (Sell):</p>
                <p className="text-sm text-muted-foreground">Usa la tasa de swap <strong>Short</strong> (corto)</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-lg">
              <div className="flex gap-3 mb-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-sm text-blue-700 dark:text-blue-400">Consejo Profesional:</p>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Si mantienes posiciones durante varios días, los swaps pueden sumar significativamente. 
                Considera los swaps positivos para estrategias de <Tooltip>
                  <TooltipTrigger className="underline decoration-dotted cursor-help font-medium">carry trade</TooltipTrigger>
                  <TooltipContent><p className="max-w-xs">Estrategia que busca ganar con los swaps positivos entre pares de divisas</p></TooltipContent>
                </Tooltip> y swaps negativos como un costo adicional en tus operaciones.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Bottom CTA */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <h4 className="font-bold text-xl mb-3">¿Listo para aplicar estos conocimientos?</h4>
            <p className="text-muted-foreground mb-4">
              Usa nuestras calculadoras profesionales en la pestaña "Calculadoras" para planificar tus operaciones con precisión matemática.
            </p>
          </div>
        </div>
      </Card>
    </div>
    </TooltipProvider>
  );
}
