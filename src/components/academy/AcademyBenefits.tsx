import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Radio, 
  Calculator, 
  Users, 
  Award,
  Unlock,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function AcademyBenefits() {
  const { t } = useTranslation('academy');
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: "Copy Trading",
      description: "Accede a estrategias verificadas de traders profesionales",
      link: "/copy-info",
      badge: "Premium",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "from-blue-500/30 to-cyan-500/30",
    },
    {
      icon: Radio,
      title: "Señales de Trading",
      description: "Recibe alertas en tiempo real con análisis técnico avanzado",
      link: "/signals-info",
      badge: "En vivo",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "from-purple-500/30 to-pink-500/30",
    },
    {
      icon: Calculator,
      title: "Herramientas Pro",
      description: "Calculadoras avanzadas, journal de trading y análisis de riesgo",
      link: "/tools-info",
      badge: "Gratuito",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "from-green-500/30 to-emerald-500/30",
    },
    {
      icon: Users,
      title: "Comunidad Privada",
      description: "Conecta con traders verificados y comparte experiencias",
      link: "#",
      badge: "Exclusivo",
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "from-orange-500/30 to-red-500/30",
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 text-lg px-6 py-2 mb-6">
            <Unlock className="w-4 h-4 mr-2" />
            Beneficios al completar la Academia
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Qué desbloqueas al avanzar
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A medida que completes niveles, obtendrás acceso progresivo a herramientas profesionales y recursos exclusivos
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`group bg-gradient-to-br ${benefit.gradient} backdrop-blur-2xl border-2 border-primary/30 hover:border-primary/50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-400 cursor-pointer h-full`}
                onClick={() => benefit.link !== "#" && navigate(benefit.link)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <Badge className="bg-primary/20 border border-primary/40">
                      {benefit.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                  
                  {benefit.link !== "#" && (
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all duration-300">
                      <span>Conocer más</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progression Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-surface/90 to-surface/50 backdrop-blur-2xl border-2 border-primary/30 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-3xl font-bold">Flujo de progresión</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Fundamentos", desc: "Completa Nivel 1-2", unlock: "Herramientas básicas" },
              { step: "2", title: "Intermedio", desc: "Completa Nivel 3-4", unlock: "Copy Trading" },
              { step: "3", title: "Avanzado", desc: "Completa Nivel 5-6", unlock: "Señales Premium" },
              { step: "4", title: "Experto", desc: "Completa Nivel 7", unlock: "Comunidad Privada" },
            ].map((stage, idx) => (
              <div key={idx} className="relative">
                <div className="bg-surface/60 backdrop-blur-xl border-2 border-primary/30 rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4 shadow-md">
                    {stage.step}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{stage.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{stage.desc}</p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>{stage.unlock}</span>
                  </div>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
