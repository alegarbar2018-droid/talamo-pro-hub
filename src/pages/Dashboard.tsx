import { useState, useEffect, memo } from "react";
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
  Settings,
  BookMarked,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/locale";
import AffiliationGate from "@/components/AffiliationGate";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Memoize heavy card components
const StatCard = memo(({ stat, index }: any) => (
  <Card 
    className="group relative overflow-hidden border-teal/20 bg-white/90 backdrop-blur-xl hover:shadow-xl hover:shadow-teal/20 hover:-translate-y-1 transition-all duration-300 dashboard-card"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-cyan/5 to-transparent group-hover:from-teal/10 group-hover:to-cyan/10 transition-all duration-500" />
    
    <CardContent className="relative z-10 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20 group-hover:from-teal/30 group-hover:to-cyan/30 transition-all shadow-md">
          <stat.icon className="h-6 w-6 text-teal group-hover:scale-110 transition-transform" />
        </div>
        <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
          +12% ↗
        </Badge>
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent mb-2">{stat.value}</p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-teal via-cyan to-teal rounded-full transition-all duration-1000 shadow-sm" style={{width: '65%'}} />
          </div>
          <span className="text-xs text-teal font-semibold whitespace-nowrap">{stat.trend}</span>
        </div>
      </div>
    </CardContent>
  </Card>
));
StatCard.displayName = 'StatCard';

const QuickActionCard = memo(({ action, index }: any) => (
  <Card 
    className="group relative overflow-hidden border-teal/20 bg-white hover:border-teal/50 hover:shadow-xl hover:shadow-teal/20 transition-all duration-300 cursor-pointer dashboard-card"
    onClick={action.action}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-cyan/5 to-transparent" />
    </div>
    
    <div className="relative bg-transparent rounded-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-teal/20 via-cyan/20 to-teal/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-teal/20">
            <action.icon className="h-6 w-6 text-teal" />
          </div>
          {action.badge && (
            <Badge 
              className="text-xs animate-pulse bg-gradient-to-r from-teal/20 to-cyan/20 text-teal border-teal/30 shadow-sm"
            >
              {action.badge}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg text-gray-900 group-hover:text-teal transition-colors font-bold">
          {action.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {action.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {action.progress !== undefined && (
          <div className="space-y-2 mb-4">
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-teal via-cyan to-teal rounded-full transition-all duration-1000 shadow-sm"
                style={{width: `${action.progress}%`}}
              />
            </div>
            <p className="text-xs text-gray-600 font-medium">
              {action.progress}% completado
            </p>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-teal hover:bg-teal/10 group-hover:translate-x-1 transition-transform font-semibold"
        >
          Ir 
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </div>
  </Card>
));
QuickActionCard.displayName = 'QuickActionCard';

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
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50">
        <div className="border-b border-teal/20 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Skeleton className="h-8 w-48 bg-gray-200" />
              <Skeleton className="h-10 w-24 bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-96 mb-8 bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-gray-200" />
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
    },
    {
      title: t("dashboard:modules.journal.title"),
      description: t("dashboard:modules.journal.description"),
      icon: BookMarked,
      action: () => navigate("/journal"),
      color: "muted"
    },
    {
      title: t("dashboard:modules.audit.title"),
      description: t("dashboard:modules.audit.description"),
      icon: Shield,
      action: () => navigate("/audit"),
      color: "muted"
    }
  ];

  // Stats with real data - simplified version
  const stats = [];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50">
      {/* Header */}
      <div className="border-b border-teal/20 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-teal bg-clip-text text-transparent">{t("dashboard:title")}</h1>
              <p className="text-gray-600">{t("dashboard:subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="border-teal/30 bg-teal/10 text-teal shadow-sm">
                {isValidated || user.isAffiliated ? t("dashboard:status.validated") : t("dashboard:status.demo")}
              </Badge>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                className="text-gray-600 hover:text-teal hover:bg-teal/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-gray-600 hover:text-teal hover:bg-teal/10"
              >
                {t("dashboard:actions.logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Premium */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-teal/10 to-cyan/10 p-4 sm:p-6 md:p-8 border border-teal/30 shadow-xl shadow-teal/10 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-teal/20 to-cyan/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-tr from-cyan/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-teal via-cyan to-teal flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-2xl shadow-teal/30 ring-4 ring-white/50">
              {user.profile?.first_name?.[0]?.toUpperCase() || user.email?.[0].toUpperCase()}
            </div>
            
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                {getGreeting()}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal to-cyan bg-clip-text text-transparent mb-2">
                {user.profile?.first_name || user.email?.split('@')[0] || 'Trader'}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="border-teal/30 bg-white text-teal shadow-sm">
                  {isValidated || user.isAffiliated ? "✓ Cuenta Validada" : "Demo"}
                </Badge>
                <span className="text-sm text-gray-700 font-medium">
                  🔥 {completedLessons} lecciones completadas
                </span>
              </div>
            </div>
            
            <div className="text-right bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-3xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">{academyProgress}%</p>
              <p className="text-xs text-gray-600 font-medium">Progreso total</p>
            </div>
          </div>
        </div>


        {/* Quick Actions con Hover Effects Avanzados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} action={action} index={index} />
          ))}
        </div>

        {/* Recent Activity & Checklist Mejorados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <Card className="border-teal/20 bg-white shadow-lg dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2 font-bold">
                    <Activity className="h-5 w-5 text-teal" />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription className="text-gray-600">Tus últimas acciones</CardDescription>
                </div>
                <Badge className="bg-teal/10 text-teal border-teal/30 shadow-sm">
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
                      className="relative flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-teal/30 hover:shadow-md transition-all animate-fade-in"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="relative z-10 p-2 rounded-full bg-gradient-to-br from-teal/20 to-cyan/20 ring-4 ring-white shadow-sm">
                        <BookOpen className="h-4 w-4 text-teal" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                      
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 text-center py-8">
                    No hay actividad reciente aún
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-teal text-teal hover:bg-teal/10 font-semibold shadow-sm"
                onClick={() => navigate("/academy")}
              >
                Ir a Academia
              </Button>
            </CardContent>
          </Card>

          {/* Checklist Mejorado */}
          <Card className="border-teal/20 bg-white shadow-lg dashboard-card">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2 font-bold">
                <Target className="h-5 w-5 text-teal" />
                {t("dashboard:checklist.title")}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t("dashboard:checklist.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklistItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-teal/30 hover:shadow-md transition-all animate-fade-in"
                    style={{animationDelay: `${index * 80}ms`}}
                  >
                    {item.done ? (
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-7 h-7 bg-green-100 rounded-full animate-pulse" />
                        <CheckCircle className="h-5 w-5 text-green-500 relative z-10" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 group-hover:border-teal/50 transition-colors" />
                    )}
                    <span className={`text-sm flex-1 transition-all font-medium ${item.done ? 'text-gray-500 line-through' : 'text-gray-900 group-hover:text-teal'}`}>
                      {item.task}
                    </span>
                    {!item.done && (
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Warning Premium */}
        <Card className="relative overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 mt-8 shadow-lg dashboard-card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl" />
          
          <CardContent className="relative z-10 p-6">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-md">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  {t("dashboard:risk_warning.title")}
                  <Badge className="border-amber-300 bg-amber-50 text-amber-700 shadow-sm">
                    Importante
                  </Badge>
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
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