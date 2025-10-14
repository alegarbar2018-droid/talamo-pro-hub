import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ContractSpecGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full mb-4 flex items-center gap-2">
          <Info className="h-4 w-4" />
          {isOpen ? "Ocultar" : "Ver"} Guía de Especificaciones
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mb-6 border-teal/20 bg-teal/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-teal" />
              Guía Rápida de Especificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-teal">Ejemplo: Forex (EURUSD)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Symbol:</strong> EURUSD</li>
                <li>• <strong>Name:</strong> Euro vs US Dollar</li>
                <li>• <strong>Underlying Asset:</strong> Par de divisas EUR/USD</li>
                <li>• <strong>Asset Class:</strong> forex</li>
                <li>• <strong>Contract Size:</strong> 100000</li>
                <li>• <strong>Pip Position:</strong> 4 (0.0001)</li>
                <li>• <strong>Pip Value:</strong> 10 (por lote estándar)</li>
                <li>• <strong>Base Currency:</strong> EUR</li>
                <li>• <strong>Quote Currency:</strong> USD</li>
                <li>• <strong>Min Lot:</strong> 0.01</li>
                <li>• <strong>Max Lot:</strong> 100</li>
                <li>• <strong>Leverage Max:</strong> 500</li>
                <li>• <strong>Margin %:</strong> 0.2 (para 1:500)</li>
                <li>• <strong>Spread Typical:</strong> 1.5 (pips)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-blue-500">Ejemplo: Crypto (BTCUSD)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Symbol:</strong> BTCUSD</li>
                <li>• <strong>Name:</strong> Bitcoin</li>
                <li>• <strong>Underlying Asset:</strong> Bitcoin cryptocurrency</li>
                <li>• <strong>Asset Class:</strong> crypto</li>
                <li>• <strong>Contract Size:</strong> 1</li>
                <li>• <strong>Pip Position:</strong> 2 (0.01)</li>
                <li>• <strong>Pip Value:</strong> 0.01</li>
                <li>• <strong>Base Currency:</strong> BTC</li>
                <li>• <strong>Quote Currency:</strong> USD</li>
                <li>• <strong>Leverage Max:</strong> 100</li>
                <li>• <strong>Spread Typical:</strong> 50 (USD)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-500">Ejemplo: Índice (US30)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Symbol:</strong> US30</li>
                <li>• <strong>Name:</strong> Dow Jones Industrial Average</li>
                <li>• <strong>Underlying Asset:</strong> Dow Jones 30 Index</li>
                <li>• <strong>Asset Class:</strong> indices</li>
                <li>• <strong>Contract Size:</strong> 10</li>
                <li>• <strong>Pip Position:</strong> 0 (1 punto = 1 pip)</li>
                <li>• <strong>Base Currency:</strong> USD</li>
                <li>• <strong>Leverage Max:</strong> 200</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-line">
              <h4 className="font-semibold mb-2">Notas Importantes:</h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>• <strong>Contract Size:</strong> Para forex es típicamente 100,000. Para crypto puede ser 1.</li>
                <li>• <strong>Pip Position:</strong> Forex = 4 (0.0001), JPY pairs = 2 (0.01), Crypto = 2</li>
                <li>• <strong>Pip Value:</strong> Se calcula: (Pip Position / Contract Size). Para forex estándar = 10</li>
                <li>• <strong>Margin %:</strong> Es 100 / Leverage. Para 1:500 = 0.2%</li>
                <li>• <strong>Spread:</strong> En pips para forex, en puntos para índices, en USD para crypto</li>
                <li>• <strong>Swap:</strong> Puede ser positivo (recibes) o negativo (pagas) según dirección</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
