import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import CopyRiskDemo from "@/components/public/demos/CopyRiskDemo";

export default function CopyInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Copy Trading — Información";
    trackPageView("copy-info");
  }, [trackPageView]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold">Copiar con cabeza, no por moda.</h1>
        <p className="mt-3 opacity-80">
          El riesgo sigue siendo tuyo. Te damos criterios para elegir, dimensionar y dormir tranquilo.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/access")}>Validar afiliación</Button>
          <Button variant="outline" onClick={() => navigate("/copy-trading")}>Aprender a evaluar un perfil</Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Para quién es</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li>Personas con <b>tolerancia al riesgo clara</b> (low/med/high) que quieren perfiles acordes.</li>
          <li><b>Seguidores responsables</b> que entienden que copiar ≠ desentenderse.</li>
          <li><b>Diversificadores</b> que buscan consistencia y control de correlación.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">No es para</h2>
        <p className="opacity-90">Quien persigue rachas, sube tamaño por impulso o copia por simpatía.</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">Qué te llevas</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Perfiles por bandas de riesgo</b> con PF, DD y consistencia.</li>
          <li><b>Guía de límites</b>: stop diario, exposición total, correlación y "circuit breaker".</li>
          <li><b>Checklist honesto</b> para seleccionar sin sesgos.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Demo educativo</h2>
        <Card className="p-4">
          <CopyRiskDemo />
        </Card>
        <p className="mt-2 text-xs text-zinc-400">Simulación simple para decidir cuánto capital asignar a un perfil dado su DD histórico.</p>
      </section>

      <footer className="mt-10 text-xs text-zinc-400">
        Educativo. No garantizamos resultados. Respeta tus límites.
      </footer>
    </main>
  );
}