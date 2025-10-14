import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  BookOpen, 
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
// Temporalmente comentamos recharts hasta resolver dependencias
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

// Mock data for charts
const signalsData = [
  { month: 'Ene', signals: 45, profit: 12.5 },
  { month: 'Feb', signals: 52, profit: 18.2 },
  { month: 'Mar', signals: 38, profit: 9.8 },
  { month: 'Abr', signals: 67, profit: 22.1 },
  { month: 'May', signals: 59, profit: 15.6 },
  { month: 'Jun', signals: 73, profit: 28.4 },
];

const courseCompletionData = [
  { name: 'Nivel Básico', value: 320 },
  { name: 'Nivel Intermedio', value: 150 },
  { name: 'Nivel Avanzado', value: 89 },
];

const COLORS = ['#0891b2', '#06b6d4', '#67e8f9'];

export const AdminDashboard: React.FC = () => {
  // Fetch dashboard metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: async () => {
      const [
        usersResult, 
        affiliatedResult, 
        completedLessonsResult,
        quizAttemptsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('affiliations').select('id', { count: 'exact', head: true }).eq('is_affiliated', true),
        supabase.from('course_events').select('id', { count: 'exact', head: true })
          .eq('verb', 'completed')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('lms_quiz_attempts').select('id, passed')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const totalQuizzes = quizAttemptsResult.data?.length || 0;
      const passedQuizzes = quizAttemptsResult.data?.filter(q => q.passed).length || 0;
      const quizPassRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;

      return {
        totalUsers: usersResult.count || 0,
        affiliatedUsers: affiliatedResult.count || 0,
        completedLessonsThisMonth: completedLessonsResult.count || 0,
        quizPassRate,
      };
    },
  });

  // Fetch recent activity
  const { data: recentActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Usuarios Totales',
      value: metrics?.totalUsers || 0,
      description: 'Usuarios registrados',
      icon: Users,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Usuarios Afiliados',
      value: metrics?.affiliatedUsers || 0,
      description: 'Verificados con Exness',
      icon: UserCheck,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Lecciones Completadas',
      value: metrics?.completedLessonsThisMonth || 0,
      description: 'Últimos 30 días',
      icon: BookOpen,
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Tasa de Aprobación Quizzes',
      value: `${metrics?.quizPassRate || 0}%`,
      description: 'Últimos 30 días',
      icon: TrendingUp,
      trend: '+8%',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de la actividad y métricas de la plataforma
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{card.description}</span>
                <Badge 
                  variant={card.trendUp ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row - Temporalmente simplificado */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Signals Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Señales y Rentabilidad</CardTitle>
            <CardDescription>Señales publicadas y rentabilidad promedio por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Gráfico de señales</p>
                <p className="text-xs text-muted-foreground">Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Completion Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Completación de Cursos</CardTitle>
            <CardDescription>Distribución por nivel de dificultad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Estadísticas de cursos</p>
                <p className="text-xs text-muted-foreground">Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones administrativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-teal rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.resource && `${activity.resource} • `}
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Servicios y integraciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Base de Datos</span>
                </div>
                <Badge variant="default">Operativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">API Exness</span>
                </div>
                <Badge variant="default">Conectado</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">CRM Webhook</span>
                </div>
                <Badge variant="secondary">Pendiente</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">n8n Workflows</span>
                </div>
                <Badge variant="outline">Configurando</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};