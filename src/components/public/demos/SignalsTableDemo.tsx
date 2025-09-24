import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SIGNALS } from "@/data/public-mocks/signals";

type SortKey = "pf" | "dd" | "winRate" | "rMultiple";

export default function SignalsTableDemo() {
  const [sortBy, setSortBy] = useState<SortKey>("pf");
  const [dir, setDir] = useState<"asc"|"desc">("desc");

  const rows = useMemo(() => {
    const data = [...SIGNALS];
    data.sort((a, b) => {
      const va = a[sortBy] as number;
      const vb = b[sortBy] as number;
      return dir === "asc" ? va - vb : vb - va;
    });
    return data;
  }, [sortBy, dir]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setSortBy("pf")}>PF</Button>
        <Button variant="outline" onClick={() => setSortBy("dd")}>DD</Button>
        <Button variant="outline" onClick={() => setSortBy("winRate")}>W/L%</Button>
        <Button variant="outline" onClick={() => setSortBy("rMultiple")}>R múltiple</Button>
        <Button onClick={() => setDir(d => d === "asc" ? "desc" : "asc")}>
          {dir === "asc" ? "Asc" : "Desc"}
        </Button>
      </div>

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-400">
            <tr className="border-b border-zinc-800">
              <th className="p-3">Señal</th>
              <th className="p-3">PF</th>
              <th className="p-3">DD%</th>
              <th className="p-3">W/L%</th>
              <th className="p-3">R</th>
              <th className="p-3">Muestra</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.name} className="border-b border-zinc-900">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.pf.toFixed(2)}</td>
                <td className="p-3">{r.dd.toFixed(1)}</td>
                <td className="p-3">{r.winRate}%</td>
                <td className="p-3">{r.rMultiple.toFixed(1)}</td>
                <td className="p-3">{r.sample}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}