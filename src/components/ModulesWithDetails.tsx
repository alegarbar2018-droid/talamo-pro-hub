import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen,
  TrendingUp,
  Users,
  Calculator,
  Trophy,
  BarChart3
} from "lucide-react";

const ModulesWithDetails = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Academia Estructurada",
      description: "Formación progresiva de trading profesional en 5 niveles",
      highlights: ["Fundamentos sólidos", "Gestión de riesgo", "Estrategias avanzadas"],
      details: [
        "Criterios mínimos de progresión entre niveles",
        "Evaluaciones prácticas con métricas verificables",
        "Mentoring peer-to-peer estructurado",
        "Certificación interna por nivel completado",
        "Journal obligatorio con feedback quincenal"
      ]
    },
    {
      icon: TrendingUp,
      title: "Señales Verificadas",
      description: "Análisis profesional con transparencia total",
      highlights: ["Lógica detallada", "Risk/Reward claro", "Historial público"],
      details: [
        "Criterios mínimos: RR ≥1:2, win rate ≥40%, sample ≥100",
        "Publicación solo después de 3 meses de track record",
        "Auditoría mensual de resultados por terceros",
        "Invalidación automática si DD >15% en 30 días",
        "Transparencia total: drawdowns y rachas perdedoras visibles"
      ]
    },
    {
      icon: Users,
      title: "Copy Trading Inteligente",
      description: "Estrategias verificadas con gestión de riesgo integrada",
      highlights: ["Sin acceso a cuenta", "Control total", "Métricas reales"],
      details: [
        "Filtros de riesgo: máximo 2% por trade, DD límite 20%",
        "Copy solo con investor password (lectura)",
        "Alertas automáticas, ejecución manual opcional",
        "Diversificación automática entre máximo 3 estrategias",
        "Pausas automáticas si estrategia excede límites"
      ]
    },
    {
      icon: Calculator,
      title: "Herramientas Profesionales",
      description: "Calculadoras y utilidades para trading sistemático",
      highlights: ["Gestión de posición", "Journal de trading", "Análisis de riesgo"],
      details: [
        "Calculadora de posición con vol targeting",
        "Journal integrado con métricas PF, SQN, Sharpe",
        "Backtesting walk-forward automatizado",
        "Alertas de límites diarios/semanales configurables",
        "Exportación compatible con MT4/MT5 y Excel"
      ]
    },
    {
      icon: Trophy,
      title: "Competencias",
      description: "Torneos y challenges para mejorar habilidades",
      highlights: ["LATAM Trading Cup", "Leaderboards", "Premios reales"],
      details: [
        "Competencias solo en demo con fondos virtual iguales",
        "Métricas de evaluación: Profit Factor, Sharpe, Max DD",
        "Duración estándar: 3 meses con auditoría externa",
        "Premios en educación, software, o acceso premium",
        "Transparencia total: todas las operaciones visibles"
      ]
    },
    {
      icon: BarChart3,
      title: "Auditoría Transparente",
      description: "Verificación de cuentas reales (solo lectura)",
      highlights: ["MT4/MT5 compatible", "Métricas verificadas", "Transparencia total"],
      details: [
        "Solo investor password (read-only), nunca trading password",
        "Cálculo automático de métricas: PF, win rate, Sharpe, DD",
        "Verificación de terceros para traders públicos",
        "Privacidad garantizada: datos agregados, no trades específicos",
        "Revocación de acceso inmediata desde MT4/MT5"
      ]
    }
  ];

  return (
    <section id="modulos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ecosistema Completo de Trading
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Todo lo que necesitas para desarrollarte como trader profesional, 
          en una sola plataforma transparente y gratuita.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-line bg-surface hover:shadow-glow-subtle transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <feature.icon className="h-8 w-8 text-teal" />
                <div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-muted-foreground">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                    {highlight}
                  </li>
                ))}
              </ul>
              
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-teal hover:text-teal/80 transition-colors">
                  Ver detalles técnicos
                </summary>
                <div className="mt-3 space-y-2 border-t border-line pt-3">
                  {feature.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground leading-relaxed">
                      • {detail}
                    </p>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ModulesWithDetails;