import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      title: "Ejecución reproducible",
      description: "Modelos Instant/Market y reglas de deslizamiento claras. Esto ayuda a que tus entradas/salidas sean medibles y tus resultados comparables entre sesiones."
    },
    {
      icon: Clock,
      title: "Retiros ágiles",
      description: "Alta tasa de procesamiento automático, incluso fines de semana. Facilita ciclos de capital predefinidos (retiros periódicos, gestión emocional)."
    },
    {
      icon: TrendingDown,
      title: "Spreads competitivos",
      description: "Costos ajustados, especialmente en oro y petróleo, lo que favorece RR realista y planificación de stops."
    },
    {
      icon: Shield,
      title: "Seguridad y cumplimiento",
      description: "Estándares de seguridad y cumplimiento. Tu cuenta siempre es tuya; Tálamo no toca tus fondos."
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

        <div className="mt-8 text-center space-y-4">
          <div className="bg-gradient-primary/10 border border-primary/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-2">
              🎯 ¿Listo para operar con Exness?
            </h3>
            <p className="text-muted-foreground mb-4">
              Únete a Tálamo y accede a tu cuenta Exness con condiciones preferenciales
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.href = '/onboarding?step=choose'}
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
              >
                🚀 Crear cuenta Exness gratis
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => window.location.href = '/onboarding?step=validate'}
                className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300"
              >
                ✅ Ya tengo cuenta, validar
              </button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>
              <strong>Nota:</strong> Disponibilidad y condiciones pueden variar según entidad y país. 
              El trading de CFDs conlleva riesgos de pérdida. Verifica la información directamente con el bróker.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyExness;