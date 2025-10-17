import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const UserPathCards = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="mt-16 text-center"
    >
      <p className="text-lg text-muted-foreground mb-8">
        {t("hero_user_question")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card 
          className="p-6 hover:border-primary/50 transition-all cursor-pointer group" 
          onClick={() => {
            document.getElementById('para-principiantes')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }}
        >
          <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-foreground mb-2">{t("hero_path_beginner")}</h3>
          <p className="text-sm text-muted-foreground">{t("hero_path_beginner_desc")}</p>
        </Card>
        
        <Card 
          className="p-6 hover:border-primary/50 transition-all cursor-pointer group" 
          onClick={() => navigate('/copy-info')}
        >
          <Users className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-foreground mb-2">{t("hero_path_investor")}</h3>
          <p className="text-sm text-muted-foreground">{t("hero_path_investor_desc")}</p>
        </Card>
        
        <Card 
          className="p-6 hover:border-primary/50 transition-all cursor-pointer group" 
          onClick={() => navigate('/tools-info')}
        >
          <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-foreground mb-2">{t("hero_path_experienced")}</h3>
          <p className="text-sm text-muted-foreground">{t("hero_path_experienced_desc")}</p>
        </Card>
      </div>
    </motion.div>
  );
};
