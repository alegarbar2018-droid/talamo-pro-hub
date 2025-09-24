import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CopyRiskDemo() {
  const [equity, setEquity] = useState(10000);
  const [histDD, setHistDD] = useState(20);   // DD histórico del perfil (%)
  const [targetDD, setTargetDD] = useState(10); // DD máximo que acepto (%)

  const allocPct = useMemo(() => {
    if (histDD <= 0) return 0;
    const pct = Math.min(100, (targetDD / histDD) * 100);
    return Math.max(0, pct);
  }, [histDD, targetDD]);

  const allocUsd = useMemo(() => +(equity * (allocPct / 100)).toFixed(2), [equity, allocPct]);

  return (
    <Card className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Equity ($)</Label>
          <Input type="number" value={equity} onChange={e => setEquity(+e.target.value)} />
        </div>
        <div>
          <Label>DD histórico del perfil (%)</Label>
          <Input type="number" value={histDD} onChange={e => setHistDD(+e.target.value)} />
        </div>
        <div>
          <Label>Mi DD máximo permitido (%)</Label>
          <Input type="number" value={targetDD} onChange={e => setTargetDD(+e.target.value)} />
        </div>
        <div className="flex items-end">
          <div className="text-sm">
            <div>Asignación sugerida: <b>{allocPct.toFixed(1)}%</b></div>
            <div>≈ <b>${allocUsd}</b></div>
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-400">
        Heurística educativa: si un perfil tuvo DD histórico de Y% y tu límite es Z%, asigna ~Z/Y de tu capital (cap 100%).
      </p>
    </Card>
  );
}