import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Activity,
  Wallet,
  ChevronDown,
  Globe,
  Clock,
  DollarSign,
  BarChart3,
  Package,
  Scale,
  TrendingDown,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SpecificationRow } from "./SpecificationRow";
import { useTranslation } from "react-i18next";
import type { ContractSpec } from "@/hooks/useContractSpec";
import { nf } from "@/lib/locale";

interface ContractSpecCardProps {
  spec: ContractSpec;
}

export function ContractSpecCard({ spec }: ContractSpecCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const assetClassColors: Record<string, string> = {
    forex: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    crypto: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    indices: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    commodities: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    stocks: "bg-teal/10 text-teal border-teal/20"
  };

  const spreadColor = spec.spread_typical && spec.spread_typical > 3 ? "warning" : "default";
  const swapLongColor = (spec.swap_long ?? 0) > 0 ? "positive" : "negative";
  const swapShortColor = (spec.swap_short ?? 0) > 0 ? "positive" : "negative";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 border-line/50 hover:border-teal/30 bg-gradient-to-br from-teal/5 via-transparent to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 group-hover:from-teal/30 group-hover:to-teal/10 transition-all">
              <TrendingUp className="w-6 h-6 text-teal" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{spec.symbol}</h3>
              <p className="text-sm text-muted-foreground">{spec.name}</p>
            </div>
          </div>
          <Badge variant="outline" className={`capitalize ${assetClassColors[spec.asset_class] || ""}`}>
            {spec.asset_class}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <MetricPill
              label="Apalancamiento"
              value={`1:${spec.leverage_max || 500}`}
              icon={Zap}
            />
            <MetricPill
              label="Spread"
              value={spec.spread_typical ? `${spec.spread_typical}` : "N/A"}
              icon={Activity}
              variant={spreadColor}
            />
            <MetricPill
              label="Margen"
              value={spec.margin_percentage ? `${spec.margin_percentage}%` : "N/A"}
              icon={Wallet}
            />
          </div>

          {/* Expandable Details */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-teal transition-colors"
              >
                <span className="text-sm font-medium">
                  {isOpen ? "Ocultar detalles" : "Ver detalles"}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4"
                  >
                    <Tabs defaultValue="general" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="trading">Trading</TabsTrigger>
                        <TabsTrigger value="costs">Costos</TabsTrigger>
                        <TabsTrigger value="leverage">Apalancamiento</TabsTrigger>
                      </TabsList>

                      <TabsContent value="general" className="space-y-2 mt-0">
                        <SpecificationRow
                          label="Símbolo"
                          value={spec.symbol}
                          icon={BarChart3}
                          tooltip="Identificador único del instrumento financiero"
                        />
                        <SpecificationRow
                          label="Nombre"
                          value={spec.name}
                          icon={Globe}
                          tooltip="Nombre completo del instrumento"
                        />
                        <SpecificationRow
                          label="Clase de Activo"
                          value={spec.asset_class}
                          icon={Package}
                          tooltip="Categoría del instrumento: forex, crypto, índices, commodities o acciones"
                        />
                      </TabsContent>

                      <TabsContent value="trading" className="space-y-2 mt-0">
                        <SpecificationRow
                          label="Tamaño de Contrato"
                          value={nf('es').format(spec.contract_size)}
                          icon={Package}
                          tooltip="Cantidad estándar de unidades en un contrato. Para forex, típicamente 100,000 unidades de la moneda base"
                        />
                        <SpecificationRow
                          label="Valor del Pip"
                          value={nf('es').format(spec.pip_value)}
                          unit="por lote"
                          icon={DollarSign}
                          tooltip="Valor monetario de 1 pip de movimiento en el precio"
                        />
                        <SpecificationRow
                          label="Posición del Pip"
                          value={spec.pip_position}
                          unit={`decimales (${Math.pow(10, -spec.pip_position)})`}
                          icon={Activity}
                          tooltip="Número de decimales que representa 1 pip. 4 decimales = 0.0001"
                        />
                        <SpecificationRow
                          label="Lote Mínimo"
                          value={spec.min_lot}
                          icon={Scale}
                          tooltip="Tamaño mínimo de operación permitido"
                        />
                        <SpecificationRow
                          label="Lote Máximo"
                          value={spec.max_lot}
                          icon={Scale}
                          tooltip="Tamaño máximo de operación permitido"
                        />
                      </TabsContent>

                      <TabsContent value="costs" className="space-y-2 mt-0">
                        <SpecificationRow
                          label="Spread Típico"
                          value={spec.spread_typical ? `${spec.spread_typical}` : "N/A"}
                          unit="pips"
                          icon={Activity}
                          variant={spreadColor}
                          tooltip="Diferencia promedio entre precio de compra y venta. Representa el costo inmediato de la operación"
                        />
                        <SpecificationRow
                          label="Swap Long"
                          value={spec.swap_long ?? "N/A"}
                          unit="puntos"
                          icon={TrendingUp}
                          variant={swapLongColor}
                          tooltip="Cargo o crédito por mantener una posición de COMPRA overnight. Positivo = recibes, Negativo = pagas"
                        />
                        <SpecificationRow
                          label="Swap Short"
                          value={spec.swap_short ?? "N/A"}
                          unit="puntos"
                          icon={TrendingDown}
                          variant={swapShortColor}
                          tooltip="Cargo o crédito por mantener una posición de VENTA overnight. Positivo = recibes, Negativo = pagas"
                        />
                      </TabsContent>

                      <TabsContent value="leverage" className="space-y-2 mt-0">
                        <SpecificationRow
                          label="Apalancamiento Máximo"
                          value={`1:${spec.leverage_max || 500}`}
                          icon={Zap}
                          tooltip="Multiplicador que te permite controlar posiciones más grandes con menos capital. 1:500 = $100 controlan $50,000"
                        />
                        <SpecificationRow
                          label="Margen Requerido"
                          value={spec.margin_percentage ?? "N/A"}
                          unit="%"
                          icon={Wallet}
                          tooltip="Porcentaje del valor total que debes depositar como garantía. 0.2% significa $200 por cada $100,000 de exposición"
                        />
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MetricPillProps {
  label: string;
  value: string;
  icon: typeof Zap;
  variant?: "default" | "warning";
}

function MetricPill({ label, value, icon: Icon, variant = "default" }: MetricPillProps) {
  const variantClasses = {
    default: "border-line/50 hover:border-teal/50",
    warning: "border-amber-500/30 hover:border-amber-500/50"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`px-3 py-2 rounded-xl bg-surface border ${variantClasses[variant]} hover:shadow-lg transition-all flex flex-col items-center gap-1`}
    >
      <Icon className="h-4 w-4 text-teal" />
      <p className="text-xs text-muted-foreground text-center">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </motion.div>
  );
}
