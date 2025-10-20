import { useEffect } from "react";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyValueProposition from "@/components/academy/AcademyValueProposition";
import AcademyJourneySimple from "@/components/academy/AcademyJourneySimple";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AcademyInfo() {
  const { trackPageView } = useObservability();
  const navigate = useNavigate();
  
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

        {/* CTA Section */}
        <section className="py-20 px-6 relative overflow-hidden">
          {/* Premium background design */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated gradient orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-accent/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            
            {/* Radial lines pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_50%,rgb(var(--primary)_/_0.03)_50%,rgb(var(--primary)_/_0.03)_51%,transparent_51%)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
            
            {/* Decorative elements */}
            <div className="absolute top-20 left-1/4 w-32 h-32 border-2 border-primary/10 rounded-3xl rotate-12 animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-20 right-1/4 w-40 h-40 border border-accent/10 rounded-2xl -rotate-12 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
          </div>

          <div className="max-w-4xl mx-auto relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-xl rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Comienza tu transformación</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                ¿Estás listo para comenzar?
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Únete a cientos de traders que ya están transformando su forma de operar. 
                El primer paso hacia el trading profesional comienza aquí.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] transition-all duration-300"
                  onClick={() => navigate('/academy')}
                >
                  Comenzar ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  onClick={() => navigate('/register')}
                >
                  Crear cuenta gratis
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-1">100+</div>
                  <div className="text-sm text-muted-foreground">Lecciones</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Niveles</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Acceso</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
