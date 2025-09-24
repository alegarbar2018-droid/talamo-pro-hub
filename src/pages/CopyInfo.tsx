import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import CopyRiskDemo from "@/components/public/demos/CopyRiskDemo";
import { Copy, Target, CheckCircle, ArrowRight, Zap, Users, Shield, AlertTriangle } from "lucide-react";

export default function CopyInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Copy Trading — Información";
    trackPageView("copy-info");
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative">
        {/* Hero Section */}
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
                <Copy className="w-4 h-4" />
                Copy Trading Inteligente
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-white">Copiar con cabeza,</span>
                <br />
                <span className="text-primary">no por moda.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
              >
                El riesgo sigue siendo tuyo. Te damos criterios para elegir, dimensionar y dormir tranquilo.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate("/access")}
                  className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-6 h-auto rounded-2xl group"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Validar afiliación
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  onClick={() => navigate("/copy-trading")}
                  className="border-2 border-primary/30 bg-surface/50 backdrop-blur-xl text-primary hover:bg-primary/10 text-lg px-8 py-6 h-auto rounded-2xl"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Aprender a evaluar un perfil
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Para quién es */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal/20 to-primary/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white">Para quién es</h2>
              </div>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Personas con <b className="text-white">tolerancia al riesgo clara</b> (low/med/high) que quieren perfiles acordes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Seguidores responsables</b> que entienden que copiar ≠ desentenderse.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Diversificadores</b> que buscan consistencia y control de correlación.</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* No es para */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">No es para</h2>
              </div>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-red-500/20 p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Quien persigue <b className="text-red-400">rachas</b>, sube tamaño por impulso o copia por simpatía.
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Qué te llevas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-white">Qué te llevas</h2>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Perfiles por bandas de riesgo
                </h3>
                <p className="text-muted-foreground text-sm">
                  Con PF, DD y consistencia claramente definidos.
                </p>
              </Card>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Guía de límites
                </h3>
                <p className="text-muted-foreground text-sm">
                  Stop diario, exposición total, correlación y "circuit breaker".
                </p>
              </Card>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Checklist honesto
                </h3>
                <p className="text-muted-foreground text-sm">
                  Para seleccionar sin sesgos emocionales.
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Demo educativo</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Calculadora de asignación de capital basada en drawdown histórico y tu tolerancia al riesgo.
              </p>
            </div>
            
            <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8">
              <CopyRiskDemo />
            </Card>
            
            <div className="text-center mt-4">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Simulación simple para decidir cuánto capital asignar a un perfil dado su DD histórico
              </Badge>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground">
                <b className="text-white">Aviso:</b> Educativo. No garantizamos resultados. Respeta tus límites.
              </p>
            </div>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}