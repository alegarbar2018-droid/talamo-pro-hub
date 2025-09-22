import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Copy,
  X,
  TrendingUp,
  Shield,
  Users,
  Sparkles,
  Award,
  Zap,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PARTNER_ID } from "@/lib/constants";
import WhyWeDoIt from "@/components/WhyWeDoIt";
import HowItWorks from "@/components/HowItWorks";
import ModulesWithDetails from "@/components/ModulesWithDetails";
import SyllabusDetailed from "@/components/SyllabusDetailed";
import WhyExness from "@/components/WhyExness";
import FAQExpanded from "@/components/FAQExpanded";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t, i18n } = useTranslation(["landing", "nav", "common"]);

  // Set document language when i18n language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language || "es";
  }, [i18n.language]);

  const principles = [
    "Trading profesional, sin promesas vacías",
    "Educación antes que marketing",
    "Transparencia total en resultados",
    "Control de riesgo como prioridad"
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Premium Version */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface/30 to-background"
      >
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <div className="text-center space-y-16">
            
            {/* Premium badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-3 bg-surface/90 backdrop-blur-xl border-2 border-primary/20 text-primary px-8 py-4 rounded-2xl text-sm font-semibold shadow-lg shadow-primary/10"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              {t("landing:exclusive_platform")}
              <Award className="w-4 h-4 text-primary" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight">
                <div className="relative">
                  <div className="text-white">Trading serio.</div>
                  <span className="text-primary">Sin humo</span>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-primary rounded-full opacity-60"></div>
                </div>
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium tracking-wide">
                  {t("landing:hero_subtitle")}
                  <div className="flex flex-wrap justify-center gap-6 mt-8">
                    <div className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal/30 via-primary/20 to-accent/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                      <div className="relative bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal to-primary"></div>
                        <span className="font-inter text-sm font-medium text-white tracking-wide">
                          Acceso Exclusivo
                        </span>
                      </div>
                    </div>
                    
                    <div className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/20 to-teal/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                      <div className="relative bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                        <span className="font-inter text-sm font-medium text-white tracking-wide">
                          100% Transparente
                        </span>
                      </div>
                    </div>
                    
                    <div className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 via-teal/20 to-primary/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                      <div className="relative bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-teal"></div>
                        <span className="font-inter text-sm font-medium text-white tracking-wide">
                          Riesgo Controlado
                        </span>
                      </div>
                    </div>
                  </div>
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/onboarding?step=choose")}
                className="group relative bg-gradient-primary hover:shadow-glow-intense text-lg px-10 py-6 h-auto overflow-hidden transition-all duration-300 hover:scale-105 rounded-2xl"
                data-event="cta-solicitar-acceso-hero"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                ></motion.div>
                <span className="relative flex items-center gap-3 font-semibold">
                  <Zap className="h-5 w-5" />
                  {t("landing:cta_access")}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/onboarding?step=validate")}
                className="group border-2 border-primary/30 bg-surface/50 backdrop-blur-xl text-primary hover:bg-primary/10 hover:border-primary hover:shadow-lg text-lg px-10 py-6 h-auto transition-all duration-300 hover:scale-105 rounded-2xl"
                data-event="cta-ya-tengo-cuenta-hero"
              >
                <Target className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                {t("landing:exness_have")}
              </Button>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-8 pt-8 opacity-70"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Acceso por afiliación</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Transparente</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4 text-primary" />
                <span>Verificado</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why We Do It Section */}
      <WhyWeDoIt />

      {/* How It Works */}
      <HowItWorks />

      {/* Modules with Details */}
      <ModulesWithDetails />

      {/* Syllabus Detailed */}
      <SyllabusDetailed />

      {/* Business Model */}
      <section id="modelo" className="bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Por qué el acceso por afiliación?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestro modelo es simple y transparente: ganamos cuando tú ganas
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nuestro modelo es simple y transparente: ganamos cuando tú ganas. 
                  Somos IB (Introducing Broker) de Exness, lo que significa que recibimos 
                  una comisión por spread cuando operas.
                </p>
                <p>
                  <strong className="text-foreground">No vendemos cursos.</strong> No necesitamos 
                  prometerte rentabilidades irreales. Nuestro incentivo está alineado contigo: 
                  mientras más exitoso seas y más confíes en operar, mejor para ambos.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Transparencia Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Publicamos resultados reales, avisos de riesgo claros y nunca 
                    prometemos rentabilidades garantizadas.
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/onboarding?step=validate")}
                    className="border-primary text-primary hover:bg-primary/5"
                    data-event="cta-validar-acceso-modelo"
                  >
                    <Target className="h-5 w-5 mr-2" />
                    Ya tengo cuenta, validar ahora
                  </Button>
                  <Button 
                    variant="link"
                    onClick={() => navigate("/onboarding?step=validate")}
                    className="text-muted-foreground hover:text-foreground text-sm h-auto p-1"
                    data-event="cta-no-afiliado-modelo"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Tengo cuenta pero no estoy afiliado
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Exness */}
      <WhyExness />

      {/* FAQ */}
      <FAQExpanded />

      {/* CTA Section */}
      <section className="bg-gradient-primary">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Premium background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
          <div className="relative text-center space-y-12">
            <div className="space-y-10">
              {/* Premium badge with enhanced effects */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition duration-700 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-full blur opacity-70 group-hover:opacity-90 transition duration-500"></div>
                  <div className="relative bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-full px-8 py-3 flex items-center gap-4 shadow-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    <span className="text-base font-bold text-white tracking-widest uppercase letter-spacing-2">
                      Acceso Exclusivo
                    </span>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-white via-white/95 to-white bg-clip-text text-transparent filter drop-shadow-sm">
                      {t("landing:ready_transform")}
                    </span>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full blur-sm"></div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
                  </span>
                </h2>
                
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-2xl md:text-3xl text-white/95 leading-relaxed font-semibold tracking-wide">
                    {t("landing:join_community")}
                  </p>
                  <p className="text-xl text-white/80 leading-relaxed font-medium">
                    {t("landing:access_methodology")}
                  </p>
                </div>

                {/* Enhanced premium features highlight */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-8 pt-6"
                >
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 to-green-400/30 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                    <div className="relative flex items-center gap-3 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-300 animate-pulse"></div>
                      <span className="text-base text-white font-semibold tracking-wide">Academia Estructurada</span>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                    <div className="relative flex items-center gap-3 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-300 animate-pulse"></div>
                      <span className="text-base text-white font-semibold tracking-wide">Señales Auditadas</span>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                    <div className="relative flex items-center gap-3 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-300 animate-pulse"></div>
                      <span className="text-base text-white font-semibold tracking-wide">Copy Trading Elite</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-3xl blur opacity-60 group-hover:opacity-80 transition duration-500"></div>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/onboarding?step=choose")}
                  className="relative bg-white text-primary hover:bg-white/95 hover:shadow-2xl hover:shadow-white/20 text-lg font-bold px-12 py-6 h-auto transition-all duration-500 hover:scale-105 rounded-3xl border-2 border-white"
                  data-event="cta-solicitar-acceso-final"
                >
                  <Zap className="h-5 w-5 mr-3" />
                  {t("landing:cta_access")}
                  <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/onboarding?step=validate")}
                  className="relative border-2 border-white/60 text-white hover:bg-white/15 hover:border-white hover:shadow-xl hover:shadow-white/10 text-lg font-semibold px-12 py-6 h-auto transition-all duration-500 hover:scale-105 rounded-3xl backdrop-blur-xl"
                  data-event="cta-validar-acceso-final"
                >
                  <Target className="h-5 w-5 mr-3 group-hover:rotate-45 transition-transform duration-300" />
                  {t("landing:exness_have")}
                </Button>
              </div>
            </motion.div>
            
            {/* Enhanced additional option for non-affiliated users */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6"
            >
              <div className="group relative inline-block">
                <div className="absolute -inset-2 bg-white/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <Button 
                  variant="link"
                  onClick={() => navigate("/onboarding?step=validate")}
                  className="relative text-white/70 hover:text-white text-base font-medium px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                  data-event="cta-no-afiliado-final"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Tengo cuenta pero no estoy afiliado a Tálamo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-bold text-foreground text-xl">Tálamo</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Trading profesional, sin promesas vacías
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Plataforma</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => navigate("/academy")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Academia
                </button>
                <button 
                  onClick={() => navigate("/signals")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Señales
                </button>
                <button 
                  onClick={() => navigate("/copy-trading")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Copy Trading
                </button>
                <button 
                  onClick={() => navigate("/tools")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Herramientas
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Cuenta</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => navigate("/login")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => navigate("/onboarding?step=choose")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Solicitar Acceso
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <div className="space-y-2 text-sm">
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Términos de Servicio
                </button>
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidad
                </button>
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Aviso de Riesgos
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-line mt-8 pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Aviso de riesgo:</strong> El trading de CFDs conlleva un alto nivel de riesgo y puede resultar en la pérdida de todo su capital. 
              No debe arriesgar más de lo que puede permitirse perder. Antes de decidir operar, debe considerar cuidadosamente sus objetivos de inversión, 
              nivel de experiencia y tolerancia al riesgo.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 Tálamo Trading. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground">Cambiar Partner</h3>
              <button 
                onClick={() => setShowPartnerModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  1. Contacta al soporte de Exness
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  2. Copia este mensaje:
                </p>
                <div className="bg-surface border rounded p-3 text-sm">
                  "Hola, quiero cambiar mi partner actual por el partner ID {PARTNER_ID}. Gracias."
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Hola, quiero cambiar mi partner actual por el partner ID ${PARTNER_ID}. Gracias.`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-2 flex items-center gap-2 text-primary text-sm hover:underline"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar mensaje"}
                </button>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  3. Si te piden el Partner ID:
                </p>
                <div className="bg-surface border rounded p-3 text-sm font-mono">
                  {PARTNER_ID}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(PARTNER_ID);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-2 flex items-center gap-2 text-primary text-sm hover:underline"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copiar Partner ID
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPartnerModal(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button 
                onClick={() => {
                  setShowPartnerModal(false);
                  navigate("/onboarding?step=validate");
                }}
                className="flex-1"
              >
                Ya lo hice, validar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;