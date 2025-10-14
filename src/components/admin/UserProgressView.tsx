import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProgressViewProps {
  userId: string;
}

export const UserProgressView: React.FC<UserProgressViewProps> = ({ userId }) => {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['admin-user-progress', userId],
    queryFn: async () => {
      // Get completed lessons
      const { data: completedEvents } = await supabase
        .from('course_events')
        .select('course_id, verb')
        .eq('user_id', userId)
        .eq('verb', 'completed');
      
      const completedLessons = completedEvents?.length || 0;
      
      // Get quiz attempts
      const { data: quizAttempts } = await supabase
        .from('lms_quiz_attempts')
        .select('passed, score')
        .eq('user_id', userId);
      
      const totalQuizzes = quizAttempts?.length || 0;
      const passedQuizzes = quizAttempts?.filter(q => q.passed).length || 0;
      const avgScore = totalQuizzes > 0
        ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / totalQuizzes)
        : 0;
      
      // Get courses progress
      const { data: courses } = await supabase
        .from('lms_courses')
        .select('id, slug, course_item:course_items(title)')
        .eq('status', 'published');
      
      const coursesWithProgress = await Promise.all(
        (courses || []).map(async (course) => {
          const { data: courseTree } = await supabase.rpc('get_course_tree', {
            course_slug_or_id: course.id,
            requesting_user_id: userId
          });
          
          const tree = courseTree as any;
          const modules = tree?.modules || [];
          const allItems = modules.flatMap((m: any) => [
            ...(m.lessons || []),
            ...(m.quizzes || [])
          ]);
          const completedItems = allItems.filter((item: any) => item.completed);
          
          return {
            courseId: course.id,
            slug: course.slug,
            title: (course.course_item as any)?.title || course.slug,
            progress: allItems.length > 0
              ? Math.round((completedItems.length / allItems.length) * 100)
              : 0,
          };
        })
      );
      
      return {
        completedLessons,
        totalQuizzes,
        passedQuizzes,
        avgScore,
        courses: coursesWithProgress,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-sm text-muted-foreground">
        No progress data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-teal" />
              <span className="text-xs text-muted-foreground">Lessons</span>
            </div>
            <p className="text-2xl font-bold">{userStats.completedLessons}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Quizzes</span>
            </div>
            <p className="text-2xl font-bold">{userStats.passedQuizzes}/{userStats.totalQuizzes}</p>
            <p className="text-xs text-muted-foreground">Avg: {userStats.avgScore}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Progress */}
      <div className="space-y-2">
        <h5 className="text-xs font-medium text-muted-foreground">Course Progress</h5>
        {userStats.courses.map((course) => (
          <div key={course.courseId} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{course.title}</span>
                <Badge variant="outline" className="text-xs">{course.progress}%</Badge>
              </div>
              <Progress value={course.progress} className="h-1.5" />
            </div>
            {course.progress === 100 && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        ))}
        
        {userStats.courses.length === 0 && (
          <p className="text-sm text-muted-foreground">No courses started yet</p>
        )}
      </div>
    </div>
  );
};
