import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, BookOpen, TrendingUp, Award, Code, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AcademyJourney() {
  const navigate = useNavigate();

  const levels = [
    {
      number: "0",
      title: "Onboarding y Setup",
      icon: <Settings className="w-6 h-6" />,
      duration: "1-2 semanas",
      description: "Bases de seguridad, configuración de plataforma y journal",
      keyPoints: [
        "Seguridad y 2FA",
        "Configuración MT4/MT5",
        "Journal de trading"
      ],
      color: "from-slate-500/20 to-slate-600/20",
      borderColor: "border-slate-500/30",
      textColor: "text-slate-400"
    },
    {
      number: "1",
      title: "Fundamentos del Trading",
      icon: <BookOpen className="w-6 h-6" />,
      duration: "6-8 semanas",
      description: "Conceptos esenciales, análisis, gestión de riesgo y psicología",
      keyPoints: [
        "Expectativa y drawdown",
        "Especificaciones de contratos",
        "Gestión de riesgo básica",
        "Plan de trading inicial"
      ],
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400"
    },
    {
      number: "2",
      title: "Intermedio: Operativa y Gestión",
      icon: <TrendingUp className="w-6 h-6" />,
      duration: "8-10 semanas",
      description: "Estructuras avanzadas, gestión de posiciones y métricas pro",
      keyPoints: [
        "Setups por activo",
        "Gestión en noticias",
        "Panel de métricas",
        "Journal profesional"
      ],
      color: "from-primary/20 to-teal/20",
      borderColor: "border-primary/30",
      textColor: "text-primary"
    },
    {
      number: "3",
      title: "Profesional",
      icon: <Award className="w-6 h-6" />,
      duration: "10-12 semanas",
      description: "Microestructura, portafolio de estrategias y riesgo institucional",
      keyPoints: [
        "Liquidez y ejecución",
        "Portafolio de edges",
        "VaR y stress testing",
        "Compliance básico"
      ],
      color: "from-accent/20 to-yellow-500/20",
      borderColor: "border-accent/30",
      textColor: "text-accent"
    },
    {
      number: "4",
      title: "Algorítmico & EAs",
      icon: <Code className="w-6 h-6" />,
      duration: "12-14 semanas",
      description: "Automatización, desarrollo de EAs y certificación final",
      keyPoints: [
        "Arquitectura MT4/MT5",
        "Backtesting avanzado",
        "Deploy y monitoreo",
        "Proyecto final certificado"
      ],
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-surface/80 border border-primary/30 shadow-[var(--shadow-glow-subtle)]">
            <BookOpen className="w-3 h-3 mr-1" />
            Tu Ruta de Aprendizaje
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            5 Niveles. De Cero a Pro.
          </h2>
          <p className="text-muted-foreground/90 max-w-2xl mx-auto text-lg">
            Sin atajos ni promesas vacías. Progresión estructurada con criterios objetivos en cada nivel.
          </p>
        </div>

        {/* Journey Path */}
        <div className="max-w-5xl mx-auto space-y-6 mb-16">
          {levels.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`bg-surface/50 backdrop-blur-sm border-line/50 hover:${level.borderColor} transition-all duration-300 overflow-hidden group`}>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Level Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${level.color} border ${level.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                        <div className="relative z-10">
                          <div className={`text-3xl font-bold ${level.textColor} mb-1`}>
                            {level.number}
                          </div>
                          <div className={`${level.textColor}`}>
                            {level.icon}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl md:text-2xl font-bold text-foreground">
                            Nivel {level.number} — {level.title}
                          </h3>
                          <Badge variant="outline" className={`${level.borderColor} text-xs`}>
                            {level.duration}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground/80 leading-relaxed">
                          {level.description}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {level.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className={`w-4 h-4 ${level.textColor} mt-0.5 flex-shrink-0`} />
                            <span className="text-sm text-muted-foreground/80">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow Connector (desktop) */}
                    {index < levels.length - 1 && (
                      <div className="hidden md:flex items-center">
                        <ArrowRight className={`w-6 h-6 ${level.textColor} opacity-50`} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress indicator line */}
                {index < levels.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-line/50 to-transparent" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-xl border-primary/20 p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              ¿Listo para empezar?
            </h3>
            <p className="text-muted-foreground/90 mb-8 leading-relaxed">
              Valida tu afiliación con Exness para acceder a la academia completa. 
              Sin afiliación real, no hay acceso. <strong className="text-foreground">Así de simple</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/onboarding')}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-[var(--shadow-glow-subtle)] hover:shadow-[var(--glow-primary)] px-10 py-7 text-base transition-all duration-300"
              >
                Validar y comenzar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => {
                  const syllabusSection = document.getElementById('temario');
                  if (syllabusSection) {
                    syllabusSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 px-10 py-7 text-base transition-all duration-300"
              >
                Ver temario detallado
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
