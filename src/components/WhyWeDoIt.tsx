import { CheckCircle, TrendingUp, Shield } from "lucide-react";

const WhyWeDoIt = () => {
  return (
    <section id="por-que-lo-hacemos" className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-background py-24">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Shield className="h-4 w-4" />
            Nuestro propósito
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
            Por qué lo hacemos
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="bg-surface/50 backdrop-blur-sm border border-line rounded-2xl p-8 shadow-glow-subtle hover:shadow-glow transition-all duration-500">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                En Tálamo vimos un problema claro: <span className="text-primary font-semibold">demasiadas promesas vacías</span>. 
                El trading no es malo; el problema es hacerlo sin estructura. Por eso construimos un ecosistema que te ayuda 
                a aprender, ejecutar y medir.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Nuestro modelo es <span className="text-primary font-semibold">gratis para ti</span>. Ganamos por spread IB cuando operas en Exness con 
                nuestra afiliación. Eso nos alinea contigo: si te va bien y confías, operas más; 
                si operas más, nosotros ganamos.
              </p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <p className="text-lg text-foreground leading-relaxed font-medium">
                  No prometemos rentabilidad. Te damos <span className="text-primary">estructura profesional</span>: 
                  academia por niveles, señales verificadas, copy con filtros, EAs con control de riesgo, 
                  herramientas, auditoría y comunidad.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <div className="group bg-surface/80 backdrop-blur-sm border border-line rounded-2xl p-6 shadow-glow-subtle hover:shadow-glow hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Transparencia total
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sin cargos ocultos ni membresías. Todo transparente desde el primer día.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-surface/80 backdrop-blur-sm border border-line rounded-2xl p-6 shadow-glow-subtle hover:shadow-glow hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Ejecución con datos
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    No marketing exagerado. Solo métricas reales y resultados verificables.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-surface/80 backdrop-blur-sm border border-line rounded-2xl p-6 shadow-glow-subtle hover:shadow-glow hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Riesgo advertido y gestionado
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Control profesional con advertencias claras sobre los riesgos del trading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeDoIt;