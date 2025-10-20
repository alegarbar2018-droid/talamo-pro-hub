import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Lock, ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";
import { COURSE } from "@/data/course";

export default function AcademyJourneySimple() {
  const { t } = useTranslation('academy');
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const levels = [
    {
      level: "Fundamentos",
      range: "Nivel 1-2",
      courseIndices: [0, 1],
      duration: "4-6 semanas",
      topics: ["Conceptos básicos", "Gestión de riesgo", "Psicología del trading"],
      unlocks: "Herramientas básicas",
    },
    {
      level: "Intermedio",
      range: "Nivel 3-4",
      courseIndices: [2, 3],
      duration: "6-8 semanas",
      topics: ["Análisis técnico", "Estrategias avanzadas", "Backtesting"],
      unlocks: "Copy Trading + Señales",
    },
    {
      level: "Avanzado",
      range: "Nivel 5-6",
      courseIndices: [4, 5],
      duration: "8-10 semanas",
      topics: ["Optimización", "Trading algorítmico", "Portfolio management"],
      unlocks: "Señales Premium + Comunidad",
    },
    {
      level: "Experto",
      range: "Nivel 7",
      courseIndices: [6],
      duration: "4-6 semanas",
      topics: ["Market making", "Gestión institucional", "Análisis cuantitativo"],
      unlocks: "Acceso completo",
    },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden min-h-screen flex items-center">
      {/* Premium background design */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-accent/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgb(var(--primary)_/_0.05)_49%,rgb(var(--primary)_/_0.05)_51%,transparent_52%)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
        
        {/* Decorative elements */}
        <div className="absolute top-40 left-40 w-16 h-16 border-2 border-primary/10 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-48 right-48 w-24 h-24 border border-accent/10 rounded-2xl -rotate-12 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-12 h-12 border border-primary/10 rounded-full animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }} />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="max-w-6xl mx-auto relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Tu camino de aprendizaje
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Progresión estructurada desde conceptos básicos hasta trading profesional
          </p>
        </motion.div>

        <div className="space-y-4">
          {levels.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector line */}
              {index < levels.length - 1 && (
                <div className="absolute left-6 top-full w-px h-4 bg-gradient-to-b from-primary/30 to-transparent" />
              )}

              <div 
                className="flex items-start gap-4 p-6 bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
                onClick={() => setExpandedLevel(expandedLevel === index ? null : index)}
              >
                {/* Number indicator */}
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {level.level}
                    </h3>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-surface/50 rounded">
                      {level.range}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {level.duration}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${expandedLevel === index ? 'rotate-180' : ''}`} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
                        Aprenderás:
                      </h4>
                      <ul className="space-y-1">
                        {level.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
                        Desbloqueas:
                      </h4>
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm text-primary font-medium">{level.unlocks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable lessons */}
              <AnimatePresence>
                {expandedLevel === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-6 bg-surface/20 backdrop-blur-xl border border-primary/10 rounded-xl">
                      <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Lecciones incluidas:
                      </h4>
                      <div className="space-y-3">
                        {level.courseIndices.map((courseIndex) => {
                          const courseLevel = COURSE[courseIndex];
                          if (!courseLevel) return null;
                          
                          return (
                            <div key={courseIndex} className="space-y-2">
                              <div className="font-semibold text-sm text-primary">
                                {courseLevel.level}
                              </div>
                              <ul className="space-y-1.5 ml-4">
                                {courseLevel.lessons.slice(0, 5).map((lesson, lessonIdx) => (
                                  <li key={lessonIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                                    <span>{lesson.title}</span>
                                  </li>
                                ))}
                                {courseLevel.lessons.length > 5 && (
                                  <li className="text-xs text-muted-foreground/70 ml-3">
                                    + {courseLevel.lessons.length - 5} lecciones más
                                  </li>
                                )}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
