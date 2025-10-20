import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { getSEOConfig } from "@/lib/seo-config";
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Award,
  ArrowLeft,
  Clock,
  TrendingUp,
  Target,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useObservability } from "@/components/business/ObservabilityProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCourseProgress } from "@/hooks/useDashboardStats";

// Memoize course card component
const CourseCard = memo(({ course, index, courseProgress, handleCourseClick }: any) => {
  const { t } = useTranslation(['academy']);
  const isUnlocked = true;

  return (
    <Card 
      className={`group relative overflow-hidden border-line transition-all duration-300 cursor-pointer animate-fade-in ${
        isUnlocked 
          ? 'bg-surface/80 backdrop-blur-sm hover:shadow-glow-subtle hover:-translate-y-1 hover:border-teal/50' 
          : 'bg-muted/20 opacity-50'
      }`}
      style={{animationDelay: `${index * 100}ms`}}
      onClick={() => isUnlocked && handleCourseClick(course.slug)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal/0 to-cyan/0 group-hover:from-teal/5 group-hover:to-cyan/5 transition-all duration-500" />
      
      {courseProgress && courseProgress.progress > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none" className="text-muted" />
              <circle
                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - courseProgress.progress / 100)}`}
                className="text-teal transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-teal">{courseProgress.progress}%</span>
            </div>
          </div>
        </div>
      )}
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              {isUnlocked ? <BookOpen className="h-6 w-6 text-teal" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <Badge variant="outline" className="border-teal/30 text-teal bg-teal/10">
              Nivel {course.level}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-foreground group-hover:text-teal transition-colors line-clamp-2">
          {course.course_item?.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {course.course_item?.tags?.join(', ') || 'Trading course'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {course.course_item?.duration_min && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-background/50">
              <Clock className="h-4 w-4 text-teal" />
              <span>{course.course_item.duration_min} minutos</span>
            </div>
          )}
          
          {courseProgress && courseProgress.progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tu Progreso</span>
                <span className="text-teal font-medium">{courseProgress.completedItems}/{courseProgress.totalItems} completado</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal to-cyan rounded-full transition-all duration-1000"
                  style={{width: `${courseProgress.progress}%`}}
                />
              </div>
            </div>
          )}
          
          {isUnlocked ? (
            <Button 
              variant="outline" 
              className="w-full border-teal text-teal hover:bg-teal hover:text-white transition-all group-hover:translate-x-1"
              onClick={(e) => {
                e.stopPropagation();
                handleCourseClick(course.slug);
              }}
            >
              {courseProgress && courseProgress.progress > 0 ? 'Continuar' : t('academy:levels.start')}
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-2 px-3 rounded-lg bg-muted/50">
              {t('academy:levels.unlock_message')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
CourseCard.displayName = 'CourseCard';

const Academy = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['academy']);
  const { trackPageView } = useObservability();
  const { session } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  const seoConfig = getSEOConfig('academy', i18n.language);
  const structuredData = [
    getCourseSchema(
      "Academia de Trading Profesional",
      "Cursos estructurados de trading desde nivel principiante hasta avanzado"
    ),
    getBreadcrumbSchema([
      { name: "Inicio", url: "https://talamo.app/" },
      { name: "Academia", url: "https://talamo.app/academy" }
    ])
  ];
  
  // Get user's progress for all courses
  const { data: coursesProgress } = useUserCourseProgress();

  useEffect(() => {
    trackPageView('academy');
  }, [trackPageView]);

  // Fetch published courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ['published-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lms_courses')
        .select(`
          *,
          course_item:course_items(*)
        `)
        .eq('status', 'published')
        .order('level', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch user's completed lessons if logged in
  const { data: completedLessons } = useQuery({
    queryKey: ['user-completed-lessons', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_events')
        .select('course_id')
        .eq('user_id', session?.user?.id!)
        .eq('verb', 'completed');

      if (error) throw error;
      return data.map(e => e.course_id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const handleCourseClick = (courseSlug: string) => {
    navigate(`/academy/course/${courseSlug}`);
  };

  // Filter courses by level
  const filteredCourses = selectedLevel 
    ? courses?.filter(c => c.level === selectedLevel)
    : courses;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Premium */}
      <div className="relative overflow-hidden border-b border-line/50 bg-gradient-to-br from-teal/5 via-surface to-cyan/5">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20">
                  <BookOpen className="h-8 w-8 text-teal" />
                </div>
                <Badge variant="outline" className="border-teal text-teal">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Academia Profesional
                </Badge>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
                {t('academy:title')}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                {t('academy:subtitle')}
              </p>
            </div>

            {courses && courses.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Card className="border-teal/20 bg-surface/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Target className="h-6 w-6 text-teal mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                    <p className="text-xs text-muted-foreground">Cursos Disponibles</p>
                  </CardContent>
                </Card>
                <Card className="border-teal/20 bg-surface/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-teal mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">
                      {coursesProgress?.reduce((acc, cp) => acc + cp.progress, 0) || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Progreso Promedio</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Filter Premium */}
        {courses && courses.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-line/50">
            <Button
              variant={selectedLevel === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(null)}
              className={selectedLevel === null ? 'bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90' : 'hover:border-teal/50 hover:text-teal'}
            >
              Todos los Niveles
            </Button>
            {[0, 1, 2, 3, 4].map(level => {
              const levelCount = courses.filter(c => c.level === level).length;
              if (levelCount === 0) return null;
              return (
                <Button
                  key={level}
                  variant={selectedLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={selectedLevel === level 
                    ? 'bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90' 
                    : 'hover:border-teal/50 hover:text-teal transition-all'
                  }
                >
                  Nivel {level} <Badge variant="secondary" className="ml-2 text-xs">{levelCount}</Badge>
                </Button>
              );
            })}
          </div>
        )}

        {courses && courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Courses Published Yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Our team is preparing amazing content for you. <br />
                Check back soon or contact support if you need assistance.
              </p>
              {session?.user && (
                <div className="space-y-2">
                  <Button onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Are you an admin? 
                    <Button 
                      variant="link" 
                      className="text-teal p-0 ml-1 h-auto"
                      onClick={() => navigate('/admin/lms')}
                    >
                      Publish courses here
                    </Button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses?.map((course, index) => {
              const courseProgress = coursesProgress?.find(cp => cp.id === course.id);
              return (
                <CourseCard 
                  key={course.id}
                  course={course}
                  index={index}
                  courseProgress={courseProgress}
                  handleCourseClick={handleCourseClick}
                />
              );
            })}
          </div>
        )}

        {/* Trading Disclaimer */}
        <TradingDisclaimer 
          context="academy" 
          variant="compact" 
          showCollapsible={true}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default Academy;
