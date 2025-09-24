import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import SignalsTableDemo from "@/components/public/demos/SignalsTableDemo";

export default function SignalsInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Señales — Información";
    trackPageView("signals-info");
  }, [trackPageView]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold">Señales con reglas, no con cuentos.</h1>
        <p className="mt-3 opacity-80">
          Si no podemos explicar por qué existe una señal y qué riesgo asume, no la publicamos.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/access")}>Validar afiliación</Button>
          <Button variant="outline" onClick={() => navigate("/signals")}>Cómo evaluamos una señal</Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Para quién es</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Pragmáticos</b> que no quieren aprender todo el proceso, pero sí operar con criterios claros.</li>
          <li><b>Inseguros en la entrada</b> que necesitan reglas y métricas visibles.</li>
          <li><b>Ocupados</b> que prefieren un feed educativo con contexto, no "compra ya".</li>
        </ul>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">No es para</h2>
        <p className="opacity-90">Quien busca FOMO o alertas sin leer reglas ni respetar límites de riesgo.</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">Qué te llevas</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Fichas transparentes</b>: reglas, timeframe, ejemplos y sesgos.</li>
          <li><b>Métricas a la vista</b>: PF, DD, R/R, W/L y tamaño de muestra.</li>
          <li><b>Alertas opt‑in</b> con contexto educativo.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Demo educativo</h2>
        <Card className="p-4">
          <SignalsTableDemo />
        </Card>
        <p className="mt-2 text-xs text-zinc-400">Datos ficticios realistas; uso educativo.</p>
      </section>

      <footer className="mt-10 text-xs text-zinc-400">
        Educativo. No es recomendación de inversión. Gestiona tu riesgo.
      </footer>
    </main>
  );
}