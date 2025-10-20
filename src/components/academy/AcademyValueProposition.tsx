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
    <section className="py-20 px-6 relative min-h-screen flex items-center overflow-hidden">
      {/* Premium background design */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-tl from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s' }} />
        
        {/* Dotted pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(var(--primary)_/_0.08)_1px,transparent_0)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
        
        {/* Geometric accents */}
        <div className="absolute top-32 left-32 w-20 h-20 border border-accent/10 rounded-xl -rotate-12 animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-40 right-32 w-28 h-28 border border-primary/10 rounded-2xl rotate-12 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50" />
      </div>

      <div className="max-w-7xl mx-auto relative w-full">
        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Por qué esta academia es diferente
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {timeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}

                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${phase.iconBg} flex items-center justify-center`}>
                    <phase.icon className={`w-10 h-10 ${phase.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {phase.phase}
                  </h3>

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 justify-center">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
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
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Qué desbloqueas
              </h2>
            </div>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              A medida que avanzas, obtienes acceso progresivo a herramientas profesionales
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {unlockables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-base mb-1 text-foreground">
                  {item.label}
                </h4>
                <p className="text-xs text-muted-foreground">
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
