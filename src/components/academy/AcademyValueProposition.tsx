import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Target, TrendingUp, Shield, Award, Calculator, Radio, Users } from "lucide-react";

export default function AcademyValueProposition() {
  const { t } = useTranslation('academy');

  const timeline = [
    {
      phase: "Problema",
      icon: AlertTriangle,
      color: "text-red-400",
      iconBg: "bg-red-500/10",
      items: [
        "95% de traders pierden dinero",
        "Cursos de $5,000+ sin resultados",
        "Promesas falsas de ganancias rápidas",
      ],
    },
    {
      phase: "Solución",
      icon: Target,
      color: "text-primary",
      iconBg: "bg-primary/10",
      items: [
        "Temario basado en datos reales",
        "Sin promesas de riqueza instantánea",
        "Enfoque en gestión de riesgo",
      ],
    },
    {
      phase: "Resultado",
      icon: TrendingUp,
      color: "text-green-400",
      iconBg: "bg-green-500/10",
      items: [
        "Conocimiento verificable",
        "Acceso a herramientas profesionales",
        "Comunidad de traders reales",
      ],
    },
  ];

  const unlockables = [
    { icon: Shield, label: "Copy Trading", level: "Nivel 3+" },
    { icon: Radio, label: "Señales Premium", level: "Nivel 5+" },
    { icon: Calculator, label: "Herramientas Pro", level: "Nivel 1+" },
    { icon: Users, label: "Comunidad Privada", level: "Nivel 7" },
  ];

  return (
    <section className="py-32 px-6 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/5 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-24 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Por qué esta academia es diferente
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {timeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}

                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl ${phase.iconBg} flex items-center justify-center`}>
                    <phase.icon className={`w-12 h-12 ${phase.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-6 text-foreground">
                    {phase.phase}
                  </h3>

                  <ul className="space-y-3 text-muted-foreground">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-left">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Unlockables Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Qué desbloqueas
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A medida que avanzas, obtienes acceso progresivo a herramientas profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {unlockables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-foreground">
                  {item.label}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.level}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
