import { motion } from "framer-motion";
import { Sparkles, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export const HeroSection = () => {
  const { t } = useTranslation("landing");

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface/30 to-background"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="text-center space-y-8 sm:space-y-12 md:space-y-16">
          
          {/* Premium badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-3 bg-surface/90 backdrop-blur-xl border-2 border-primary/20 text-primary px-8 py-4 rounded-2xl text-sm font-semibold shadow-lg shadow-primary/10"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            {t("exclusive_platform")}
            <Award className="w-4 h-4 text-primary" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight">
              <div className="relative">
                <div className="text-white">Trading serio.</div>
                <span className="text-primary">Sin humo</span>
                <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 h-1.5 sm:h-2 bg-gradient-primary rounded-full opacity-60"></div>
              </div>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium tracking-wide">
                {t("hero_subtitle")}
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal/30 via-primary/20 to-accent/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal to-primary"></div>
                    <span className="font-inter text-sm font-medium text-white tracking-wide">
                      Acceso Exclusivo
                    </span>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/20 to-teal/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                    <span className="font-inter text-sm font-medium text-white tracking-wide">
                      100% Transparente
                    </span>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 via-teal/20 to-primary/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-teal"></div>
                    <span className="font-inter text-sm font-medium text-white tracking-wide">
                      Riesgo Controlado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
