import { CheckCircle, TrendingUp, Shield } from "lucide-react";

const WhyWeDoIt = () => {
  return (
    <section id="por-que-lo-hacemos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Por qué lo hacemos
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            En Tálamo vimos un problema claro: demasiadas promesas vacías. El trading no es malo; 
            el problema es hacerlo sin estructura. Por eso construimos un ecosistema que te ayuda 
            a aprender, ejecutar y medir.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            Nuestro modelo es gratis para ti. Ganamos por spread IB cuando operas en Exness con 
            nuestra afiliación. Eso nos alinea contigo: si te va bien y confías, operas más; 
            si operas más, nosotros ganamos.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            No prometemos rentabilidad. Te damos estructura profesional: academia por niveles, 
            señales verificadas, copy con filtros, EAs con control de riesgo, herramientas, 
            auditoría y comunidad.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Transparencia total</h3>
              <p className="text-sm text-muted-foreground">Sin cargos ocultos</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Ejecución con datos</h3>
              <p className="text-sm text-muted-foreground">No marketing</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Riesgo advertido y gestionado</h3>
              <p className="text-sm text-muted-foreground">Control profesional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeDoIt;