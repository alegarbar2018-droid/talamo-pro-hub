import { useEffect } from "react";
import { motion } from "framer-motion";
import { useObservability } from "@/components/business/ObservabilityProvider";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import SyllabusDetailed from "@/components/SyllabusDetailed";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyProblems from "@/components/academy/AcademyProblems";
import AcademyOverview from "@/components/academy/AcademyOverview";

export default function AcademyInfo() {
  const { trackPageView } = useObservability();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('academy.title') + " — " + t('academy.subtitle');
    trackPageView("academy-info");
  }, [trackPageView, t]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative">
        {/* Hero simplificado */}
        <AcademyHero />

        {/* Problemas del mercado (scannable) */}
        <AcademyProblems />

        {/* Overview: Diferencia + Journey + CTA */}
        <AcademyOverview />

        {/* Temario detallado (colapsable) */}
        <SyllabusDetailed />

        {/* Footer con disclaimer legal */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 px-6"
        >
          <div className="max-w-4xl mx-auto bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-8">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{t('academy.disclaimer.title')}:</strong> {t('academy.disclaimer.text')}
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}