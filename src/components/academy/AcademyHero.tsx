import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Zap, ChevronDown, BookOpen, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAcademyStats } from "@/hooks/useAcademyStats";
import { useState } from "react";
import LessonPreviewModal from "./LessonPreviewModal";

export default function AcademyHero() {
  const { t } = useTranslation('academy');
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { totalCourses, totalLessons, totalHours, activeStudents } = useAcademyStats();

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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-5xl mx-auto text-center px-6"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/40 text-lg px-6 py-2 shadow-lg hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-5 h-5 mr-2" />
            {t('hero.badge')}
          </Badge>
          <Badge className="bg-surface/60 backdrop-blur-xl border border-primary/30 text-base px-4 py-2">
            Actualizado {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </Badge>
        </div>

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

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-medium">{totalCourses} cursos</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium">{totalLessons} lecciones • {totalHours}h contenido</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">{activeStudents}+ estudiantes</span>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate("/access?intent=academy")}
            className="group bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow px-10 py-7 h-auto text-lg rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Comenzar mi formación
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="border-2 border-primary/40 hover:bg-surface/60 px-10 py-7 h-auto text-lg rounded-2xl transition-all duration-300 hover:scale-105"
          >
            Ver lección demo (sin registro)
          </Button>
        </div>

        <button
          onClick={scrollToSyllabus}
          className="mt-8 text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2 mx-auto"
        >
          <span>Ver temario completo</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </motion.div>

      <LessonPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
    </motion.section>
  );
}
