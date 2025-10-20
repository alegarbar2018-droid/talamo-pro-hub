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
      <section className="pt-20 pb-16 px-6 relative overflow-hidden min-h-screen flex items-center">
        {/* Premium background design */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          {/* Geometric shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 border border-primary/10 rounded-2xl rotate-12 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-32 left-20 w-24 h-24 border border-accent/10 rounded-full animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center relative w-full"
        >
          {/* Eyebrow text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Academia de Trading Profesional
            </span>
          </motion.div>

          {/* Main heading - more compact */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tight">
            <span className="block text-foreground mb-1">Aprende trading</span>
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              sin promesas falsas
            </span>
          </h1>

          {/* Subtitle - more compact */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            Educación basada en datos reales, sin gurus ni estrategias mágicas
          </motion.p>

          {/* Compact stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 sm:gap-6 px-2 sm:px-6 py-2 sm:py-3 bg-surface/50 backdrop-blur-xl border border-primary/10 rounded-xl mb-10 max-w-full"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-xl font-bold text-foreground">{totalLessons}</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">Lecciones</div>
              </div>
            </div>

            <div className="w-px h-7 sm:h-10 bg-border" />

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-xl font-bold text-foreground">{totalHours}h</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">Contenido</div>
              </div>
            </div>

            <div className="w-px h-7 sm:h-10 bg-border" />

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-xl font-bold text-foreground">{activeStudents}+</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">Estudiantes</div>
              </div>
            </div>
          </motion.div>

          {/* Compact CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/access?intent=academy")}
              className="group relative bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 py-5 h-auto text-base font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Comenzar ahora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => setPreviewOpen(true)}
              className="group text-foreground hover:text-primary hover:bg-primary/5 px-8 py-5 h-auto text-base font-medium rounded-xl transition-all duration-300 border border-transparent hover:border-primary/20"
            >
              <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Ver lección demo
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Sin tarjeta de crédito • Contenido verificable • Transparencia total
          </motion.p>
        </motion.div>
      </section>

      <LessonPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
