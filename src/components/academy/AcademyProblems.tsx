import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Users, DollarSign, X } from "lucide-react";

export default function AcademyProblems() {
  const problems = [
    {
      icon: <TrendingDown className="w-6 h-6 text-red-400" />,
      title: "Vendedores de humo",
      description: "Coaches que nunca operaron en real, mostrando cuentas demo infladas y prometiendo 'el sistema que cambió mi vida'.",
      reality: "Realidad: Viven de vender cursos, no del trading."
    },
    {
      icon: <Users className="w-6 h-6 text-orange-400" />,
      title: "Academias multinivel",
      description: "Te presionan para 'construir tu red' e invitar amigos. Ganas más reclutando que operando (red flag gigante).",
      reality: "Realidad: Es un esquema piramidal disfrazado de educación."
    },
    {
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      title: "Apps 'mágicas' de copy",
      description: "Te venden que copies señales automáticas y te hagas rico sin saber nada. Spoiler: siempre pierdes.",
      reality: "Realidad: Nadie regala dinero. Si fuera tan fácil, ¿por qué lo venden?"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-20 relative"
    >
      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-4xl font-bold text-white">El problema del mercado</h2>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            La industria está llena de estafadores que nunca han operado una cuenta real, 
            pero te venden el sueño mientras viven de las membresias.
          </p>

          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            <X className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-sm font-medium">
              Nosotros NO somos eso. Punto.
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-surface/30 border-red-500/20 p-6 h-full group hover:border-red-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {problem.icon}
                  <h3 className="font-bold text-white text-lg group-hover:text-red-400 transition-colors">
                    {problem.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {problem.description}
                </p>
                
                <div className="bg-red-500/10 border-l-4 border-red-400 pl-4 py-2">
                  <p className="text-red-200 text-xs font-medium">
                    {problem.reality}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-surface/20 border-red-500/30 p-8 inline-block">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Te suena familiar?
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Si has perdido dinero con "gurus" de Instagram, academias que son multiniveles, 
              o apps que prometen hacerte rico copiando señales... 
              <strong className="text-red-400"> ya sabes por qué estamos aquí.</strong>
            </p>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}