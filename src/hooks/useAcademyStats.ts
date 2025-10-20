import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COURSE } from "@/data/course";

export function useAcademyStats() {
  const { data: publishedCourses } = useQuery({
    queryKey: ["academy-stats-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lms_courses")
        .select("id")
        .eq("status", "published");
      
      if (error) throw error;
      return data?.length || 0;
    },
  });

  const { data: activeStudents } = useQuery({
    queryKey: ["academy-stats-students"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .not("id", "is", null);
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Calculate total lessons from course data
  const totalLessons = COURSE.reduce((acc, level) => acc + level.lessons.length, 0);
  
  // Calculate total hours (estimate: 30 min per lesson)
  const totalHours = Math.round((totalLessons * 30) / 60);

  return {
    totalCourses: publishedCourses || 3,
    totalLessons,
    totalHours,
    activeStudents: activeStudents || 0,
    isLoading: false,
  };
}
