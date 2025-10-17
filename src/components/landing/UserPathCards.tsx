import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const UserPathCards = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 md:py-24 bg-background">      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("hero_user_question")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecciona tu camino y te guiaremos paso a paso
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          <Card 
            className="p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group bg-card/50 backdrop-blur-sm" 
            onClick={() => {
              document.getElementById('para-principiantes')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("hero_path_beginner")}</h3>
              <p className="text-muted-foreground">{t("hero_path_beginner_desc")}</p>
              <div className="pt-4">
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Ver más →
                </span>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group bg-card/50 backdrop-blur-sm border-2 border-primary/30" 
            onClick={() => navigate('/copy-info')}
            aria-label="Ir a información sobre Copy Trading"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("hero_path_investor")}</h3>
              <p className="text-muted-foreground">{t("hero_path_investor_desc")}</p>
              <div className="pt-4">
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Comenzar →
                </span>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group bg-card/50 backdrop-blur-sm" 
            onClick={() => navigate('/tools-info')}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("hero_path_experienced")}</h3>
              <p className="text-muted-foreground">{t("hero_path_experienced_desc")}</p>
              <div className="pt-4">
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Explorar →
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
