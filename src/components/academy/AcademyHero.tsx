import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Zap, ArrowRight, Target, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AcademyHero() {
  const navigate = useNavigate();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20 pb-16"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-surface/90 backdrop-blur-xl border border-primary/20 text-primary px-6 py-3 rounded-2xl text-sm font-semibold mb-8"
          >
            <GraduationCap className="w-4 h-4" />
            Academia Sin Humo
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Basta de</span>
            <br />
            <span className="text-red-400">"gurus"</span>
            <span className="text-white"> y</span>
            <br />
            <span className="text-red-400">multiniveles.</span>
            <br />
            <span className="text-primary">Aquí se opera.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-4xl mx-auto mb-6 leading-relaxed"
          >
            Cansados de ver <span className="text-red-400 font-semibold">vendedores de humo</span> que jamás han movido un pip real, 
            pero te venden el "secreto" por $997. Hartos de <span className="text-red-400 font-semibold">academias piramidales</span> donde 
            importa más que invites amigos que tu curva de equity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-8"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 text-sm">
              <strong>Advertencia:</strong> Aquí no hay promesas de Lamborghinis ni retiros millonarios en 30 días.
            </span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Esta es educación real, con <strong className="text-white">backtests documentados</strong>, 
            <strong className="text-white"> métricas transparentes</strong> y criterios objetivos. 
            Sin teatritos, sin presión de ventas, sin multinivel disfrazado de "comunidad".
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg"
              onClick={() => navigate("/access")}
              className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-6 h-auto rounded-2xl group"
            >
              <Zap className="w-5 h-5 mr-2" />
              Validar afiliación real
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              onClick={() => navigate("/academy")}
              className="border-2 border-primary/30 bg-surface/50 backdrop-blur-xl text-primary hover:bg-primary/10 text-lg px-8 py-6 h-auto rounded-2xl"
            >
              <Target className="w-5 h-5 mr-2" />
              Ver el temario completo
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}