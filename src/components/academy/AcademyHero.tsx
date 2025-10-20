import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, PlayCircle, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
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
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Premium background with subtle animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center relative"
        >
          {/* Eyebrow text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-5 py-2 rounded-full border border-primary/20">
              Academia de Trading Profesional
            </span>
          </motion.div>

          {/* Main heading with refined typography */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[1.1] mb-8 tracking-tight">
            <span className="block text-foreground mb-2">Aprende trading</span>
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              sin promesas falsas
            </span>
          </h1>

          {/* Subtitle with better hierarchy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto"
          >
            Educación basada en datos reales, sin gurus ni estrategias mágicas.
            <span className="block mt-2 text-lg opacity-70">Aprende a operar como un profesional.</span>
          </motion.p>

          {/* Elegant stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-8 px-8 py-4 bg-surface/50 backdrop-blur-xl border border-primary/10 rounded-2xl mb-16"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">{totalLessons}</div>
                <div className="text-xs text-muted-foreground">Lecciones</div>
              </div>
            </div>

            <div className="w-px h-12 bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">{totalHours}h</div>
                <div className="text-xs text-muted-foreground">Contenido</div>
              </div>
            </div>

            <div className="w-px h-12 bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">{activeStudents}+</div>
                <div className="text-xs text-muted-foreground">Estudiantes</div>
              </div>
            </div>
          </motion.div>

          {/* Premium CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/access?intent=academy")}
              className="group relative bg-gradient-primary text-primary-foreground hover:opacity-90 px-10 py-7 h-auto text-base font-semibold rounded-2xl transition-all duration-300 shadow-2xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Comenzar ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => setPreviewOpen(true)}
              className="group text-foreground hover:text-primary hover:bg-primary/5 px-10 py-7 h-auto text-base font-medium rounded-2xl transition-all duration-300 border border-transparent hover:border-primary/20"
            >
              <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Ver lección demo
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Sin tarjeta de crédito • Contenido verificable • Transparencia total
          </motion.p>
        </motion.div>
      </section>

      <LessonPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
