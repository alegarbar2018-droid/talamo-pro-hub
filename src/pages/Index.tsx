import { useState } from "react";
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
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PARTNER_ID } from "@/lib/constants";
import WhyWeDoIt from "@/components/WhyWeDoIt";
import HowItWorks from "@/components/HowItWorks";
import ModulesWithDetails from "@/components/ModulesWithDetails";
import SyllabusDetailed from "@/components/SyllabusDetailed";
import WhyExness from "@/components/WhyExness";
import FAQExpanded from "@/components/FAQExpanded";

const Index = () => {
  const navigate = useNavigate();
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const principles = [
    "Trading profesional, sin promesas vacías",
    "Educación antes que marketing",
    "Transparencia total en resultados",
    "Control de riesgo como prioridad"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Tálamo</h1>
              <Badge variant="outline" className="border-teal text-teal">MVP</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/auth/signin")}>
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate("/onboarding?step=choose")}
                className="bg-gradient-primary hover:shadow-glow"
                data-event="cta-solicitar-acceso-header"
              >
                Solicitar acceso
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Premium Version */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-background py-24 md:py-32">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-primary opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-primary opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-sm border border-primary/20 text-primary px-6 py-3 rounded-full text-sm font-semibold shadow-glow-subtle animate-fade-in">
              <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
              Plataforma Premium de Trading
            </div>
            
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-foreground">Trading Profesional</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent relative">
                  Sin vende humos
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-primary rounded-full opacity-60"></div>
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                  Ecosistema completo de trading: academia estructurada, señales verificadas, 
                  copy trading inteligente, herramientas profesionales y comunidad transparente.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                onClick={() => navigate("/onboarding?step=choose")}
                className="group relative bg-gradient-primary hover:shadow-glow-intense text-lg px-8 py-4 h-auto overflow-hidden transition-all duration-500 hover:scale-105"
                data-event="cta-solicitar-acceso-hero"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center gap-3">
                  Solicitar acceso
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/onboarding?step=validate")}
                className="group border-2 border-primary/30 bg-surface/50 backdrop-blur-sm text-primary hover:bg-primary/10 hover:border-primary hover:shadow-glow text-lg px-8 py-4 h-auto transition-all duration-500 hover:scale-105"
                data-event="cta-ya-tengo-cuenta-hero"
              >
                <Target className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                Ya tengo cuenta en Exness
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 opacity-60 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Sin membresías</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Transparente</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4 text-primary" />
                <span>Verificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              ¿Por qué el acceso sin membresía?
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

      {/* Why Exness - Enhanced */}
      <section id="exness" className="bg-background border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Por qué Exness para operar con estructura?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Elegimos Exness por condiciones que favorecen una operativa seria y medible: 
              ejecución estable, retiros ágiles y políticas claras. Eso nos permite construir 
              Tálamo sin membresía y con métricas coherentes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-line rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Retiros rápidos</h3>
              <p className="text-sm text-muted-foreground">
                Flujo estable y automatizado, incluso fines de semana
              </p>
            </div>
            
            <div className="bg-surface border border-line rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Ejecución transparente</h3>
              <p className="text-sm text-muted-foreground">
                Reglas claras de slippage y estabilidad en alta volatilidad
              </p>
            </div>
            
            <div className="bg-surface border border-line rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Spreads competitivos</h3>
              <p className="text-sm text-muted-foreground">
                Especialmente en XAUUSD, USOIL e índices
              </p>
            </div>
            
            <div className="bg-surface border border-line rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Seguridad</h3>
              <p className="text-sm text-muted-foreground">
                Estándares de seguridad y licenciamiento por entidad
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Disponibilidad y condiciones pueden variar según entidad/región. 
              Verifica directamente con el bróker.
            </p>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex flex-col gap-3 items-center">
              <Button 
                onClick={() => navigate("/onboarding?step=choose")}
                className="bg-gradient-primary hover:shadow-glow"
                data-event="cta-solicitar-acceso-exness"
              >
                Solicitar acceso
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <div className="flex gap-4 text-sm">
                <Button 
                  variant="link"
                  onClick={() => navigate("/onboarding?step=validate")}
                  className="text-muted-foreground hover:text-foreground"
                  data-event="cta-ya-tengo-cuenta-exness"
                >
                  Ya tengo cuenta
                </Button>
                <Button 
                  variant="link"
                  onClick={() => navigate("/onboarding?step=validate")}
                  className="text-muted-foreground hover:text-foreground"
                  data-event="cta-no-afiliado-exness"
                >
                  No estoy afiliado
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQExpanded />

      {/* CTA Section */}
      <section className="bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                ¿Listo para empezar?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Únete a Tálamo y comienza tu camino hacia el trading profesional
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/onboarding?step=choose")}
                className="bg-white text-primary hover:bg-white/90"
                data-event="cta-solicitar-acceso-final"
              >
                Solicitar acceso
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/onboarding?step=validate")}
                className="border-white text-white hover:bg-white/10"
                data-event="cta-validar-acceso-final"
              >
                <Target className="h-5 w-5 mr-2" />
                Ya tengo cuenta en Exness
              </Button>
            </div>
            
            {/* Additional option for non-affiliated users */}
            <div className="mt-4">
              <Button 
                variant="link"
                onClick={() => navigate("/onboarding?step=validate")}
                className="text-white/70 hover:text-white text-sm"
                data-event="cta-no-afiliado-final"
              >
                <Users className="h-4 w-4 mr-2" />
                Tengo cuenta pero no estoy afiliado a Tálamo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Tálamo</span>
              <span className="text-muted-foreground">Trading profesional, sin promesas vacías</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Button variant="link" className="text-muted-foreground">Términos</Button>
              <Button variant="link" className="text-muted-foreground">Privacidad</Button>
              <Button variant="link" className="text-muted-foreground">Riesgos</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPartnerModal(false)}
          />
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-partner-title"
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>

            <div className="space-y-4">
              <div>
                <h3 id="change-partner-title" className="text-xl font-bold text-white">
                  Cambiar Partner ID en Exness
                </h3>
                <p className="text-white/80 text-sm mt-2">
                  Sigue estos pasos para cambiar tu Partner ID a Tálamo:
                </p>
              </div>

              <ol className="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
                <li>Escribe al soporte de Exness y solicita <strong>cambio de partner</strong>.</li>
                <li>Indica este <strong>ID</strong>: <code className="px-1.5 py-0.5 rounded bg-white/10">{PARTNER_ID}</code> (Tálamo).</li>
                <li>Una vez confirmado, regresa y toca <em>Validar acceso</em>.</li>
              </ol>
              <p className="mt-4 text-xs text-white/60">
                Alternativa: crea una cuenta nueva con nuestro enlace y valida acceso.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(PARTNER_ID);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }} 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  <Copy className="h-4 w-4" /> {copied ? "¡Copiado!" : "Copiar ID"}
                </button>
                <button 
                  onClick={() => setShowPartnerModal(false)} 
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
