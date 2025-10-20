import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Zap, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AcademyHero() {
  const navigate = useNavigate();
  const { t } = useTranslation('academy');

  const scrollToSyllabus = () => {
    const syllabusElement = document.getElementById('syllabus-section');
    syllabusElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20 pb-16"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-surface/90 backdrop-blur-xl border border-primary/20 text-primary px-6 py-3 rounded-2xl text-sm font-semibold mb-8"
          >
            <GraduationCap className="w-4 h-4" />
            {t('hero.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-8"
          >
            <span className="text-foreground">{t('hero.title_part1')}</span>
            <br />
            <span className="text-red-400">{t('hero.title_part2')}</span>
            <span className="text-foreground"> {t('hero.title_part3')}</span>
            <br />
            <span className="text-red-400">{t('hero.title_part4')}</span>
            <br />
            <span className="text-primary">{t('hero.title_part5')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg"
              onClick={() => navigate("/access")}
              className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-6 h-auto rounded-2xl group"
            >
              <Zap className="w-5 h-5 mr-2" />
              {t('hero.cta_primary')}
            </Button>
            <Button 
              size="lg"
              variant="ghost" 
              onClick={scrollToSyllabus}
              className="text-primary hover:text-primary/80 hover:bg-primary/5 text-base px-6 py-6 h-auto rounded-2xl"
            >
              {t('hero.cta_secondary')}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}