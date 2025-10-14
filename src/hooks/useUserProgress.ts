import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserProgress = (courseId: string) => {
  return useQuery({
    queryKey: ['user-progress', courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCompletionStats = (courseId: string) => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['completion-stats', courseId, session?.user?.id],
    queryFn: async () => {
      if (!courseId) {
        return { total: 0, completed: 0, percentage: 0 };
      }

      const { data: courseTree, error } = await supabase.rpc('get_course_tree', {
        course_slug_or_id: courseId,
        requesting_user_id: session?.user?.id || null,
      });

      if (error) throw error;

      // Type assertion for RPC response
      const tree = courseTree as any;
      const modules = tree?.modules || [];
      const allItems = modules.flatMap((m: any) => [
        ...(m.lessons || []),
        ...(m.quizzes || [])
      ]);
      const completedItems = allItems.filter((item: any) => item.completed);

      return {
        total: allItems.length,
        completed: completedItems.length,
        percentage: allItems.length > 0 
          ? Math.round((completedItems.length / allItems.length) * 100) 
          : 0,
      };
    },
    // Allow hook to be called always, but only fetch when we have a valid courseId
    enabled: !!courseId && !!session?.user?.id,
  });
};

export const markLessonComplete = async (
  courseId: string,
  moduleId: string,
  lessonId: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      course_id: courseId,
      module_id: moduleId,
      item_kind: 'lesson',
      item_id: lessonId,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

  if (error) throw error;
};