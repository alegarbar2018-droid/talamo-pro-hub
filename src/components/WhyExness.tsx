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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            🏆 ¿Por qué Exness es el broker #1 para traders serios?
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            <span className="text-primary font-semibold">+18 millones de traders</span> confían en Exness globalmente. 
            Elegimos Exness porque ofrece las mejores condiciones para trading profesional: 
            <span className="text-foreground font-medium">spreads desde 0.0 pips, retiros instantáneos 24/7</span> y ejecución Market sin rechazos.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-medium">
            ✅ Regulado CySEC | ✅ Sin comisiones ocultas | ✅ Apalancamiento 1:2000
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