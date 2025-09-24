import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SizingDemo() {
  const [equity, setEquity] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [slPips, setSlPips] = useState(25);
  const [pipValue, setPipValue] = useState(10); // $10 por pip (lote estándar FX)

  const riskAmount = (equity * riskPct) / 100;
  const lots = slPips > 0 && pipValue > 0 ? +(riskAmount / (slPips * pipValue)).toFixed(2) : 0;

  return (
    <Card className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Equity ($)</Label><Input type="number" value={equity} onChange={e=>setEquity(+e.target.value)} /></div>
        <div><Label>% Riesgo</Label><Input type="number" value={riskPct} onChange={e=>setRiskPct(+e.target.value)} /></div>
        <div><Label>Stop (pips)</Label><Input type="number" value={slPips} onChange={e=>setSlPips(+e.target.value)} /></div>
        <div><Label>Valor del pip ($)</Label><Input type="number" value={pipValue} onChange={e=>setPipValue(+e.target.value)} /></div>
      </div>
      <p className="text-sm">Riesgo: <b>${riskAmount.toFixed(2)}</b> → Lotes sugeridos: <b>{lots}</b></p>
      <p className="text-xs text-zinc-400">Fórmula: Lotes = (Equity × %Riesgo) / (SL_pips × Valor_del_pip)</p>
    </Card>
  );
}