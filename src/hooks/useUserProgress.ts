import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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