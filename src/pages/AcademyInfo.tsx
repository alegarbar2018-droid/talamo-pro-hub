import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import AcademyChecklistDemo from "@/components/public/demos/AcademyChecklistDemo";

export default function AcademyInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Academia — Información";
    trackPageView("academy-info");
  }, [trackPageView]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold">Aprender a operar, no a fantasear.</h1>
        <p className="mt-3 opacity-80">
          Estamos cansados del humo. Aquí se estudia para ejecutar con criterio y límites, como un negocio.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/access")}>Validar afiliación</Button>
          <Button variant="outline" onClick={() => navigate("/academy")}>Ver la malla completa</Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Para quién es</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Autodidactas serios</b> que quieren operar por su cuenta y medir su progreso.</li>
          <li><b>Reiniciadores</b> que buscan estructura y práctica real.</li>
          <li><b>Metódicos</b> de checklists, journal y revisiones semanales.</li>
          <li>Quienes valoran decir <i>"no opero hoy"</i> como decisión profesional.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">No es para</h2>
        <p className="opacity-90">Quien busca atajos, promesas de "vivir del trading en 30 días" o videos motivacionales sin práctica.</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-semibold">Qué te llevas</h2>
        <ul className="list-disc pl-6 space-y-1 opacity-95">
          <li><b>Ruta por niveles (M0–L4)</b> con objetivos claros y gating por seguridad.</li>
          <li><b>Entregables reales</b>: backtests, plan de riesgo, checklist operativo y journal.</li>
          <li><b>Rúbricas honestas</b>: qué es "bien", qué es "aún no" y cómo mejorar.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Así se ve por dentro</h2>
        <Card className="p-4">
          <p className="text-sm opacity-90 mb-3">
            Progreso por nivel, tareas con feedback, KPIs (PF, DD, R/R, consistencia) y plantillas descargables.
          </p>
          <AcademyChecklistDemo />
        </Card>
      </section>

      <footer className="mt-10 text-xs text-zinc-400">
        Contenido educativo. No es asesoría financiera.
      </footer>
    </main>
  );
}