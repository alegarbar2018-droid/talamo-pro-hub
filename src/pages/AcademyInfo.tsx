import { useEffect } from "react";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyValueProposition from "@/components/academy/AcademyValueProposition";
import AcademyJourneySimple from "@/components/academy/AcademyJourneySimple";
import AcademyChecklistDemo from "@/components/public/demos/AcademyChecklistDemo";
import { motion } from "framer-motion";

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

        {/* Value Proposition */}
        <AcademyValueProposition />

        {/* Journey Path */}
        <AcademyJourneySimple />

        {/* Demo Section */}
        <section className="py-20 px-6 relative overflow-hidden">
          {/* Premium background design */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated gradient orbs */}
            <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-accent/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            
            {/* Dotted pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(var(--primary)_/_0.05)_1px,transparent_0)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Prueba la experiencia
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Experimenta cómo funciona nuestro sistema de seguimiento de progreso
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AcademyChecklistDemo />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
