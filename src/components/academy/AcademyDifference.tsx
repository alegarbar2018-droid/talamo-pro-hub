import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Target, BookOpen, BarChart3, Users, Zap } from "lucide-react";

export default function AcademyDifference() {
  const differences = [
    {
      icon: <Shield className="w-6 h-6 text-teal" />,
      title: "Transparencia real",
      description: "Cuentas verificadas, historial público, resultados auditados. Nada de pantallazos fake.",
      badge: "Sin humo"
    },
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Criterios objetivos",
      description: "Rúbricas claras, métricas cuantificables, gating por seguridad. O sabes o no sabes.",
      badge: "Medible"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-accent" />,
      title: "Educación, no ventas",
      description: "Cero presión para invitar amigos. Cero multinivel. Solo formación estructurada.",
      badge: "Ético"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-teal" />,
      title: "Enfoque profesional",
      description: "Como un negocio real: backtests, journal, gestión de riesgo, KPIs institucionales.",
      badge: "Serio"
    }
  ];

  const approach = [
    "Afiliación real con Exness verificada",
    "Historial de operaciones transparente", 
    "Educación estructurada en niveles",
    "Criterios objetivos de progreso",
    "Sin promesas de enriquecimiento rápido",
    "Sin esquemas de referidos obligatorios",
    "Enfoque en gestión de riesgo primero"
  ];

  return (
    <div className="space-y-16">
      {/* Nuestra diferencia */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal/20 to-primary/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-white">Nuestra diferencia</h2>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No somos perfectos, pero sí <strong className="text-white">honestos</strong>. 
            No vendemos sueños, enseñamos <strong className="text-white">habilidades reales</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {differences.map((diff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-teal/20 to-primary/20 group-hover:scale-110 transition-transform">
                    {diff.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                        {diff.title}
                      </h3>
                      <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30 text-xs">
                        {diff.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {diff.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Nuestro approach */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white">Así trabajamos</h2>
            </div>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nada de circos ni teatros motivacionales. Educación <strong className="text-white">estructurada</strong>, 
              <strong className="text-white"> criterios objetivos</strong> y progreso <strong className="text-white">medible</strong>. 
              Como debe ser.
            </p>

            <div className="space-y-4">
              {approach.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-white">{item.split(' ')[0]} {item.split(' ')[1]}</strong>
                    {item.substring(item.indexOf(' ', item.indexOf(' ') + 1))}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-xl border-primary/20 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  La única promesa que hacemos
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Si completas la formación, tendrás las herramientas para operar como un profesional. 
                  <strong className="text-white"> Ganar dinero depende de ti</strong>, no de nosotros.
                </p>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-primary text-sm font-medium">
                    "No vendemos resultados. Enseñamos proceso."
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.section>
    </div>
  );
}