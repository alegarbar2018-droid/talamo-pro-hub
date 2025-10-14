import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardStats = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-stats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // 1. Academy Progress
      const { data: progressData } = await supabase
        .from('course_events')
        .select('course_id, verb')
        .eq('user_id', session.user.id)
        .eq('verb', 'completed');
      
      const completedLessons = progressData?.length || 0;
      
      // Get total published lessons
      const { count: totalLessons } = await supabase
        .from('lms_lessons')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      
      const academyProgress = totalLessons && totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
      
      // 2. Quiz Stats
      const { data: quizAttempts } = await supabase
        .from('lms_quiz_attempts')
        .select('passed, score')
        .eq('user_id', session.user.id);
      
      const totalQuizzes = quizAttempts?.length || 0;
      const passedQuizzes = quizAttempts?.filter(q => q.passed).length || 0;
      const quizSuccessRate = totalQuizzes > 0
        ? Math.round((passedQuizzes / totalQuizzes) * 100)
        : 0;
      
      // 3. Recent Activity
      const { data: recentEvents } = await supabase
        .from('course_events')
        .select(`
          *,
          course_items!inner(title)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      // 4. Checklist Progress
      const { data: profileComplete } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, avatar_url')
        .eq('user_id', session.user.id)
        .single();
      
      const hasCompletedProfile = !!(
        profileComplete?.first_name && 
        profileComplete?.last_name
      );
      
      const hasStartedAcademy = completedLessons > 0;
      const hasUsedCalculator = false; // TODO: Add tools usage tracking
      const hasJoinedCommunity = false; // TODO: Add community posts tracking
      const hasUsedCopyTrading = false; // TODO: Add copy trading tracking
      
      return {
        academyProgress,
        completedLessons,
        totalLessons: totalLessons || 0,
        quizSuccessRate,
        totalQuizzes,
        passedQuizzes,
        recentEvents: recentEvents || [],
        checklist: {
          profileComplete: hasCompletedProfile,
          academyStarted: hasStartedAcademy,
          calculatorUsed: hasUsedCalculator,
          communityJoined: hasJoinedCommunity,
          copyTradingUsed: hasUsedCopyTrading,
        }
      };
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserCourseProgress = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['user-all-courses-progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Get all published courses with user progress
      const { data: courses } = await supabase
        .from('lms_courses')
        .select(`
          id,
          slug,
          level,
          course_item:course_items(title, tags, duration_min)
        `)
        .eq('status', 'published');
      
      if (!courses) return [];
      
      // For each course, get completion stats
      const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
          const { data: courseTree } = await supabase.rpc('get_course_tree', {
            course_slug_or_id: course.id,
            requesting_user_id: session.user.id
          });
          
          const tree = courseTree as any;
          const modules = tree?.modules || [];
          const allItems = modules.flatMap((m: any) => [
            ...(m.lessons || []),
            ...(m.quizzes || [])
          ]);
          const completedItems = allItems.filter((item: any) => item.completed);
          
          const percentage = allItems.length > 0
            ? Math.round((completedItems.length / allItems.length) * 100)
            : 0;
          
          return {
            ...course,
            progress: percentage,
            completedItems: completedItems.length,
            totalItems: allItems.length,
          };
        })
      );
      
      return coursesWithProgress;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5,
  });
};
