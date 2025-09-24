import { useEffect, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Task = { id: string; label: string; done: boolean };

const STORAGE_KEY = "academy_checklist_v1";

const initial: Task[] = [
  { id: "m0-security", label: "M0: Seguridad (2FA, backups, límites)", done: false },
  { id: "journal-setup", label: "Configurar journal y plantilla de revisión", done: false },
  { id: "risk-plan", label: "Escribir plan de riesgo (1% por trade)", done: false },
  { id: "bt-50", label: "Backtest mínimo 50 trades (reglas simples)", done: false },
];

export default function AcademyChecklistDemo() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : initial;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const progress = useMemo(() => {
    const done = tasks.filter(t => t.done).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks]);

  function toggle(id: string) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function reset() {
    setTasks(initial);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Progress value={progress} className="w-full" />
        <span className="text-sm opacity-80">{progress}%</span>
      </div>
      <Card className="p-4 space-y-2">
        {tasks.map(t => (
          <label key={t.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              className="size-4 accent-cyan-500"
              aria-label={t.label}
            />
            <span className={t.done ? "line-through opacity-60" : ""}>{t.label}</span>
          </label>
        ))}
      </Card>
      <Button variant="outline" onClick={reset}>Reiniciar demo</Button>
    </div>
  );
}