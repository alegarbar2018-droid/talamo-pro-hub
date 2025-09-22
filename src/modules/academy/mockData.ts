/**
 * Academy Module Mock Data
 * 
 * Mock data for development and testing.
 * This will be replaced with real API calls when backend is ready.
 */

import { Course, StudentProgress, AcademyStats, AcademyMockData } from './types';

const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Fundamentos del Trading con Exness',
    description: 'Aprende los conceptos básicos del trading forex con la plataforma Exness.',
    duration_minutes: 120,
    difficulty: 'beginner',
    category: 'Forex Basics',
    thumbnail_url: '/assets/course-forex-basics.jpg',
    video_url: '/videos/forex-basics.mp4',
    prerequisites: [],
    tags: ['forex', 'basics', 'exness', 'trading'],
    published: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'course-2', 
    title: 'Análisis Técnico Avanzado',
    description: 'Domina las herramientas de análisis técnico para mejorar tus decisiones de trading.',
    duration_minutes: 180,
    difficulty: 'intermediate',
    category: 'Technical Analysis',
    thumbnail_url: '/assets/course-technical-analysis.jpg',
    video_url: '/videos/technical-analysis.mp4',
    prerequisites: ['course-1'],
    tags: ['technical-analysis', 'charts', 'indicators', 'advanced'],
    published: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'course-3',
    title: 'Gestión de Riesgo y Capital',
    description: 'Aprende a proteger tu capital y gestionar el riesgo efectivamente.',
    duration_minutes: 90,
    difficulty: 'intermediate',
    category: 'Risk Management',
    thumbnail_url: '/assets/course-risk-management.jpg',
    video_url: '/videos/risk-management.mp4',
    prerequisites: ['course-1'],
    tags: ['risk-management', 'capital', 'psychology', 'discipline'],
    published: true,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
];

const mockProgress: StudentProgress[] = [
  {
    user_id: 'user-1',
    course_id: 'course-1',
    current_content_id: 'content-3',
    completion_percentage: 65,
    completed_content_ids: ['content-1', 'content-2'],
    quiz_scores: { 'quiz-1': 85 },
    started_at: '2024-01-15T10:00:00Z',
    last_accessed: '2024-01-20T15:30:00Z',
  },
];

const mockStats: AcademyStats = {
  total_courses: 3,
  total_students: 156,
  avg_completion_rate: 78.5,
  most_popular_courses: mockCourses.slice(0, 2),
};

export const academyMockData: AcademyMockData = {
  courses: mockCourses,
  progress: mockProgress,
  stats: mockStats,
};

/**
 * Mock API functions - these simulate API calls
 */
export const academyMockApi = {
  async getCourses(): Promise<Course[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses.filter(course => course.published);
  },

  async getCourse(id: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCourses.find(course => course.id === id) || null;
  },

  async getStudentProgress(userId: string): Promise<StudentProgress[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProgress.filter(progress => progress.user_id === userId);
  },

  async updateProgress(
    userId: string, 
    courseId: string, 
    contentId: string, 
    completed: boolean
  ): Promise<StudentProgress> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock update logic
    const existing = mockProgress.find(
      p => p.user_id === userId && p.course_id === courseId
    );
    
    if (existing && completed && !existing.completed_content_ids.includes(contentId)) {
      existing.completed_content_ids.push(contentId);
      existing.current_content_id = contentId;
      existing.completion_percentage = Math.min(100, existing.completion_percentage + 10);
      existing.last_accessed = new Date().toISOString();
    }
    
    return existing || {
      user_id: userId,
      course_id: courseId,
      current_content_id: contentId,
      completion_percentage: completed ? 10 : 0,
      completed_content_ids: completed ? [contentId] : [],
      quiz_scores: {},
      started_at: new Date().toISOString(),
      last_accessed: new Date().toISOString(),
    };
  },

  async getStats(): Promise<AcademyStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStats;
  },
};