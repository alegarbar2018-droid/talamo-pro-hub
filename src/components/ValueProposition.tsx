import { Shield, TrendingUp, CheckCircle, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ValueProposition = () => {
  const navigate = useNavigate();
  
  return (
    <section id="propuesta" className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-background py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Parte 1: Por qué existimos */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Nuestro propósito
          </div>
          
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Trading serio, sin promesas vacías
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Nuestro modelo es <span className="text-primary font-semibold">gratis para ti</span>. 
            Ganamos por spread IB cuando operas en Exness con nuestra afiliación. 
            Eso alinea nuestro éxito con el tuyo.
          </p>
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <p className="text-base text-foreground leading-relaxed">
              No prometemos rentabilidad. Te damos <span className="text-primary font-semibold">estructura profesional</span>: 
              academia, señales, copy trading, herramientas y comunidad.
            </p>
          </div>
        </div>
        
        {/* Parte 2: Los 3 pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface/80 backdrop-blur-sm border border-line rounded-xl p-6 hover:shadow-glow-subtle hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 mx-auto">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Transparencia total</h3>
            <p className="text-muted-foreground text-center">
              Sin cargos ocultos. Todo claro desde día uno.
            </p>
          </div>
          
          <div className="bg-surface/80 backdrop-blur-sm border border-line rounded-xl p-6 hover:shadow-glow-subtle hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 mx-auto">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Ejecución con datos</h3>
            <p className="text-muted-foreground text-center">
              Métricas reales, no marketing exagerado.
            </p>
          </div>
          
          <div className="bg-surface/80 backdrop-blur-sm border border-line rounded-xl p-6 hover:shadow-glow-subtle hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 mx-auto">
              <CheckCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Riesgo gestionado</h3>
            <p className="text-muted-foreground text-center">
              Advertencias claras y control profesional.
            </p>
          </div>
        </div>
        
        {/* Parte 3: CTAs de acceso */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={() => navigate("/onboarding?step=validate")}
            className="bg-primary hover:bg-primary/90"
          >
            <Target className="h-5 w-5 mr-2" />
            Ya tengo cuenta Exness
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate("/onboarding?step=validate")}
          >
            <Users className="h-5 w-5 mr-2" />
            No estoy afiliado, cambiar partner
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
