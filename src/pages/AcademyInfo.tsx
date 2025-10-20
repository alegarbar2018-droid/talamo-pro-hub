import { useEffect } from "react";
import { motion } from "framer-motion";
import { useObservability } from "@/components/business/ObservabilityProvider";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyValueProposition from "@/components/academy/AcademyValueProposition";
import AcademyJourneySimple from "@/components/academy/AcademyJourneySimple";
import SyllabusDetailed from "@/components/SyllabusDetailed";

export default function AcademyInfo() {
  const { trackPageView } = useObservability();
  const { t } = useTranslation('academy');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t('title') + " — " + t('subtitle');
    trackPageView("academy-info");
  }, [trackPageView, t]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero */}
        <AcademyHero />

        {/* Value Proposition */}
        <AcademyValueProposition />

        {/* Learning Journey */}
        <AcademyJourneySimple />

        {/* Syllabus */}
        <SyllabusDetailed />

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-32 px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Listo para empezar
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Únete a cientos de traders que están aprendiendo con información real y verificable
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/access?intent=academy")}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-12 py-7 h-auto text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Comenzar mi formación
            </Button>
          </div>
        </motion.section>

        {/* Footer disclaimer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 px-6 border-t border-primary/10"
        >
          <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">{t('disclaimer.title')}:</strong> {t('disclaimer.text')}
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
