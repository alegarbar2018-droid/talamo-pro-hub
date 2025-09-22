import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Regístrate en Tálamo",
      description: "Completamente gratis, sin compromisos",
      detail: "Acceso inmediato a nuestra academia y herramientas básicas"
    },
    {
      number: "2", 
      title: "Crea cuenta Exness",
      description: "Con nuestro partner ID para acceso completo",
      detail: "Plataforma regulada y transparente, sin costos ocultos"
    },
    {
      number: "3",
      title: "Acceso completo",
      description: "A toda la plataforma de forma inmediata", 
      detail: "Señales, copy trading, competencias y auditoría"
    }
  ];

  return (
    <section id="como-funciona" className="relative py-24 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent)_0%,_transparent_70%)] opacity-5" />
      
      {/* Floating elements */}
      <div className="absolute top-10 right-1/4 w-20 h-20 bg-gradient-to-r from-teal/10 to-accent/10 rounded-full blur-xl animate-pulse delay-300" />
      <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl animate-pulse delay-700" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-teal" />
            <span className="text-sm font-medium text-teal tracking-wider uppercase">Proceso Simple</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-teal to-accent bg-clip-text text-transparent">
              Cómo funciona
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Proceso simple y transparente para acceder a todo el ecosistema de Tálamo
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal to-accent mx-auto mt-6 rounded-full" />
        </div>
        
        <Card className="relative border-line/50 bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-sm shadow-glow-elegant">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-accent/5 rounded-lg" />
          
          <CardContent className="relative p-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-3">Proceso de Acceso</h3>
              <p className="text-muted-foreground">En solo 3 pasos simples</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-teal/50 via-accent/50 to-teal/50" />
              
              {steps.map((step, index) => (
                <div key={index} className="group relative text-center space-y-6">
                  {/* Step indicator */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal to-accent p-0.5 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal to-accent bg-clip-text text-transparent">
                          {step.number}
                        </span>
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-teal/20 to-accent/20 mx-auto blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Check mark for completed appearance */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-teal to-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
                      <CheckCircle className="h-4 w-4 text-background" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-foreground group-hover:text-teal transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground/80 italic">
                      {step.detail}
                    </p>
                  </div>
                  
                  {/* Arrow for desktop (except last step) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-6 text-teal/50 group-hover:text-teal group-hover:translate-x-1 transition-all duration-300">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Bottom accent */}
            <div className="flex justify-center mt-12 pt-8 border-t border-gradient-to-r from-transparent via-line to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal to-accent" />
                <span className="text-sm text-muted-foreground font-medium">Listo para comenzar</span>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-teal" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorks;