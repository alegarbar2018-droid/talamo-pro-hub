import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Calculator, 
  Trophy, 
  Eye,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AffiliationGate from "@/components/AffiliationGate";

const Dashboard = () => {
  const { user, isValidated, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // If not validated/affiliated, redirect to onboarding
    if (!loading && user && !isValidated && !user.isAffiliated) {
      navigate("/onboarding");
      return;
    }
  }, [user, isValidated, loading, navigate]);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Cargando...</div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user || (!isValidated && !user.isAffiliated)) {
    return null;
  }

  const academyProgress = 25; // Mock progress
  const tradesThisWeek = 12;
  const winRate = 67;

  const quickActions = [
    {
      title: "Academia",
      description: "Continúa tu formación",
      icon: BookOpen,
      progress: academyProgress,
      action: () => navigate("/academy"),
      color: "teal"
    },
    {
      title: "Señales Activas",
      description: "3 señales disponibles",
      icon: TrendingUp,
      badge: "3 nuevas",
      action: () => navigate("/signals"),
      color: "teal"
    },
    {
      title: "Copy Trading",
      description: "Estrategias verificadas",
      icon: Users,
      badge: "Moderado activo",
      action: () => navigate("/copy-trading"),
      color: "success"
    },
    {
      title: "Herramientas",
      description: "Calculadoras y análisis",
      icon: Calculator,
      action: () => navigate("/tools"),
      color: "muted"
    }
  ];

  const stats = [
    {
      title: "Trades esta semana",
      value: tradesThisWeek,
      icon: Activity,
      trend: "+3 vs semana anterior"
    },
    {
      title: "Win Rate",
      value: `${winRate}%`,
      icon: Target,
      trend: "+5% vs mes anterior"
    },
    {
      title: "Progreso Academia",
      value: `${academyProgress}%`,
      icon: BarChart3,
      trend: "Nivel 1 completado"
    }
  ];

  const recentSignals = [
    {
      instrument: "XAUUSD",
      type: "LONG",
      rr: "1:3",
      status: "Activa",
      time: "Hace 2h"
    },
    {
      instrument: "EURUSD",
      type: "SHORT",
      rr: "1:2.5",
      status: "TP alcanzado",
      time: "Hace 1d"
    },
    {
      instrument: "GBPJPY",
      type: "LONG",
      rr: "1:2",
      status: "SL alcanzado",
      time: "Hace 2d"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tálamo</h1>
              <p className="text-muted-foreground">Trading profesional, sin promesas vacías</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-teal text-teal">
                {user.isAffiliated ? "Validado" : "Demo"}
              </Badge>
              <Button 
                variant="ghost" 
                onClick={signOut}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bienvenido, {user.profile?.first_name ? `${user.profile.first_name} ${user.profile.last_name || ''}`.trim() : user.email?.split('@')[0] || 'Usuario'}
          </h2>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de tu progreso y actividades recientes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-line bg-surface">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-teal">{stat.trend}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-teal" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="border-line bg-surface hover:shadow-glow-subtle transition-all cursor-pointer"
              onClick={action.action}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <action.icon className="h-6 w-6 text-teal" />
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg text-foreground">{action.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {action.progress && (
                  <div className="space-y-2">
                    <Progress value={action.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{action.progress}% completado</p>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="w-full mt-2 text-teal hover:bg-teal/10">
                  Ir <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Signals */}
          <Card className="border-line bg-surface">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal" />
                Señales Recientes
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Últimas señales y sus resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSignals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background border border-line">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={signal.type === "LONG" ? "default" : "secondary"}
                        className={signal.type === "LONG" ? "bg-success" : "bg-destructive"}
                      >
                        {signal.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-foreground">{signal.instrument}</p>
                        <p className="text-xs text-muted-foreground">RR {signal.rr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{signal.status}</p>
                      <p className="text-xs text-muted-foreground">{signal.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-teal text-teal hover:bg-teal/10">
                Ver todas las señales
              </Button>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-line bg-surface">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-teal" />
                Checklist de Inicio
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Completa estos pasos para maximizar tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { task: "Completar perfil de trading", done: true },
                  { task: "Leer Nivel 0 de Academia", done: true },
                  { task: "Configurar calculadora de riesgo", done: false },
                  { task: "Unirse a la comunidad", done: false },
                  { task: "Configurar copy trading", done: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {item.done ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                    <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Warning */}
        <Card className="border-warning/20 bg-warning/5 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Aviso de Riesgo</h3>
                <p className="text-sm text-muted-foreground">
                  El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
                  cuentas de inversores minoristas pierden dinero al operar CFDs. Debe considerar si comprende 
                  cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;