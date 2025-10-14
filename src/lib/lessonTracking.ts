/**
 * Lesson Tracking Utilities
 * 
 * Local storage-based tracking for lesson topic completion.
 * Optionally syncs with course_events table.
 */

const STORAGE_KEY_PREFIX = 'talamo_lesson_progress_';

export interface LessonProgress {
  lessonId: string;
  topics: Record<string, boolean>; // topicId -> completed
  lastUpdated: string;
}

/**
 * Get lesson progress from localStorage
 */
export function getLessonProgress(lessonId: string): LessonProgress {
  const key = `${STORAGE_KEY_PREFIX}${lessonId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    return {
      lessonId,
      topics: {},
      lastUpdated: new Date().toISOString(),
    };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return {
      lessonId,
      topics: {},
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Update topic completion status
 */
export function updateTopicProgress(lessonId: string, topicId: string, completed: boolean): void {
  const progress = getLessonProgress(lessonId);
  progress.topics[topicId] = completed;
  progress.lastUpdated = new Date().toISOString();
  
  const key = `${STORAGE_KEY_PREFIX}${lessonId}`;
  localStorage.setItem(key, JSON.stringify(progress));
  
  // Dispatch custom event for components to react
  window.dispatchEvent(new CustomEvent('lesson-progress-updated', {
    detail: { lessonId, topicId, completed }
  }));
}

/**
 * Clear lesson progress (for testing/reset)
 */
export function clearLessonProgress(lessonId: string): void {
  const key = `${STORAGE_KEY_PREFIX}${lessonId}`;
  localStorage.removeItem(key);
  
  window.dispatchEvent(new CustomEvent('lesson-progress-updated', {
    detail: { lessonId, cleared: true }
  }));
}

/**
 * Get all completed topic IDs for a lesson
 */
export function getCompletedTopics(lessonId: string): string[] {
  const progress = getLessonProgress(lessonId);
  return Object.keys(progress.topics).filter(topicId => progress.topics[topicId]);
}

/**
 * Check if a specific topic is completed
 */
export function isTopicCompleted(lessonId: string, topicId: string): boolean {
  const progress = getLessonProgress(lessonId);
  return progress.topics[topicId] || false;
}
