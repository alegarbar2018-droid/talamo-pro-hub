import { useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RiskCalculator() {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [pipValue, setPipValue] = useState(10);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const riskAmount = balance * (riskPercent / 100);
    const lotSize = riskAmount / (stopLossPips * pipValue);
    setResult(lotSize);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Saldo de cuenta ($)</Label>
          <Input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            min={100}
          />
        </div>

        <div>
          <Label>Riesgo por trade (%)</Label>
          <Input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>

        <div>
          <Label>Stop Loss (pips)</Label>
          <Input
            type="number"
            value={stopLossPips}
            onChange={(e) => setStopLossPips(Number(e.target.value))}
            min={1}
          />
        </div>

        <div>
          <Label>Valor del pip ($)</Label>
          <Input
            type="number"
            value={pipValue}
            onChange={(e) => setPipValue(Number(e.target.value))}
            min={0.01}
            step={0.01}
          />
        </div>
      </div>

      <Button onClick={calculate} className="w-full">
        <Calculator className="w-4 h-4 mr-2" />
        Calcular Tamaño de Posición
      </Button>

      {result !== null && (
        <Card className="bg-gradient-to-br from-teal/10 to-cyan/10 border-teal/20">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Tamaño de posición recomendado</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
              {result.toFixed(2)} lotes
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Riesgo en $: <strong>${(balance * (riskPercent / 100)).toFixed(2)}</strong>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}