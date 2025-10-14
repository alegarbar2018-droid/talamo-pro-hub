import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

export function TradingFormulasGuide() {
  return (
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
          <h3 className="text-2xl font-bold">Pip Size y Point Size</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Comprende la precisión de precios según el tipo de instrumento que operas
        </p>
        <Card className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-4 text-left font-semibold"></th>
                <th className="border border-border p-4 text-center font-semibold">Standard Currencies</th>
                <th className="border border-border p-4 text-center font-semibold">Gold, Silver, JPY</th>
                <th className="border border-border p-4 text-center font-semibold">Cryptocurrencies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">Price format</td>
                <td className="border border-border p-4 text-center">EURUSD: 1.21568</td>
                <td className="border border-border p-4 text-center">USDJPY: 113.115</td>
                <td className="border border-border p-4 text-center">BTCUSD: 6845.25</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">Pip</td>
                <td className="border border-border p-4 text-center font-mono">4th decimal</td>
                <td className="border border-border p-4 text-center font-mono">2nd decimal</td>
                <td className="border border-border p-4 text-center font-mono">1st decimal</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">Point</td>
                <td className="border border-border p-4 text-center font-mono">5th decimal</td>
                <td className="border border-border p-4 text-center font-mono">3rd decimal</td>
                <td className="border border-border p-4 text-center font-mono">2nd decimal</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">Pip Size</td>
                <td className="border border-border p-4 text-center font-mono text-primary font-bold">0.0001</td>
                <td className="border border-border p-4 text-center font-mono text-primary font-bold">0.01</td>
                <td className="border border-border p-4 text-center font-mono text-primary font-bold">0.1</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium bg-muted/30">Point Size</td>
                <td className="border border-border p-4 text-center font-mono text-muted-foreground">0.00001</td>
                <td className="border border-border p-4 text-center font-mono text-muted-foreground">0.001</td>
                <td className="border border-border p-4 text-center font-mono text-muted-foreground">0.01</td>
              </tr>
            </tbody>
          </table>
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
                <th className="border border-border p-4 text-left font-semibold">Trading Instrument</th>
                <th className="border border-border p-4 text-left font-semibold">Contract Size</th>
                <th className="border border-border p-4 text-left font-semibold bg-destructive/10">Exceptions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-medium">Currency Pairs</td>
                <td className="border border-border p-4">100,000 of the Base Currency</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Metals</td>
                <td className="border border-border p-4">
                  <div className="space-y-1">
                    <div>Gold (XAU): <span className="font-mono text-primary">100 Troy Ounces</span></div>
                    <div>Silver (XAG): <span className="font-mono text-primary">5000 Troy Ounces</span></div>
                    <div>Platinum (XPT): <span className="font-mono text-primary">100 Troy Ounces</span></div>
                    <div>Palladium (XPD): <span className="font-mono text-primary">100 Troy Ounces</span></div>
                  </div>
                </td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Cryptocurrencies</td>
                <td className="border border-border p-4 font-mono">1 coin</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Indices</td>
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
                <td className="border border-border p-4 font-medium">Stocks</td>
                <td className="border border-border p-4 font-mono">100 shares</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Energies</td>
                <td className="border border-border p-4 font-mono">1000 BBL (Barrels)</td>
                <td className="border border-border p-4 text-center text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
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
                <th className="border border-border p-4 text-left font-semibold">Parameter</th>
                <th className="border border-border p-4 text-left font-semibold">Formula</th>
                <th className="border border-border p-4 text-left font-semibold">Measure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-medium">Trading Volume</td>
                <td className="border border-border p-4 font-mono">Lots × Contract Size</td>
                <td className="border border-border p-4">Base Currency</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Spread</td>
                <td className="border border-border p-4 font-mono">(Ask Price - Bid Price) / Pip Size</td>
                <td className="border border-border p-4">Pips</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Margin</td>
                <td className="border border-border p-4">
                  <div className="space-y-1">
                    <div className="font-mono">(Lots × Contract Size) / Leverage</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Converting Margin to Account Currency</span> depends on currencies and instrument involved.
                    </div>
                  </div>
                </td>
                <td className="border border-border p-4">
                  <div>Calculated in Base currency.</div>
                  <div className="text-xs text-muted-foreground">Held in account currency.</div>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Free Margin</td>
                <td className="border border-border p-4 font-mono">Equity - Margin</td>
                <td className="border border-border p-4">Account Currency</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-medium">Pip Value</td>
                <td className="border border-border p-4 font-mono">Lots × Contract Size × Pip Size</td>
                <td className="border border-border p-4">Quote Currency</td>
              </tr>
            </tbody>
          </table>
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
              Margin Level
            </h4>
            <div className="space-y-3">
              <div className="font-mono text-sm bg-muted/50 p-3 rounded border border-border">
                (Equity / Margin) × 100
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Measure:</span> %
              </div>
              <p className="text-xs text-muted-foreground">
                El Margin Level indica qué tan cerca estás de un margin call. <span className="font-semibold text-amber-600">Mantén siempre por encima de 100%</span>.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Cost of Spread
            </h4>
            <div className="space-y-3">
              <div className="font-mono text-sm bg-muted/50 p-3 rounded border border-border">
                Spread in pips × Pip value
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Measure:</span> Quote Currency
              </div>
              <p className="text-xs text-muted-foreground">
                Costo inmediato de entrar en una operación. Inclúyelo en tu análisis riesgo/beneficio.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Slippage Rule
            </h4>
            <div className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="bg-muted/50 p-2 rounded border border-border">
                  <span className="font-medium">|RP - MP|</span>/pip size ≤ Range: Order at <span className="font-mono text-primary">MP</span>
                </div>
                <div className="bg-muted/50 p-2 rounded border border-border">
                  <span className="font-medium">|RP - MP|</span>/pip size &gt; Range: Order at <span className="font-mono text-primary">RP</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">RP:</span> Request Price | <span className="font-medium">MP:</span> Market Price
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
          <h3 className="text-2xl font-bold">Cálculo de Profit/Loss (TP, SL y SO)</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Aprende a calcular correctamente tus niveles de Take Profit, Stop Loss y Stop Out
        </p>
        <Card className="p-8 bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent border-blue-500/20">
          <div className="space-y-8">
            {/* Step 1 */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Step 1: Calcular el cambio de precio
              </h4>
              <p className="text-sm mb-3">Usa esta fórmula para encontrar el cambio de precio:</p>
              <div className="font-mono text-base bg-muted/50 p-4 rounded-lg border border-border mb-3">
                (Profit or Loss / Pip Value) × Pip Size
              </div>
              <p className="text-xs text-muted-foreground">
                Esto te dice cuántos puntos de precio equivalen a tu ganancia o pérdida deseada.
              </p>
            </div>

            <Separator />

            {/* Step 2a */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Step 2 (solo con precio de apertura)
              </h4>
              <p className="text-sm mb-4">Calcula TP, SL y SO de la siguiente manera:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal/5 border border-teal/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-teal flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Buy orders (Compra)
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Opening price + Price change
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Opening price - Price change
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Sell orders (Venta)
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Opening price - Price change
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Opening price + Price change
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 2b */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Step 2 (con precio actual del mercado)
              </h4>
              <p className="text-sm mb-2 text-destructive font-medium">*Not relevant during on-boarding assessment</p>
              <p className="text-sm mb-4">Basado en el precio actual del mercado:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal/5 border border-teal/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-teal flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Buy orders
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Closing price (bid) + Price change
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Closing price (bid) - Price change
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-5">
                  <p className="font-semibold text-sm mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Sell orders
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      TP = Closing price (ask) - Price change
                    </li>
                    <li className="font-mono text-xs bg-background/50 p-2 rounded">
                      SL/SO = Closing price (ask) + Price change
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
                Fórmula Completa: Price Change in Pips × Pip Value
              </h5>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-3">Step 1: Calculate Price Change in Pips</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>For <span className="font-semibold text-teal">BUY</span>: <span className="font-mono text-xs">[Closing Price (BID) - Opening Price (ASK)] / Pip size</span></li>
                    <li>For <span className="font-semibold text-red-600">SELL</span>: <span className="font-mono text-xs">[Opening Price (BID) - Closing Price (ASK)] / Pip size</span></li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Step 2: Multiply by Pip Value</p>
                  <p className="text-sm text-muted-foreground">
                    El resultado te da tu ganancia o pérdida en la moneda cotizada (Quote Currency).
                  </p>
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
          Costos de financiamiento cuando mantienes posiciones abiertas de un día para otro
        </p>
        <Card className="p-8 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Fórmula de Swap
              </h4>
              <div className="font-mono text-base bg-muted/50 p-4 rounded-lg border border-border">
                Swap size (long/short) × Number of days × Pip Value
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <span className="font-medium">Measure:</span> Quote Currency
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
                  <span>Charged at <span className="font-semibold">22:00 GMT +0</span> in Winter, <span className="font-semibold">21:00 GMT +0</span> in Summer</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Triple swap for <span className="font-semibold">forex & metals</span> on <span className="font-semibold text-amber-700 dark:text-amber-400">Wednesdays</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Triple swap for <span className="font-semibold">other instruments</span> on <span className="font-semibold text-amber-700 dark:text-amber-400">Fridays</span></span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                <p className="font-semibold mb-2 text-teal">Buy orders:</p>
                <p className="text-sm text-muted-foreground">Use Long swap rate</p>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <p className="font-semibold mb-2 text-red-600 dark:text-red-400">Sell orders:</p>
                <p className="text-sm text-muted-foreground">Use Short swap rate</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-lg">
              <div className="flex gap-3 mb-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-sm text-blue-700 dark:text-blue-400">Tip profesional:</p>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Si mantienes posiciones durante varios días, los swaps pueden sumar significativamente. 
                Considera los swaps positivos para estrategias de carry trade y swaps negativos como un costo adicional en tus operaciones.
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
  );
}
