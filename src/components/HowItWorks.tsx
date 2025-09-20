import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proceso simple y transparente para acceder a todo el ecosistema de Tálamo
          </p>
        </div>
        
        <Card className="border-teal/30 bg-teal/5">
          <CardContent className="p-8">
            <h3 className="font-semibold text-foreground mb-6 text-center">Proceso de Acceso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal text-black flex items-center justify-center text-lg font-bold mx-auto">1</div>
                <h4 className="font-semibold text-foreground">Regístrate en Tálamo</h4>
                <p className="text-sm text-muted-foreground">Completamente gratis, sin compromisos</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal text-black flex items-center justify-center text-lg font-bold mx-auto">2</div>
                <h4 className="font-semibold text-foreground">Crea cuenta Exness</h4>
                <p className="text-sm text-muted-foreground">Con nuestro partner ID para acceso completo</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal text-black flex items-center justify-center text-lg font-bold mx-auto">3</div>
                <h4 className="font-semibold text-foreground">Acceso completo</h4>
                <p className="text-sm text-muted-foreground">A toda la plataforma de forma inmediata</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorks;