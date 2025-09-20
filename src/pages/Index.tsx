import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Copy,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ValidateCTA } from "@/components/ValidateCTA";
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
              <Button variant="outline" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </Button>
              <ValidateCTA 
                onOpenChangePartner={() => setShowPartnerModal(true)}
                variant="outline"
                className="mb-6"
              />
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-primary hover:shadow-glow"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Trading Profesional
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Sin vende humos
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ecosistema completo de trading: academia estructurada, señales verificadas, 
              copy trading inteligente, herramientas profesionales y comunidad transparente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => {
                console.info('CTA: Crear Cuenta Exness');
                window.open("https://one.exnessonelink.com/boarding/sign-up/303589/a/nvle22j1te?lng=es", "_blank");
              }}
              className="bg-gradient-primary hover:shadow-glow"
              data-event="cta-crear-cuenta-hero"
            >
              Crear Cuenta Exness
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <ValidateCTA 
              onOpenChangePartner={() => setShowPartnerModal(true)}
              variant="outline"
              size="lg"
              className="mb-6"
            />
          </div>

          {/* Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {principles.map((principle, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-teal flex-shrink-0" />
                {principle}
              </div>
            ))}
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
              ¿Por qué es gratis?
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
                <ValidateCTA 
                  onOpenChangePartner={() => setShowPartnerModal(true)}
                  variant="outline"
                  className="mb-6"
                />
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
                onClick={() => {
                  console.info('CTA: Crear Cuenta Exness - Final');
                  window.open("https://one.exnessonelink.com/boarding/sign-up/303589/a/nvle22j1te?lng=es", "_blank");
                }}
                className="bg-white text-primary hover:bg-white/90"
                data-event="cta-crear-cuenta-final"
              >
                Crear Cuenta Exness
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <ValidateCTA 
                onOpenChangePartner={() => setShowPartnerModal(true)}
                variant="outline"
                size="lg"
                className="mb-6 [&>button]:border-white [&>button]:text-white [&>button]:hover:bg-white/10"
              />
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
                <li>Indica este <strong>ID</strong>: <code className="px-1.5 py-0.5 rounded bg-white/10">1141465940423171000</code> (Tálamo).</li>
                <li>Una vez confirmado, regresa y toca <em>Validar acceso</em>.</li>
              </ol>
              <p className="mt-4 text-xs text-white/60">
                Alternativa: crea una cuenta nueva con nuestro enlace y valida acceso.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("1141465940423171000");
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
