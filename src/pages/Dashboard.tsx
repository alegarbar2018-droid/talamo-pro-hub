import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useUserCourseProgress } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KPICard } from "@/components/dashboard/KPICard";
import { ModulePreviewCard } from "@/components/dashboard/ModulePreviewCard";
import { ActivityTimelineItem } from "@/components/dashboard/ActivityTimelineItem";
import { OnboardingChecklistCard } from "@/components/dashboard/OnboardingChecklistCard";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  BookOpen,
  Radio,
  Copy,
  Calculator,
  BookMarked,
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles,
  Target,
  Flame,
} from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation(["dashboard", "common"]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: coursesProgress, isLoading: coursesLoading } = useUserCourseProgress();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard:greetings.morning");
    if (hour < 18) return t("dashboard:greetings.afternoon");
    return t("dashboard:greetings.evening");
  };

  const checklistItems = useMemo(() => [
    {
      id: "profile",
      label: t("dashboard:checklist.tasks.profile"),
      completed: stats?.checklist.profileComplete || false,
    },
    {
      id: "academy",
      label: t("dashboard:checklist.tasks.academy"),
      completed: stats?.completedLessons > 0 || false,
    },
    {
      id: "calculator",
      label: t("dashboard:checklist.tasks.calculator"),
      completed: stats?.checklist.calculatorUsed || false,
    },
    {
      id: "community",
      label: t("dashboard:checklist.tasks.community"),
      completed: false,
    },
  ], [stats, t]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  const academyProgress = coursesProgress && coursesProgress.length > 0
    ? Math.round(coursesProgress.reduce((acc, cp) => acc + cp.progress, 0) / coursesProgress.length)
    : 0;

  const currentCourse = coursesProgress?.find(cp => cp.progress > 0 && cp.progress < 100);

  return (
    <div className="min-h-screen bg-background">
      <div className={cn(DESIGN_TOKENS.container.wide, DESIGN_TOKENS.spacing.section.full, "space-y-8")}>
        {/* Hero Section with Greeting */}
        <div className={cn(
          "relative overflow-hidden border border-line/50 bg-gradient-to-br from-teal/10 via-surface to-cyan/10",
          DESIGN_TOKENS.radius.card,
          DESIGN_TOKENS.spacing.card.spacious
        )}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-gradient-to-r from-teal to-cyan text-white border-0 shadow-lg">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {t("dashboard:status.demo")}
                </Badge>
                {stats?.completedLessons > 0 && (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400">
                    <Flame className="h-3 w-3 mr-1" />
                    {stats.completedLessons} {t("dashboard:modules.academy.completed")}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {getGreeting()}, {user?.profile?.first_name || user?.profile?.last_name || "Usuario"}
              </h1>
              <p className="text-muted-foreground">
                {t("dashboard:progress_summary")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted/20" />
                    <circle
                      cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="4" fill="none"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - academyProgress / 100)}`}
                      className="text-teal transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-teal">{academyProgress}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Progreso</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", DESIGN_TOKENS.spacing.gap.sm)}>
          <KPICard
            title={t("dashboard:stats.trades_week")}
            value={0}
            icon={TrendingUp}
            trend={{ value: 5, label: t("dashboard:stats.trend_vs_week") }}
          />
          <KPICard
            title={t("dashboard:stats.win_rate")}
            value={`${stats?.quizSuccessRate || 0}%`}
            icon={Target}
            trend={{ value: 3, label: t("dashboard:stats.trend_vs_month") }}
          />
          <KPICard
            title={t("dashboard:stats.academy_progress")}
            value={`${stats?.completedLessons || 0}/${stats?.totalLessons || 0}`}
            icon={BookOpen}
          />
          <KPICard
            title="Journal Entries"
            value={0}
            icon={BookMarked}
          />
        </div>

        {/* Main Content Grid */}
        <div className={cn("grid lg:grid-cols-3", DESIGN_TOKENS.spacing.gap.md)}>
          {/* Module Previews - 2 columns */}
          <div className={cn("lg:col-span-2 grid sm:grid-cols-2", DESIGN_TOKENS.spacing.gap.sm)}>
            <ModulePreviewCard
              title={t("dashboard:modules.academy.title")}
              description={currentCourse?.course_item?.title || t("dashboard:modules.academy.description")}
              icon={BookOpen}
              progress={academyProgress}
              actionLabel="Continuar"
              actionPath={currentCourse ? `/academy/course/${currentCourse.slug}` : "/academy"}
              stats={[
                { label: "Lecciones", value: stats?.completedLessons || 0 },
                { label: "Quizzes", value: stats?.passedQuizzes || 0 },
              ]}
            />

            <ModulePreviewCard
              title={t("dashboard:modules.signals.title")}
              description="3 señales activas"
              icon={Radio}
              badge="2 nuevas"
              actionLabel={t("dashboard:actions.view_all")}
              actionPath="/signals"
              stats={[
                { label: "Activas", value: 3 },
                { label: "Esta semana", value: 12 },
              ]}
            />

            <ModulePreviewCard
              title={t("dashboard:modules.copy.title")}
              description={t("dashboard:modules.copy.description")}
              icon={Copy}
              badge={t("dashboard:modules.copy.badge")}
              actionLabel="Ver Estrategias"
              actionPath="/copy-trading"
              stats={[
                { label: "Estrategias", value: 8 },
                { label: "Verificadas", value: 8 },
              ]}
            />

            <ModulePreviewCard
              title={t("dashboard:modules.tools.title")}
              description={t("dashboard:modules.tools.description")}
              icon={Calculator}
              actionLabel="Abrir Calculadoras"
              actionPath="/tools"
              stats={[
                { label: "Herramientas", value: 7 },
                { label: "Usadas", value: stats?.checklist.calculatorUsed ? 1 : 0 },
              ]}
            />
          </div>

          {/* Sidebar - Recent Activity & Checklist */}
          <div className="space-y-6">
            {/* Onboarding Checklist */}
            {checklistItems.some(item => !item.completed) && (
              <OnboardingChecklistCard items={checklistItems} />
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-teal" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentEvents && stats.recentEvents.length > 0 ? (
                    stats.recentEvents.slice(0, 5).map((event: any, idx: number) => (
                      <ActivityTimelineItem
                        key={idx}
                        icon={
                          event.verb === "completed" ? CheckCircle :
                          event.verb === "started" ? BookOpen :
                          TrendingUp
                        }
                        title={event.title || "Actividad"}
                        description={event.description || ""}
                        time={event.time || "Hace unos momentos"}
                        type={event.verb === "completed" ? "success" : "info"}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard:empty")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Modules */}
        <div className={cn("grid sm:grid-cols-2", DESIGN_TOKENS.spacing.gap.sm)}>
          <ModulePreviewCard
            title={t("dashboard:modules.journal.title")}
            description={t("dashboard:modules.journal.description")}
            icon={BookMarked}
            actionLabel="Abrir Journal"
            actionPath="/journal"
          />

          <ModulePreviewCard
            title={t("dashboard:modules.audit.title")}
            description={t("dashboard:modules.audit.description")}
            icon={BarChart3}
            actionLabel="Ver Auditoría"
            actionPath="/audit"
          />
        </div>

        {/* Risk Warning */}
        <TradingDisclaimer variant="compact" className="mt-8" />
      </div>
    </div>
  );
};

export default Dashboard;
