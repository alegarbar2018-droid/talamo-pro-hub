import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Users, 
  BookOpen, 
  Calculator,
  Trophy,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Academia Estructurada",
      description: "Formación progresiva de trading profesional en 5 niveles",
      highlights: ["Fundamentos sólidos", "Gestión de riesgo", "Estrategias avanzadas"]
    },
    {
      icon: TrendingUp,
      title: "Señales Verificadas",
      description: "Análisis profesional con transparencia total",
      highlights: ["Lógica detallada", "Risk/Reward claro", "Historial público"]
    },
    {
      icon: Users,
      title: "Copy Trading Inteligente",
      description: "Estrategias verificadas con gestión de riesgo integrada",
      highlights: ["Sin acceso a cuenta", "Control total", "Métricas reales"]
    },
    {
      icon: Calculator,
      title: "Herramientas Profesionales",
      description: "Calculadoras y utilidades para trading sistemático",
      highlights: ["Gestión de posición", "Journal de trading", "Análisis de riesgo"]
    },
    {
      icon: Trophy,
      title: "Competencias",
      description: "Torneos y challenges para mejorar habilidades",
      highlights: ["LATAM Trading Cup", "Leaderboards", "Premios reales"]
    },
    {
      icon: BarChart3,
      title: "Auditoría Transparente",
      description: "Verificación de cuentas reales (solo lectura)",
      highlights: ["MT4/MT5 compatible", "Métricas verificadas", "Transparencia total"]
    }
  ];

  const principles = [
    "Trading profesional, sin promesas vacías",
    "Educación antes que marketing",
    "Transparencia total en resultados",
    "Control de riesgo como prioridad"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Tálamo</h1>
              <Badge variant="outline" className="border-teal text-teal">MVP</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-primary hover:shadow-glow"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Trading Profesional
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Sin Promesas Vacías
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ecosistema completo de trading: academia estructurada, señales verificadas, 
              copy trading inteligente, herramientas profesionales y comunidad transparente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-gradient-primary hover:shadow-glow"
            >
              Comenzar Gratis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-teal text-teal hover:bg-teal/10"
            >
              <Target className="h-5 w-5 mr-2" />
              Demo (demo@email.com)
            </Button>
          </div>

          {/* Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {principles.map((principle, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-teal flex-shrink-0" />
                {principle}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Model Explanation */}
      <div className="bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                ¿Por qué es gratis?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nuestro modelo es simple y transparente: ganamos cuando tú ganas. 
                  Somos IB (Introducing Broker) de Exness, lo que significa que recibimos 
                  una comisión por spread cuando operas.
                </p>
                <p>
                  <strong className="text-foreground">No vendemos cursos.</strong> No necesitamos 
                  prometerte rentabilidades irreales. Nuestro incentivo está alineado contigo: 
                  mientras más exitoso seas y más confíes en operar, mejor para ambos.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Transparencia Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Publicamos resultados reales, avisos de riesgo claros y nunca 
                    prometemos rentabilidades garantizadas.
                  </p>
                </div>
              </div>
            </div>
            
            <Card className="border-teal/30 bg-teal/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Proceso de Acceso</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal text-black flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm">Regístrate en Tálamo (gratis)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal text-black flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm">Crea cuenta Exness con nuestro partner</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal text-black flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm">Acceso completo a toda la plataforma</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Aviso de Riesgo</h3>
                <p className="text-sm text-muted-foreground">
                  El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
                  cuentas de inversores minoristas pierden dinero al operar CFDs con este proveedor. 
                  Debe considerar si comprende cómo funcionan los CFDs y si puede permitirse el alto riesgo 
                  de perder su dinero. El rendimiento pasado no es indicativo de resultados futuros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Tálamo</span>
              <span className="text-muted-foreground">Trading profesional, sin promesas vacías</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Button variant="link" className="text-muted-foreground">Términos</Button>
              <Button variant="link" className="text-muted-foreground">Privacidad</Button>
              <Button variant="link" className="text-muted-foreground">Riesgos</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
