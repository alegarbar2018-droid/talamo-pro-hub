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
    <section id="modulos" className="relative py-24 overflow-hidden">
      {/* Premium background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--teal)_0%,_transparent_70%)] opacity-5" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-r from-teal/20 to-accent/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-2xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-teal to-accent bg-clip-text text-transparent">
              Ecosistema Completo
            </span>
            <br />
            <span className="text-foreground">de Trading</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Todo lo que necesitas para desarrollarte como trader profesional, 
            en una sola plataforma transparente y gratuita.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal to-accent mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative border-line/50 bg-gradient-to-b from-surface/80 to-surface/40 backdrop-blur-sm hover:shadow-glow-elegant hover:border-teal/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-accent/20 group-hover:from-teal/30 group-hover:to-accent/30 transition-colors duration-300">
                    <feature.icon className="h-7 w-7 text-teal group-hover:text-teal-bright transition-colors duration-300" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground group-hover:text-teal transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <ul className="space-y-3 mb-6">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal to-accent flex-shrink-0" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <details className="group/details">
                  <summary className="cursor-pointer text-sm font-medium text-teal hover:text-teal-bright transition-colors duration-300 flex items-center gap-2">
                    <span>Ver detalles técnicos</span>
                    <div className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center group-hover/details:bg-teal/30 transition-colors duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                    </div>
                  </summary>
                  <div className="mt-4 space-y-3 border-t border-gradient-to-r from-transparent via-line to-transparent pt-4">
                    {feature.details.map((detail, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground leading-relaxed pl-4 border-l-2 border-teal/20 hover:border-teal/40 transition-colors duration-300">
                        {detail}
                      </p>
                    ))}
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal/60" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-teal/60 to-accent/60" />
            <div className="w-2 h-2 rounded-full bg-accent/60" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesWithDetails;