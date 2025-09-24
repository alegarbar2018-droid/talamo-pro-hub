import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import PortfolioDiversificationDemo from "@/components/public/demos/PortfolioDiversificationDemo";
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
          
          {/* What is Copy Trading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Copy className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-white">¿Qué es Copy Trading?</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Es replicar automáticamente las operaciones de traders experimentados (proveedores de estrategia) en tu propia cuenta. 
                <span className="text-primary font-semibold"> Tu capital, sus decisiones, tu riesgo.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Selección inteligente
                </h3>
                <p className="text-muted-foreground text-sm">
                  Elegimos estrategias que nos hacen sentido revisar. <b className="text-white">No conocemos personalmente a los proveedores.</b>
                </p>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-teal/20 to-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Diversificación esencial
                </h3>
                <p className="text-muted-foreground text-sm">
                  Para una buena inversión con copy trading, <b className="text-white">debes crear un portafolio</b> que distribuya el riesgo.
                </p>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Múltiples estrategias
                </h3>
                <p className="text-muted-foreground text-sm">
                  Nunca pongas todos los huevos en una canasta. <b className="text-white">Diversifica en varias estrategias</b> según tu tolerancia al riesgo.
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Portfolio Diversification Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-white">Calculadora de Diversificación</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Ingresa tu capital y aversión al riesgo para ver cómo distribuir tu inversión entre diferentes estrategias.
              </p>
            </div>
            
            <PortfolioDiversificationDemo />
          </motion.div>

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
                    <span className="text-muted-foreground">Personas con <b className="text-white">tolerancia al riesgo clara</b> que entienden la importancia de diversificar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Inversionistas responsables</b> que buscan construir un portafolio balanceado.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Diversificadores inteligentes</b> que entienden que el riesgo se distribuye, no se elimina.</span>
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
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Quien busca <b className="text-red-400">"el trader perfecto"</b> y pone todo en una estrategia.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Personas que <b className="text-red-400">no entienden</b> que diversificar es esencial.</span>
                  </li>
                </ul>
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
                <h2 className="text-4xl font-bold text-white">Qué estamos ofreciendo</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Un menú curado con estrategias de copy trading de la página de Exness que <span className="text-primary font-semibold">revisamos y analizamos</span> para 
                que tengas un panorama más informado y tomes decisiones de inversión inteligentes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8 group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                  Estrategias analizadas y categorizadas
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Revisamos estrategias de copy trading en Exness y las organizamos por:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Perfil de riesgo:</b> Conservador, Moderado, Agresivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Métricas clave:</b> Profit Factor, Drawdown histórico, Consistencia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Transparencia total:</b> Datos reales sin marketing</span>
                  </li>
                </ul>
              </Card>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8 group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-teal/20 to-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                  Guía de selección personalizada
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Te ayudamos a seleccionar estrategias según tu perfil de inversionista:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Análisis de tolerancia al riesgo</b></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Criterios de evaluación objetivos</b></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Recomendaciones de diversificación</b></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span><b className="text-white">Límites de exposición sugeridos</b></span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 p-6 max-w-4xl mx-auto">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-primary">Importante:</strong> No somos asesores financieros ni garantizamos resultados. 
                  Proporcionamos <span className="text-white font-semibold">análisis educativo</span> para que tomes decisiones informadas 
                  basadas en datos objetivos, no en promesas de marketing.
                </p>
              </Card>
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