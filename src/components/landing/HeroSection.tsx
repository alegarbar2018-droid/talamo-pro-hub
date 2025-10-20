import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('user-path-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-surface/30 to-background/95"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center space-y-6 md:space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 md:space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <div className="relative inline-block">
                <span className="text-foreground">Trading serio. </span>
                <span className="text-primary">Sin humo</span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1.5 bg-gradient-primary rounded-full opacity-60"></div>
              </div>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("hero_subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8"
          >
            <Button
              onClick={() => navigate("/faq")}
              variant="outline"
              className="group border-primary/20 hover:border-primary/50 hover:bg-primary/5"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Preguntas Frecuentes
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <span className="text-sm text-muted-foreground/80 font-medium tracking-wide">
              Descubre tu camino
            </span>
            <button
              onClick={scrollToNextSection}
              className="group relative"
              aria-label="Scroll to next section"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100" />
              
              {/* Button container */}
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background/40 backdrop-blur-sm border border-primary/20 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-background/60 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20">
                <ChevronDown className="h-6 w-6 text-primary animate-bounce group-hover:animate-none group-hover:translate-y-0.5 transition-all duration-300" />
              </div>
              
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
