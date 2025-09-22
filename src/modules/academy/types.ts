/**
 * Academy Module Types - v1
 * 
 * Type definitions for the Talamo Academy module.
 * All academy functionality is gated by the 'academy_v1' feature flag.
 */

export interface Course {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail_url?: string;
  video_url?: string;
  content?: CourseContent[];
  prerequisites?: string[];
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseContent {
  id: string;
  course_id: string;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  title: string;
  content: string | QuizContent | ExerciseContent;
  order: number;
  duration_minutes?: number;
}

export interface QuizContent {
  questions: QuizQuestion[];
  passing_score: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
}

export interface ExerciseContent {
  instructions: string;
  initial_code?: string;
  solution?: string;
  validation_criteria: string[];
}

export interface StudentProgress {
  user_id: string;
  course_id: string;
  current_content_id?: string;
  completion_percentage: number;
  completed_content_ids: string[];
  quiz_scores: Record<string, number>;
  started_at: string;
  last_accessed: string;
  completed_at?: string;
}

export interface AcademyStats {
  total_courses: number;
  total_students: number;
  avg_completion_rate: number;
  most_popular_courses: Course[];
}

// Mock data interface for development
export interface AcademyMockData {
  courses: Course[];
  progress: StudentProgress[];
  stats: AcademyStats;
}