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
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/locale";
import AffiliationGate from "@/components/AffiliationGate";

const Dashboard = () => {
  const { user, isValidated, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["dashboard", "common"]);

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

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">{t("common:loading")}</div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  const academyProgress = 25; // Mock progress
  const tradesThisWeek = 12;
  const winRate = 67;

  const quickActions = [
    {
      title: t("dashboard:modules.academy.title"),
      description: t("dashboard:modules.academy.description"),
      icon: BookOpen,
      progress: academyProgress,
      action: () => navigate("/academy"),
      color: "teal"
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

  const stats = [
    {
      title: t("dashboard:stats.trades_week"),
      value: tradesThisWeek,
      icon: Activity,
      trend: `+3 ${t("dashboard:stats.trend_vs_week")}`
    },
    {
      title: t("dashboard:stats.win_rate"),
      value: `${winRate}%`,
      icon: Target,
      trend: `+5% ${t("dashboard:stats.trend_vs_month")}`
    },
    {
      title: t("dashboard:stats.academy_progress"),
      value: `${academyProgress}%`,
      icon: BarChart3,
      trend: t("dashboard:stats.level_completed")
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
              <h1 className="text-2xl font-bold text-foreground">{t("dashboard:title")}</h1>
              <p className="text-muted-foreground">{t("dashboard:subtitle")}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-teal text-teal">
                {isValidated || user.isAffiliated ? t("dashboard:status.validated") : t("dashboard:status.demo")}
              </Badge>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard:welcome_back")}, {user.profile?.first_name ? `${user.profile.first_name} ${user.profile.last_name || ''}`.trim() : user.email?.split('@')[0] || 'Usuario'}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard:progress_summary")}
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
                    <p className="text-xs text-muted-foreground">{action.progress}% {t("dashboard:modules.academy.completed")}</p>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="w-full mt-2 text-teal hover:bg-teal/10">
                  {t("dashboard:actions.go")} <ArrowRight className="h-4 w-4 ml-1" />
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
                {t("dashboard:modules.signals.recent_title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("dashboard:modules.signals.recent_subtitle")}
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
                      <p className="text-sm font-medium text-foreground">{t(`dashboard:signals.status.${signal.status.toLowerCase().replace(' ', '_').replace('ó', 'o')}`)}</p>
                      <p className="text-xs text-muted-foreground">{signal.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-teal text-teal hover:bg-teal/10">
                {t("dashboard:actions.view_all")}
              </Button>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-line bg-surface">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-teal" />
                {t("dashboard:checklist.title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("dashboard:checklist.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { task: t("dashboard:checklist.tasks.profile"), done: true },
                  { task: t("dashboard:checklist.tasks.academy"), done: true },
                  { task: t("dashboard:checklist.tasks.calculator"), done: false },
                  { task: t("dashboard:checklist.tasks.community"), done: false },
                  { task: t("dashboard:checklist.tasks.copy_trading"), done: false }
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
                <h3 className="font-semibold text-foreground">{t("dashboard:risk_warning.title")}</h3>
                <p className="text-sm text-muted-foreground">
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