import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, PlayCircle, BookOpen, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAcademyStats } from "@/hooks/useAcademyStats";
import { useState } from "react";
import LessonPreviewModal from "./LessonPreviewModal";

export default function AcademyHero() {
  const { t } = useTranslation('academy');
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { totalCourses, totalLessons, totalHours, activeStudents } = useAcademyStats();

  return (
    <>
      <section className="pt-32 pb-24 px-6 relative">
        {/* Minimal background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center relative"
        >
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
            <span className="text-foreground">Aprende trading</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              sin promesas falsas
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Educación basada en datos reales, sin gurus ni estrategias mágicas
          </p>

          {/* Compact stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-12 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{totalCourses} cursos</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{totalLessons} lecciones • {totalHours}h</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{activeStudents}+ estudiantes</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/access?intent=academy")}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-12 py-7 h-auto text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Comenzar ahora
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => setPreviewOpen(true)}
              className="text-foreground hover:text-primary px-12 py-7 h-auto text-lg rounded-xl transition-all duration-300"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Ver demo gratuita
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <LessonPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
