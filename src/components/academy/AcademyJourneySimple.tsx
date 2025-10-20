import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Lock } from "lucide-react";

export default function AcademyJourneySimple() {
  const { t } = useTranslation('academy');

  const levels = [
    {
      level: "Fundamentos",
      range: "Nivel 1-2",
      duration: "4-6 semanas",
      topics: ["Conceptos básicos", "Gestión de riesgo", "Psicología del trading"],
      unlocks: "Herramientas básicas",
    },
    {
      level: "Intermedio",
      range: "Nivel 3-4",
      duration: "6-8 semanas",
      topics: ["Análisis técnico", "Estrategias avanzadas", "Backtesting"],
      unlocks: "Copy Trading + Señales",
    },
    {
      level: "Avanzado",
      range: "Nivel 5-6",
      duration: "8-10 semanas",
      topics: ["Optimización", "Trading algorítmico", "Portfolio management"],
      unlocks: "Señales Premium + Comunidad",
    },
    {
      level: "Experto",
      range: "Nivel 7",
      duration: "4-6 semanas",
      topics: ["Market making", "Gestión institucional", "Análisis cuantitativo"],
      unlocks: "Acceso completo",
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Tu camino de aprendizaje
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Progresión estructurada desde conceptos básicos hasta trading profesional
          </p>
        </motion.div>

        <div className="space-y-6">
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
                <div className="absolute left-8 top-full w-px h-6 bg-gradient-to-b from-primary/30 to-transparent" />
              )}

              <div className="flex items-start gap-6 p-8 bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl hover:border-primary/30 transition-all duration-300">
                {/* Number indicator */}
                <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {level.level}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {level.range}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {level.duration}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                        Aprenderás:
                      </h4>
                      <ul className="space-y-1">
                        {level.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                        Desbloqueas:
                      </h4>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-primary font-medium">{level.unlocks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
