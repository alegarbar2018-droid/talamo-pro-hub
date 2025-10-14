import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useContractSpecs } from "@/hooks/useContractSpec";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";

interface SymbolSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  onViewSpec?: (symbol: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function SymbolSelector({
  value,
  onValueChange,
  onViewSpec,
  label = "Símbolo",
  placeholder = "Selecciona un instrumento",
  className = "",
}: SymbolSelectorProps) {
  const { data: specs, isLoading, error } = useContractSpecs();

  // Group specs by asset class
  const groupedSpecs = useMemo(() => {
    if (!specs) return {};

    return specs.reduce((acc, spec) => {
      const assetClass = spec.asset_class || 'Otros';
      if (!acc[assetClass]) {
        acc[assetClass] = [];
      }
      acc[assetClass].push(spec);
      return acc;
    }, {} as Record<string, typeof specs>);
  }, [specs]);

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label>{label}</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label>{label}</Label>
        <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Error al cargar instrumentos</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="bg-input border-line/50">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedSpecs).map(([assetClass, classSpecs]) => (
                <SelectGroup key={assetClass}>
                  <SelectLabel className="text-teal font-semibold">
                    {assetClass}
                  </SelectLabel>
                  {classSpecs.map((spec) => (
                    <SelectItem key={spec.id} value={spec.symbol}>
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="font-medium">{spec.symbol}</span>
                        <span className="text-xs text-muted-foreground">
                          {spec.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {value && onViewSpec && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewSpec(value)}
            className="h-10 border-teal/30 hover:bg-teal/10 shrink-0"
          >
            <FileText className="w-4 h-4 mr-1" />
            Specs
          </Button>
        )}
      </div>
    </div>
  );
}
