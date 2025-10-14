import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Scale, Zap } from "lucide-react";
import type { ContractSpec } from "@/hooks/useContractSpec";

interface ContractSpecCardProps {
  spec: ContractSpec;
  onViewDetails?: (symbol: string) => void;
}

export function ContractSpecCard({ spec, onViewDetails }: ContractSpecCardProps) {
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

  return (
    <Card className="border-line hover:border-teal/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{spec.symbol}</CardTitle>
              <Badge className={getAssetClassColor(spec.asset_class)}>
                {spec.asset_class}
              </Badge>
            </div>
            <CardDescription className="text-sm">{spec.name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Valor del Pip</p>
              <p className="font-medium">${spec.pip_value}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Contrato</p>
              <p className="font-medium">{spec.contract_size?.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Apalancamiento</p>
              <p className="font-medium">1:{spec.leverage_max}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Spread Típico</p>
              <p className="font-medium">{spec.spread_typical || "N/A"} pips</p>
            </div>
          </div>
        </div>

        {onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-teal/30 hover:bg-teal/10"
            onClick={() => onViewDetails(spec.symbol)}
          >
            Ver Especificaciones Completas
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
