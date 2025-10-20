import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, TrendingUp, Sparkles, ArrowRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const UserPathCards = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();

  return (
    <section id="user-path-section" className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-gradient-to-b from-background via-background/95 to-background overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Elige tu camino ideal</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("hero_user_question")}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Selecciona tu camino y te guiaremos paso a paso hacia el éxito
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Beginner Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ y: -12, scale: 1.02 }}
          >
            <Card 
              className="relative p-8 md:p-10 cursor-pointer group overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-2 border-border hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20"
              onClick={() => {
                document.getElementById('para-principiantes')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <GraduationCap className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {t("hero_path_beginner")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t("hero_path_beginner_desc")}
                  </p>
                </div>
                
                <div className="pt-4 flex items-center justify-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300">
                  <span>Ver más</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Investor Card - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            whileHover={{ y: -12, scale: 1.02 }}
          >
            <Card 
              className="relative p-8 md:p-10 cursor-pointer group overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card border-3 border-primary/50 hover:border-primary transition-all duration-500 shadow-2xl hover:shadow-3xl shadow-primary/30 hover:shadow-primary/40"
              onClick={() => navigate('/copy-info')}
              aria-label="Ir a información sobre Copy Trading"
            >
              {/* Premium badge */}
              <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 font-semibold px-3 py-1">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Popular
              </Badge>
              
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/40 rounded-3xl blur-2xl group-hover:blur-3xl animate-pulse transition-all duration-500" />
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary/30 to-primary/20 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-primary/30">
                    <Users className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {t("hero_path_investor")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t("hero_path_investor_desc")}
                  </p>
                </div>
                
                <div className="pt-4 flex items-center justify-center gap-2 text-primary font-bold group-hover:gap-4 transition-all duration-300">
                  <span>Comenzar ahora</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Experienced Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ y: -12, scale: 1.02 }}
          >
            <Card 
              className="relative p-8 md:p-10 cursor-pointer group overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-2 border-border hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20"
              onClick={() => navigate('/tools-info')}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <TrendingUp className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {t("hero_path_experienced")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t("hero_path_experienced_desc")}
                  </p>
                </div>
                
                <div className="pt-4 flex items-center justify-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300">
                  <span>Explorar</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
