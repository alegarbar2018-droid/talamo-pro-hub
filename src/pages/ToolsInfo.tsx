import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import SizingDemo from "@/components/public/demos/SizingDemo";

export default function ToolsInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Herramientas — Información";
    trackPageView("tools-info");
  }, [trackPageView]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold">Menos errores. Mejor ejecución.</h1>
        <p className="mt-3 opacity-80">
          Calculadoras y utilidades que convierten criterios en números y límites reales.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/access")}>Validar afiliación</Button>
          <Button variant="outline" onClick={() => navigate("/tools")}>Explorar calculadoras</Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Para quién es</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Operadores operativos</b> que quieren automatizar lo repetible (sizing, pip, margen).</li>
          <li><b>Disciplinados</b> que prefieren que el sistema frene cuando se rompen reglas.</li>
          <li><b>Revisores</b> que documentan y mejoran decisiones con bitácora y expectativa.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">No es para</h2>
        <p className="opacity-90">Quien decide por impulso, ignora el calendario y no lleva registro.</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">Qué te llevas</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Sizing sin adivinar</b>: lotes por % riesgo, SL y valor del pip.</li>
          <li><b>Panel de drawdown</b> con "circuit breakers".</li>
          <li><b>Position heat y calendario</b> para controlar exposición y eventos.</li>
          <li><b>Exports</b> para tu journal y revisión semanal.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Demo educativo</h2>
        <Card className="p-4">
          <SizingDemo />
        </Card>
        <p className="mt-2 text-xs text-zinc-400">Fórmula: Lotes = (Equity × %Riesgo) / (SL_pips × Valor_del_pip).</p>
      </section>

      <footer className="mt-10 text-xs text-zinc-400">
        Contenido educativo. No es asesoría financiera.
      </footer>
    </main>
  );
}