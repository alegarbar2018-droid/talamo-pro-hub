import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Sparkles, 
  BookOpen, 
  Target, 
  GraduationCap, 
  Clock, 
  Award,
  Zap,
  ArrowRight,
  X,
  Check,
  Copy,
  AlertTriangle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PARTNER_ID } from "@/lib/constants";
import Navigation from "@/components/Navigation";
import ChangePartnerModal from "@/components/access/ChangePartnerModal";

// Lazy load heavy components
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const ModulesWithDetails = lazy(() => import("@/components/ModulesWithDetails"));
const WhyExness = lazy(() => import("@/components/WhyExness"));
const FAQExpanded = lazy(() => import("@/components/FAQExpanded"));

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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center space-y-8 sm:space-y-12 md:space-y-16">
            
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
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight">
                <div className="relative">
                  <div className="text-white">Trading serio.</div>
                  <span className="text-primary">Sin humo</span>
                  <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 h-1.5 sm:h-2 bg-gradient-primary rounded-full opacity-60"></div>
                </div>
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium tracking-wide">
                  {t("landing:hero_subtitle")}
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
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

            {/* Trust indicators moved up */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-8 pt-4 opacity-70"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Acceso exclusivo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>100% Transparente</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4 text-primary" />
                <span>Riesgo controlado</span>
              </div>
            </motion.div>
          </div>
          
          {/* User Differentiation - 3 paths */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-muted-foreground mb-8">
              {t("landing:hero_user_question")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => {
                document.getElementById('para-principiantes')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }}>
                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">{t("landing:hero_path_beginner")}</h3>
                <p className="text-sm text-muted-foreground">{t("landing:hero_path_beginner_desc")}</p>
              </Card>
              
              <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => navigate('/copy-info')}>
                <Users className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">{t("landing:hero_path_investor")}</h3>
                <p className="text-sm text-muted-foreground">{t("landing:hero_path_investor_desc")}</p>
              </Card>
              
              <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => navigate('/tools-info')}>
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">{t("landing:hero_path_experienced")}</h3>
                <p className="text-sm text-muted-foreground">{t("landing:hero_path_experienced_desc")}</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Lazy load non-critical sections */}
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-teal border-t-transparent rounded-full" /></div>}>
        {/* Value Proposition Section */}
        <ValueProposition />
        
        {/* Beginner Section - Humanized */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                  <GraduationCap className="w-4 h-4" />
                  {t('landing:beginner_badge')}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('landing:beginner_title')}
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {t('landing:beginner_subtitle')}
                </p>
                <p className="text-muted-foreground">
                  {t('landing:beginner_reality')}
                </p>
              </div>

              {/* Learning Path Timeline */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 border-border bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t('landing:beginner_month1')}</h3>
                      <p className="text-xs text-muted-foreground">{t('landing:beginner_hours')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{t('landing:beginner_month1_desc')}</p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Award className="w-4 h-4" />
                    <span>{t('landing:beginner_month1_milestone')}</span>
                  </div>
                </Card>

                <Card className="p-6 border-border bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t('landing:beginner_month23')}</h3>
                      <p className="text-xs text-muted-foreground">{t('landing:beginner_practice')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{t('landing:beginner_month23_desc')}</p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Award className="w-4 h-4" />
                    <span>{t('landing:beginner_month23_milestone')}</span>
                  </div>
                </Card>

                <Card className="p-6 border-border bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t('landing:beginner_month46')}</h3>
                      <p className="text-xs text-muted-foreground">{t('landing:beginner_consistency')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{t('landing:beginner_month46_desc')}</p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Award className="w-4 h-4" />
                    <span>{t('landing:beginner_month46_milestone')}</span>
                  </div>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/academy-info')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('landing:beginner_cta')}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  {t('landing:beginner_lessons_count')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Modules with Details */}
        <ModulesWithDetails />

        {/* Why Exness */}
        <WhyExness />

        {/* FAQ */}
        <FAQExpanded />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
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