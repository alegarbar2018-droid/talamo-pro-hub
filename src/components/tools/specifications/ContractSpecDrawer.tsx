import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SpecificationRow } from "./SpecificationRow";
import { useContractSpec } from "@/hooks/useContractSpec";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Package, 
  Globe, 
  DollarSign, 
  Ruler, 
  Target,
  Clock,
  Percent,
  ZoomIn,
  TrendingDown,
  AlertCircle
} from "lucide-react";

interface ContractSpecDrawerProps {
  symbol: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractSpecDrawer({ symbol, open, onOpenChange }: ContractSpecDrawerProps) {
  const { data: spec, isLoading, error } = useContractSpec(symbol);

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error || !spec ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <p className="font-semibold text-lg">Error al cargar especificaciones</p>
              <p className="text-sm text-muted-foreground mt-1">
                No se pudieron cargar los datos del contrato
              </p>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal" />
                <span>{spec.symbol}</span>
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span>{spec.name}</span>
                <Badge variant="outline" className="ml-2">
                  {spec.asset_class}
                </Badge>
              </SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="general" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="costs">Costos</TabsTrigger>
                <TabsTrigger value="leverage">Apal.</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-1 mt-4">
                {spec.underlying_asset && (
                  <SpecificationRow
                    label="Activo Subyacente"
                    value={spec.underlying_asset}
                    icon={Package}
                    tooltip="El mercado o valor real al que se refiere este CFD"
                  />
                )}
                <SpecificationRow
                  label="Clase de Activo"
                  value={spec.asset_class}
                  icon={Globe}
                  tooltip="Categoría del instrumento financiero"
                />
                <SpecificationRow
                  label="Moneda Base"
                  value={spec.base_currency}
                  icon={DollarSign}
                  tooltip="Moneda principal en la que se cotiza el instrumento"
                />
                {spec.quote_currency && (
                  <SpecificationRow
                    label="Moneda de Cotización"
                    value={spec.quote_currency}
                    icon={DollarSign}
                    tooltip="Segunda moneda del par (para Forex)"
                  />
                )}
                <SpecificationRow
                  label="Tamaño de Contrato"
                  value={spec.contract_size.toLocaleString()}
                  unit="unidades"
                  icon={Ruler}
                  tooltip="Cantidad de unidades que representa 1 lote estándar"
                />
              </TabsContent>

              <TabsContent value="trading" className="space-y-1 mt-4">
                <SpecificationRow
                  label="Valor del Pip"
                  value={`$${spec.pip_value}`}
                  unit="por lote"
                  icon={Target}
                  tooltip="Valor monetario de 1 pip para 1 lote estándar"
                  variant="positive"
                />
                <SpecificationRow
                  label="Posición del Pip"
                  value={spec.pip_position}
                  unit={spec.pip_position === 2 ? "(0.01)" : "(0.0001)"}
                  icon={ZoomIn}
                  tooltip="Número de decimales donde se encuentra el pip"
                />
                <SpecificationRow
                  label="Lote Mínimo"
                  value={spec.min_lot}
                  icon={TrendingDown}
                  tooltip="Tamaño mínimo de posición que puedes abrir"
                />
                <SpecificationRow
                  label="Lote Máximo"
                  value={spec.max_lot}
                  icon={TrendingUp}
                  tooltip="Tamaño máximo de posición permitido"
                />
                <SpecificationRow
                  label="Incremento de Lote"
                  value={spec.lot_step}
                  icon={Ruler}
                  tooltip="Incremento mínimo al ajustar el tamaño de posición"
                />
              </TabsContent>

              <TabsContent value="costs" className="space-y-1 mt-4">
                {spec.spread_typical !== null && (
                  <SpecificationRow
                    label="Spread Típico"
                    value={spec.spread_typical}
                    unit="pips"
                    icon={Target}
                    tooltip="Diferencia típica entre precio de compra y venta"
                    variant="warning"
                  />
                )}
                {spec.swap_long !== null && (
                  <SpecificationRow
                    label="Swap Long"
                    value={spec.swap_long}
                    unit="USD/lote/día"
                    icon={Clock}
                    tooltip="Costo o crédito por mantener posición de compra overnight"
                    variant={spec.swap_long > 0 ? "positive" : "negative"}
                  />
                )}
                {spec.swap_short !== null && (
                  <SpecificationRow
                    label="Swap Short"
                    value={spec.swap_short}
                    unit="USD/lote/día"
                    icon={Clock}
                    tooltip="Costo o crédito por mantener posición de venta overnight"
                    variant={spec.swap_short > 0 ? "positive" : "negative"}
                  />
                )}
              </TabsContent>

              <TabsContent value="leverage" className="space-y-1 mt-4">
                {spec.leverage_max !== null && (
                  <SpecificationRow
                    label="Apalancamiento Máximo"
                    value={`1:${spec.leverage_max}`}
                    icon={TrendingUp}
                    tooltip={`Con $100 puedes controlar hasta $${(100 * spec.leverage_max).toLocaleString()} en posiciones`}
                    variant="positive"
                  />
                )}
                {spec.margin_percentage !== null && (
                  <SpecificationRow
                    label="Margen Requerido"
                    value={`${spec.margin_percentage}%`}
                    icon={Percent}
                    tooltip="Porcentaje del valor de la posición que necesitas en tu cuenta como margen"
                  />
                )}
                {spec.leverage_max !== null && (
                  <div className="mt-4 p-4 rounded-lg bg-teal/5 border border-teal/20">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Ejemplo:</strong> Con apalancamiento 1:{spec.leverage_max}, 
                      si depositas $1,000 puedes controlar posiciones de hasta ${(1000 * spec.leverage_max).toLocaleString()} 
                      en este instrumento. Recuerda que mayor apalancamiento significa mayor riesgo.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
