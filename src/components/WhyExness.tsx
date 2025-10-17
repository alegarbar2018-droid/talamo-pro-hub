import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Clock, 
  TrendingDown, 
  Shield,
  BarChart3,
  CheckCircle,
  DollarSign,
  Globe,
  ArrowRight
} from "lucide-react";

const WhyExness = () => {
  const reasons = [
    {
      icon: Zap,
      title: "Ejecución rápida y confiable",
      description: "Modelos Instant/Market con regulación CySEC"
    },
    {
      icon: TrendingDown,
      title: "Spreads competitivos",
      description: "Desde 0.0 pips en pares principales"
    },
    {
      icon: Shield,
      title: "Sin comisiones ocultas",
      description: "Transparencia en costos de trading"
    }
  ];

  const contributions = [
    {
      icon: BarChart3,
      title: "Backtesting y métricas más estables"
    },
    {
      icon: DollarSign,
      title: "Flujos de retiro que apoyan la disciplina"
    },
    {
      icon: Globe,
      title: "Amplio abanico de instrumentos para señales/copy/EAs"
    },
    {
      icon: CheckCircle,
      title: "Prácticas de seguridad acordes a operación seria"
    }
  ];

  return (
    <section id="exness" className="bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-primary/10 to-accent/5 rounded-3xl blur-3xl"></div>
          
          <div className="relative">
            {/* Premium badge */}
            <div className="inline-block mb-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal via-primary to-accent rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-background/90 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal to-primary animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground tracking-wider uppercase">
                    Broker Premium #1
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal via-primary to-accent bg-clip-text text-transparent">
                ¿Por qué Exness
              </span>
              <br />
              <span className="text-foreground">
                es la elección profesional?
              </span>
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="inline-block bg-gradient-to-r from-teal to-primary bg-clip-text text-transparent font-bold text-xl">
                  +18 millones de traders
                </span> confían en Exness globalmente.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Elegimos Exness porque ofrece las mejores condiciones para trading profesional: 
                <span className="text-foreground font-semibold"> spreads desde 0.0 pips, retiros instantáneos 24/7</span> y ejecución Market sin rechazos.
              </p>
            </div>

            {/* Premium features cards */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal/40 to-primary/40 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <span className="text-sm font-medium text-foreground">Regulado CySEC</span>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 to-accent/40 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                  <span className="text-sm font-medium text-foreground">Sin comisiones ocultas</span>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/40 to-teal/40 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                  <span className="text-sm font-medium text-foreground">Apalancamiento 1:2000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reasons.map((reason, index) => (
            <Card key={index} className="border-line bg-background">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <reason.icon className="h-6 w-6 text-teal" />
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-teal/30 bg-teal/5 mb-6">
          <CardHeader>
            <CardTitle className="text-center">Cómo aporta a Tálamo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contributions.map((contribution, index) => (
                <div key={index} className="flex items-center gap-3">
                  <contribution.icon className="h-5 w-5 text-teal flex-shrink-0" />
                  <span className="text-sm text-foreground">{contribution.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold">¿Listo para comenzar?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crea tu cuenta Exness con nuestro partner ID y accede a Tálamo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/onboarding?step=choose'}
                className="bg-gradient-to-r from-teal via-primary to-accent hover:opacity-90"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Crear cuenta Exness
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/onboarding?step=validate'}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Ya tengo cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyExness;