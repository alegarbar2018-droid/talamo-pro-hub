import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import AcademyChecklistDemo from "@/components/public/demos/AcademyChecklistDemo";
import SyllabusDetailed from "@/components/SyllabusDetailed";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyValueProposition from "@/components/academy/AcademyValueProposition";
import AcademyJourneySimple from "@/components/academy/AcademyJourneySimple";
import { BookOpen } from "lucide-react";
export default function AcademyInfo() {
  const {
    trackPageView
  } = useObservability();
  useEffect(() => {
    document.title = "Academia — Información";
    trackPageView("academy-info");
  }, [trackPageView]);
  return <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
      </div>
      
      <main className="relative">
        {/* Hero renovado */}
        <AcademyHero />

        {/* Value Proposition */}
        <AcademyValueProposition />

        {/* Journey Path */}
        <AcademyJourneySimple />

        {/* Syllabus Section */}
        <section className="py-20 px-6 relative overflow-hidden min-h-screen flex items-center">
          {/* Premium background design */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated gradient orbs */}
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-accent/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '11s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-primary/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '13s', animationDelay: '2s' }} />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb)_/_0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb)_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
            
            {/* Decorative elements */}
            <div className="absolute top-32 right-32 w-20 h-20 border-2 border-accent/10 rounded-2xl rotate-12 animate-pulse" style={{ animationDuration: '7s' }} />
            <div className="absolute bottom-40 left-40 w-16 h-16 border border-primary/10 rounded-lg -rotate-12 animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-accent/10 rounded-full animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          <div className="max-w-6xl mx-auto relative w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Contenido Completo</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Syllabus Detallado
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Explora todas las lecciones, objetivos y prácticas de cada nivel
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <SyllabusDetailed />
            </motion.div>
          </div>
        </section>

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
    </div>;
}