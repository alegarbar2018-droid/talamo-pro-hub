import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen,
  TrendingUp,
  Users,
  Calculator,
  Trophy,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { TechTerm } from "./TechTerm";

const ModulesWithDetails = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: BookOpen,
      title: "Academia Estructurada",
      description: "Formación progresiva de trading profesional en 5 niveles",
      highlights: ["Fundamentos sólidos", "Gestión de riesgo", "Estrategias avanzadas"],
      infoLink: "/academy-info",
      tooltip: "146 lecciones organizadas en 3 niveles: Fundamentos, Intermedio y Avanzado. Progresión validada con quizzes."
    },
    {
      icon: TrendingUp,
      title: "Señales Verificadas",
      description: () => (
        <span>
          Análisis profesional con <TechTerm term="RR" definition="Risk/Reward: Relación entre el riesgo asumido y la ganancia potencial. RR 1:2 significa arriesgar $1 para ganar $2">RR</TechTerm> mínimo de 1:2
        </span>
      ),
      highlights: ["Lógica detallada", "Risk/Reward claro", "Historial público"],
      infoLink: "/signals-info",
      tooltip: "Publicamos señales solo después de verificar 3 meses de track record con métricas profesionales"
    },
    {
      icon: Users,
      title: "Copy Trading Inteligente",
      description: "Estrategias verificadas con gestión de riesgo integrada",
      highlights: ["Sin acceso a cuenta", "Control total", "Métricas reales"],
      infoLink: "/copy-info",
      tooltip: "Alertas automáticas, ejecución manual opcional. Sin acceso a tu cuenta de trading."
    },
    {
      icon: Calculator,
      title: "Herramientas Profesionales",
      description: () => (
        <span>
          Calculadoras y utilidades con métricas como <TechTerm term="PF" definition="Profit Factor: Ratio entre ganancias totales y pérdidas totales. PF > 1.5 indica buena estrategia">PF</TechTerm>, <TechTerm term="Sharpe" definition="Sharpe Ratio: Mide el retorno ajustado por riesgo. Sharpe > 1.0 es bueno, > 2.0 es excelente">Sharpe</TechTerm> y más
        </span>
      ),
      highlights: ["Gestión de posición", "Journal de trading", "Análisis de riesgo"],
      infoLink: "/tools-info",
      tooltip: "Suite completa de herramientas profesionales para operativa sistemática"
    },
    {
      icon: Trophy,
      title: "Competencias",
      description: "Torneos y challenges para mejorar habilidades",
      highlights: ["LATAM Trading Cup", "Leaderboards", "Premios reales"],
      tooltip: "Competencias solo en demo con fondos virtuales iguales. Métricas de evaluación verificadas."
    },
    {
      icon: BarChart3,
      title: "Auditoría Transparente",
      description: () => (
        <span>
          Verificación de cuentas reales con <TechTerm term="Investor Password" definition="Contraseña de solo lectura que permite ver operaciones sin poder ejecutar trades. Tu cuenta permanece 100% segura.">investor password</TechTerm> (solo lectura)
        </span>
      ),
      highlights: ["MT4/MT5 compatible", "Métricas verificadas", "Transparencia total"],
      tooltip: "Solo lectura, nunca acceso de trading. Cálculo automático de métricas profesionales."
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
                  {typeof feature.description === 'function' ? feature.description() : feature.description}
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
                
                {feature.infoLink && (
                  <Button 
                    variant="link" 
                    onClick={() => navigate(feature.infoLink)}
                    className="text-primary hover:underline p-0 h-auto"
                  >
                    Ver más detalles
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
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