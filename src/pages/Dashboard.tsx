import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  BarChart3,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/locale";
import AffiliationGate from "@/components/AffiliationGate";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, isValidated, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["dashboard", "common"]);
  
  // Real data queries
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  
  // Fetch published courses count for badge
  const { data: publishedCoursesCount } = useQuery({
    queryKey: ['published-courses-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('lms_courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      return count || 0;
    }
  });

  useEffect(() => {
    console.log('Dashboard - Auth state changed:', { 
      loading, 
      hasUser: !!user, 
      userEmail: user?.email 
    });

    // If not authenticated, redirect to login
    if (!loading && !user) {
      console.log('Dashboard - Redirecting to login, no user found');
      navigate("/login");
      return;
    }

    // If user is authenticated, allow access to dashboard
    // Remove validation requirement for now since it's causing issues
  }, [user, loading, navigate]);

  // Show loading skeleton while fetching stats
  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-line bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  // Real data from queries
  const academyProgress = dashboardStats?.academyProgress || 0;
  const quizSuccessRate = dashboardStats?.quizSuccessRate || 0;
  const completedLessons = dashboardStats?.completedLessons || 0;

  // Helper for dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard:greetings.morning");
    if (hour < 18) return t("dashboard:greetings.afternoon");
    return t("dashboard:greetings.evening");
  };

  const quickActions = [
    {
      title: t("dashboard:modules.academy.title"),
      description: t("dashboard:modules.academy.description"),
      icon: BookOpen,
      progress: academyProgress,
      action: () => navigate("/academy"),
      color: "teal",
      badge: publishedCoursesCount && publishedCoursesCount > 0 
        ? `${publishedCoursesCount} ${publishedCoursesCount === 1 ? 'course' : 'courses'}` 
        : undefined
    },
    {
      title: t("dashboard:modules.signals.title"),
      description: `3 ${t("dashboard:modules.signals.description")}`,
      icon: TrendingUp,
      badge: `3 ${t("dashboard:modules.signals.badge")}`,
      action: () => navigate("/signals"),
      color: "teal"
    },
    {
      title: t("dashboard:modules.copy.title"),
      description: t("dashboard:modules.copy.description"),
      icon: Users,
      badge: t("dashboard:modules.copy.badge"),
      action: () => navigate("/copy-trading"),
      color: "success"
    },
    {
      title: t("dashboard:modules.tools.title"),
      description: t("dashboard:modules.tools.description"),
      icon: Calculator,
      action: () => navigate("/tools"),
      color: "muted"
    }
  ];

  // Stats with real data
  const stats = [
    {
      title: "Completed Lessons",
      value: completedLessons,
      icon: BookOpen,
      trend: `${dashboardStats?.totalLessons || 0} total`,
      color: "teal"
    },
    {
      title: "Quiz Success Rate",
      value: `${quizSuccessRate}%`,
      icon: Trophy,
      trend: `${dashboardStats?.passedQuizzes}/${dashboardStats?.totalQuizzes} passed`,
      color: "success"
    },
    {
      title: t("dashboard:stats.academy_progress"),
      value: `${academyProgress}%`,
      icon: BarChart3,
      trend: "Overall progress",
      color: "info"
    }
  ];

  // Recent activity from real events
  const recentActivities = (dashboardStats?.recentEvents || []).map(event => ({
    title: (event as any).course_items?.title || 'Unknown',
    action: event.verb,
    time: new Date(event.created_at).toLocaleDateString(),
  }));

  // Checklist with real completion status
  const checklistItems = [
    { 
      task: t("dashboard:checklist.tasks.profile"), 
      done: dashboardStats?.checklist.profileComplete || false 
    },
    { 
      task: t("dashboard:checklist.tasks.academy"), 
      done: dashboardStats?.checklist.academyStarted || false 
    },
    { 
      task: t("dashboard:checklist.tasks.calculator"), 
      done: dashboardStats?.checklist.calculatorUsed || false 
    },
    { 
      task: t("dashboard:checklist.tasks.community"), 
      done: dashboardStats?.checklist.communityJoined || false 
    },
    { 
      task: t("dashboard:checklist.tasks.copy_trading"), 
      done: dashboardStats?.checklist.copyTradingUsed || false 
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("dashboard:title")}</h1>
              <p className="text-muted-foreground">{t("dashboard:subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-teal text-teal">
                {isValidated || user.isAffiliated ? t("dashboard:status.validated") : t("dashboard:status.demo")}
              </Badge>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={signOut}
              >
                {t("dashboard:actions.logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Premium */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-teal/10 via-surface to-cyan/10 p-8 border border-teal/20 animate-fade-in">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal to-cyan flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-teal/20">
              {user.profile?.first_name?.[0]?.toUpperCase() || user.email?.[0].toUpperCase()}
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {getGreeting()}
              </p>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {user.profile?.first_name || user.email?.split('@')[0] || 'Trader'}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="border-teal text-teal">
                  {isValidated || user.isAffiliated ? "✓ Cuenta Validada" : "Demo"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  🔥 {completedLessons} lecciones completadas
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-teal">{academyProgress}%</p>
              <p className="text-xs text-muted-foreground">Progreso total</p>
            </div>
          </div>
        </div>

        {/* Stats Cards con Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-line/50 bg-surface/50 backdrop-blur-xl hover:shadow-glow-subtle hover:-translate-y-1 transition-all duration-300 dashboard-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal/0 to-cyan/0 group-hover:from-teal/10 group-hover:to-cyan/10 transition-all duration-500" />
              
              <CardContent className="relative z-10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-teal/10 group-hover:bg-teal/20 transition-colors">
                    <stat.icon className="h-6 w-6 text-teal group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +12% ↗
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal to-cyan rounded-full transition-all duration-1000" style={{width: '65%'}} />
                    </div>
                    <span className="text-xs text-teal whitespace-nowrap">{stat.trend}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions con Hover Effects Avanzados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-line bg-surface hover:border-teal/50 transition-all duration-300 cursor-pointer dashboard-card"
              onClick={action.action}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-2px] bg-gradient-to-br from-teal via-cyan to-teal rounded-lg blur-sm" />
              </div>
              
              <div className="relative bg-surface rounded-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <action.icon className="h-6 w-6 text-teal" />
                    </div>
                    {action.badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs animate-pulse bg-teal/10 text-teal border-teal/30"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg text-foreground group-hover:text-teal transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {action.progress !== undefined && (
                    <div className="space-y-2 mb-4">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal to-cyan rounded-full transition-all duration-1000"
                          style={{width: `${action.progress}%`}}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {action.progress}% completado
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-teal hover:bg-teal/10 group-hover:translate-x-1 transition-transform"
                  >
                    {t("dashboard:actions.go")} 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity & Checklist Mejorados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <Card className="border-line bg-surface/80 backdrop-blur-sm dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal" />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription>Tus últimas acciones</CardDescription>
                </div>
                <Badge variant="outline" className="text-teal border-teal">
                  {recentActivities.length} actividades
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="relative space-y-4">
                {recentActivities.length > 0 && (
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-teal via-cyan to-transparent" />
                )}
                
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="relative flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-line/50 hover:border-teal/30 transition-colors animate-fade-in"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="relative z-10 p-2 rounded-full bg-teal/20 ring-4 ring-surface">
                        <BookOpen className="h-4 w-4 text-teal" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                      
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay actividad reciente aún
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-teal text-teal hover:bg-teal/10"
                onClick={() => navigate("/academy")}
              >
                Ir a Academia
              </Button>
            </CardContent>
          </Card>

          {/* Checklist Mejorado */}
          <Card className="border-line bg-surface/80 backdrop-blur-sm dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-teal" />
                {t("dashboard:checklist.title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("dashboard:checklist.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklistItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-line/50 hover:border-teal/30 transition-all animate-fade-in"
                    style={{animationDelay: `${index * 80}ms`}}
                  >
                    {item.done ? (
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-6 h-6 bg-success/20 rounded-full animate-pulse" />
                        <CheckCircle className="h-5 w-5 text-success relative z-10" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted group-hover:border-teal/50 transition-colors" />
                    )}
                    <span className={`text-sm flex-1 transition-all ${item.done ? 'text-muted-foreground line-through' : 'text-foreground group-hover:text-teal'}`}>
                      {item.task}
                    </span>
                    {!item.done && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Warning Premium */}
        <Card className="relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 mt-8 dashboard-card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          
          <CardContent className="relative z-10 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {t("dashboard:risk_warning.title")}
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    Importante
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("dashboard:risk_warning.text")}
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