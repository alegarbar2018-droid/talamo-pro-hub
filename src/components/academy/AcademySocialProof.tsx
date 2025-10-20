import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { useAcademyStats } from "@/hooks/useAcademyStats";

export default function AcademySocialProof() {
  const { t } = useTranslation('academy');
  const { activeStudents, totalLessons, totalHours } = useAcademyStats();

  const stats = [
    {
      icon: Users,
      value: `${activeStudents}+`,
      label: "Estudiantes activos",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: BookOpen,
      value: `${totalLessons}`,
      label: "Lecciones disponibles",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Award,
      value: `${totalHours}h`,
      label: "Contenido educativo",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: TrendingUp,
      value: "200+",
      label: "Lecciones completadas/mes",
      gradient: "from-orange-500/20 to-red-500/20",
    },
  ];

  const testimonials = [
    {
      quote: "Completé el Nivel 2 en 45 días y ahora entiendo conceptos que antes me parecían imposibles",
      level: "Nivel 2 completado",
      timeframe: "45 días",
    },
    {
      quote: "Las lecciones son prácticas y directas. Sin rodeos ni promesas falsas",
      level: "Nivel 4 completado",
      timeframe: "3 meses",
    },
    {
      quote: "Por fin una academia que se enfoca en lo importante: gestión de riesgo y psicología",
      level: "Nivel 3 en progreso",
      timeframe: "2 meses",
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-surface/20">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 text-lg px-6 py-2 mb-6">
              Métricas en tiempo real
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Una comunidad en crecimiento
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-2xl border-2 border-primary/30 hover:border-primary/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-400`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                      <stat.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros estudiantes
            </h3>
            <p className="text-muted-foreground text-lg">
              Testimonios anónimos de traders reales en formación
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-surface/60 backdrop-blur-2xl border-2 border-primary/20 hover:border-primary/40 shadow-lg hover:shadow-xl transition-all duration-400 h-full">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <MessageSquare className="w-8 h-8 text-primary/60" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                      <Badge className="bg-primary/10 border border-primary/30">
                        {testimonial.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {testimonial.timeframe}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-surface/80 to-accent/10 backdrop-blur-2xl border-2 border-primary/30 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Únete a la comunidad
              </h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                Conecta con otros traders en formación, comparte experiencias y accede a recursos exclusivos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://discord.gg/talamo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Discord</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://t.me/talamo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0088cc] hover:bg-[#006ba1] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Telegram</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
