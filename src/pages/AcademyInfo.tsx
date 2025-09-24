import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import AcademyChecklistDemo from "@/components/public/demos/AcademyChecklistDemo";
import SyllabusDetailed from "@/components/SyllabusDetailed";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyProblems from "@/components/academy/AcademyProblems";
import AcademyDifference from "@/components/academy/AcademyDifference";
import { BookOpen } from "lucide-react";

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
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
          <AcademyDifference />

          {/* Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 mt-20"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-white">Así funciona por dentro</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Progreso medible, tareas con criterios objetivos, KPIs reales y herramientas descargables.
              </p>
            </div>
            
            <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8">
              <AcademyChecklistDemo />
            </Card>
          </motion.div>

          {/* Temario completo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SyllabusDetailed />
          </motion.div>

          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground">
                <b className="text-white">Aviso:</b> Contenido educativo. No es asesoría financiera.
              </p>
            </div>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}