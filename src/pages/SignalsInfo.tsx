import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import SignalsTableDemo from "@/components/public/demos/SignalsTableDemo";
import { TrendingUp, Target, CheckCircle, ArrowRight, Zap, Users, BarChart3, AlertTriangle, Eye, TrendingDown, Clock, Shield, BookOpen, Search, BarChart2, FileText } from "lucide-react";

export default function SignalsInfo() {
  const navigate = useNavigate();
  const { trackPageView } = useObservability();

  useEffect(() => {
    document.title = "Señales — Información";
    trackPageView("signals-info");
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
                <TrendingUp className="w-4 h-4" />
                Señales Profesionales
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-white">Análisis profesional,</span>
                <br />
                <span className="text-primary">no señales premium.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed"
              >
                Aquí no vendemos membresías ni canales VIP. Simplemente eliges el instrumento que te interesa, 
                revisas si el análisis te hace sentido, y decides si ejecutar la operación en tu terminal.
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
                  onClick={() => navigate("/signals")}
                  className="border-2 border-primary/30 bg-surface/50 backdrop-blur-xl text-primary hover:bg-primary/10 text-lg px-8 py-6 h-auto rounded-2xl"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Cómo evaluamos una señal
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ¿Qué son las señales de operación? */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-white">¿Qué son las señales de operación?</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
                Una señal de operación es un análisis técnico estructurado que identifica una oportunidad de trading 
                con reglas claras de entrada, gestión de riesgo y objetivos de ganancia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 text-center group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Identificación</h3>
                <p className="text-sm text-muted-foreground">
                  Detectamos patrones técnicos con alta probabilidad de éxito
                </p>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 text-center group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-teal/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Validación</h3>
                <p className="text-sm text-muted-foreground">
                  Confirmamos el setup con múltiples marcos temporales
                </p>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 text-center group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Gestión</h3>
                <p className="text-sm text-muted-foreground">
                  Definimos stops, targets y condiciones de invalidación
                </p>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 text-center group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Seguimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Monitoreamos el desarrollo y actualizamos el estado
                </p>
              </Card>
            </div>

            {/* Preview de señal */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white text-center mb-8">Así se ve una señal completa</h3>
              <Card className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border-primary/30 p-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        <h4 className="text-2xl font-bold text-white">EURUSD - Patrón de reversión</h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>EURUSD • H1</span>
                        <span>Por Analista Senior</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                        signal.status.tp_alcanzado
                      </Badge>
                      <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                        RR 1:2.5
                      </Badge>
                    </div>
                  </div>

                  {/* Detalles de la operación */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Entry:</p>
                      <p className="text-lg font-mono font-bold text-white">1.0850</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stop Loss:</p>
                      <p className="text-lg font-mono font-bold text-red-400">1.0880</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Take Profit:</p>
                      <p className="text-lg font-mono font-bold text-green-400">1.0775</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Hace 1d</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Confianza Media</span>
                    </div>
                  </div>

                  {/* Análisis */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <h5 className="font-semibold text-white">Analysis logic</h5>
                      </div>
                      <p className="text-sm text-muted-foreground bg-surface/30 p-3 rounded-lg">
                        Formación de doble techo en confluencia con zona de oferta. Divergencia 
                        bajista en MACD confirma debilidad.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <h5 className="font-semibold text-white">Invalidation</h5>
                      </div>
                      <p className="text-sm text-muted-foreground bg-surface/30 p-3 rounded-lg">
                        Ruptura por encima de 1.0885
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Eye className="w-4 h-4 mr-2" />
                      View full analysis
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      <BarChart2 className="w-4 h-4 mr-2" />
                      View chart
                    </Button>
                  </div>
                </div>
              </Card>
              <div className="text-center mt-4">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Ejemplo de señal completa con todos los elementos requeridos
                </Badge>
              </div>
            </div>

            {/* Diferencias clave */}
            <div className="bg-gradient-to-r from-surface/50 to-surface/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white text-center mb-8">¿En qué nos diferenciamos?</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    En Tálamo
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Análisis completo con lógica explicada</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Condiciones de invalidación claras</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Métricas históricas transparentes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Sin presión de compra ni FOMO</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Canales premium típicos
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">"Compra ya" sin explicación</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Stops móviles sin criterio claro</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Métricas infladas o inexistentes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Presión constante por renovar</span>
                    </li>
                  </ul>
                </div>
              </div>
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
                    <span className="text-muted-foreground"><b className="text-white">Traders pragmáticos</b> que quieren criterios claros sin pagar membresías mensuales.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Personas ocupadas</b> que prefieren análisis estructurado sobre alertas constantes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Usuarios de Exness</b> que buscan educación de calidad, no señales comerciales.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground"><b className="text-white">Traders independientes</b> que valoran la transparencia y el proceso educativo.</span>
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
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Quien busca <b className="text-red-400">señales mágicas</b> o sistemas "infalibles".</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Quien espera <b className="text-red-400">alertas constantes</b> sin análisis propio.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Quien no respeta <b className="text-red-400">gestión de riesgo</b> ni condiciones de invalidación.</span>
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
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-white">Qué te llevas</h2>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Fichas transparentes
                </h3>
                <p className="text-muted-foreground text-sm">
                  Reglas, timeframe, ejemplos y sesgos claramente explicados.
                </p>
              </Card>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Métricas a la vista
                </h3>
                <p className="text-muted-foreground text-sm">
                  PF, DD, R/R, W/L y tamaño de muestra verificables.
                </p>
              </Card>
              
              <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-6 group hover:border-primary/40 transition-all duration-300">
                <h3 className="font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Alertas opt-in
                </h3>
                <p className="text-muted-foreground text-sm">
                  Con contexto educativo, nunca presión comercial.
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
                Explora métricas reales y ordena por diferentes criterios para evaluar señales.
              </p>
            </div>
            
            <Card className="bg-surface/50 backdrop-blur-xl border-primary/20 p-8">
              <SignalsTableDemo />
            </Card>
            
            <div className="text-center mt-4">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Datos ficticios realistas; uso educativo
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
                <b className="text-white">Aviso:</b> Educativo. No es recomendación de inversión. Gestiona tu riesgo.
              </p>
            </div>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}