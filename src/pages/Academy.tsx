import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Award,
  ArrowLeft,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useObservability } from "@/components/business/ObservabilityProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCourseProgress } from "@/hooks/useDashboardStats";

const Academy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['academy']);
  const { trackPageView } = useObservability();
  const { session } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
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
      <div className="border-b border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('academy:title')}</h1>
              <p className="text-muted-foreground">{t('academy:subtitle')}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('academy:back_to_dashboard')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Filter */}
        {courses && courses.length > 0 && (
          <div className="flex gap-2 mb-6">
            <Button
              variant={selectedLevel === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(null)}
            >
              All Levels
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
                >
                  Level {level} ({levelCount})
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses?.map((course) => {
              const isUnlocked = true; // For now, all published courses are unlocked
              const courseProgress = coursesProgress?.find(cp => cp.id === course.id);

              return (
                <Card 
                  key={course.id}
                  className={`border-line transition-all cursor-pointer ${
                    isUnlocked 
                      ? 'bg-surface hover:shadow-glow-subtle' 
                      : 'bg-muted/20 opacity-50'
                  }`}
                  onClick={() => isUnlocked && handleCourseClick(course.slug)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUnlocked ? (
                          <BookOpen className="h-8 w-8 text-teal" />
                        ) : (
                          <Lock className="h-8 w-8 text-muted-foreground" />
                        )}
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {t('academy:levels.level')} {course.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-foreground">{course.course_item?.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {course.course_item?.tags?.join(', ') || 'Trading course'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {course.course_item?.duration_min && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {course.course_item.duration_min} minutes
                        </div>
                      )}
                      
                      {/* User Progress */}
                      {courseProgress && courseProgress.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Your Progress</span>
                            <span className="text-teal font-medium">{courseProgress.progress}%</span>
                          </div>
                          <Progress value={courseProgress.progress} className="h-1.5" />
                        </div>
                      )}
                      
                      {isUnlocked ? (
                        <Button 
                          variant="outline" 
                          className="w-full border-teal text-teal hover:bg-teal/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course.slug);
                          }}
                        >
                          {t('academy:levels.start')}
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          {t('academy:levels.unlock_message')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
