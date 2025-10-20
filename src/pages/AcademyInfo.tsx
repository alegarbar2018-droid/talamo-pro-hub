import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import SyllabusDetailed from "@/components/SyllabusDetailed";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyProblems from "@/components/academy/AcademyProblems";
import AcademyDifference from "@/components/academy/AcademyDifference";
import AcademyJourney from "@/components/academy/AcademyJourney";

export default function AcademyInfo() {
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Academia — Información";
    trackPageView("academy-info");
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative">
        {/* Hero renovado */}
        <AcademyHero />

        {/* Crítica al mercado */}
        <AcademyProblems />

        {/* Nuestra diferencia */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-12">
          <AcademyDifference />
        </div>

        {/* Ruta de aprendizaje visual */}
        <AcademyJourney />

        {/* Temario completo detallado */}
        <SyllabusDetailed />

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 px-6"
        >
          <div className="max-w-4xl mx-auto bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-8">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Aviso Legal:</strong> Este contenido es únicamente educativo y no constituye asesoría financiera. 
              El trading conlleva riesgos significativos y puede no ser adecuado para todos. 
              Operar con apalancamiento puede resultar en la pérdida total de tu capital.
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}