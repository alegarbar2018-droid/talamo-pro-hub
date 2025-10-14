/**
 * useLessonTopics - Adapter for TOC Sidebar
 * 
 * Derives topic structure from existing LessonView payload without requiring
 * any schema changes. Generates deterministic anchors and titles.
 */

import { useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonProgress, updateTopicProgress } from '@/lib/lessonTracking';

export type TopicType = 'video' | 'content' | 'resource' | 'quiz' | 'other';

export interface Topic {
  id: string;
  title: string;
  type: TopicType;
  completed: boolean;
  elRef?: HTMLElement | null;
}

export interface LessonTopicsResult {
  topics: Topic[];
  completedCount: number;
  total: number;
  progress: number;
  markTopicComplete: (topicId: string) => void;
  getTopicRef: (topicId: string) => HTMLElement | null;
  registerTopicRef: (topicId: string, el: HTMLElement | null) => void;
}

interface LessonPayload {
  id: string;
  content_md?: string;
  video_storage_key?: string;
  video_external_url?: string;
  quiz_id?: string | null;
  [key: string]: any; // Allow additional properties from Supabase
}

/**
 * Parse markdown headings (h2) and special blocks to extract topics
 */
function parseContentTopics(content: string): Array<{ id: string; title: string; type: TopicType }> {
  const topics: Array<{ id: string; title: string; type: TopicType }> = [];
  
  // Match h2 headings: ## Title
  const h2Regex = /^##\s+(.+)$/gm;
  let match;
  let h2Index = 0;
  
  while ((match = h2Regex.exec(content)) !== null) {
    const title = match[1].trim();
    topics.push({
      id: `topic-h2-${h2Index}`,
      title,
      type: 'content'
    });
    h2Index++;
  }
  
  // Match special blocks: :::accordion, :::flipcard, :::trading-sim, :::tip
  const blockRegex = /:::(accordion|flipcard|trading-sim|tip|case)\s+(.+)?/g;
  let blockIndex = 0;
  
  while ((match = blockRegex.exec(content)) !== null) {
    const blockType = match[1];
    const blockTitle = match[2]?.trim() || '';
    
    // Extract title from attributes like title="..."
    const titleMatch = blockTitle.match(/title="([^"]+)"/);
    const extractedTitle = titleMatch ? titleMatch[1] : `${blockType.charAt(0).toUpperCase()}${blockType.slice(1)} ${blockIndex + 1}`;
    
    topics.push({
      id: `topic-${blockType}-${blockIndex}`,
      title: extractedTitle,
      type: 'content'
    });
    blockIndex++;
  }
  
  return topics;
}

export function useLessonTopics(lesson: LessonPayload | null | undefined, resources: any[] = []): LessonTopicsResult {
  const { t } = useTranslation();
  const topicRefs = useMemo(() => new Map<string, HTMLElement | null>(), []);
  
  const topics = useMemo(() => {
    if (!lesson) return [];
    
    const result: Topic[] = [];
    const progress = getLessonProgress(lesson.id);
    
    // 1. Video topic
    if (lesson.video_storage_key || lesson.video_external_url) {
      result.push({
        id: 'topic-video',
        title: t('academy.lesson.video', 'Video'),
        type: 'video',
        completed: progress.topics['topic-video'] || false,
      });
    }
    
    // 2. Content topics from markdown
    if (lesson.content_md) {
      const contentTopics = parseContentTopics(lesson.content_md);
      contentTopics.forEach(ct => {
        result.push({
          id: ct.id,
          title: ct.title,
          type: ct.type,
          completed: progress.topics[ct.id] || false,
        });
      });
      
      // If no h2 or blocks found, add generic content topic
      if (contentTopics.length === 0) {
        result.push({
          id: 'topic-content',
          title: t('academy.lesson.content', 'Lesson Content'),
          type: 'content',
          completed: progress.topics['topic-content'] || false,
        });
      }
    }
    
    // 3. Resources
    resources.forEach((resource, idx) => {
      result.push({
        id: `topic-resource-${resource.id}`,
        title: resource.title || `${t('academy.lesson.resource', 'Resource')} ${idx + 1}`,
        type: 'resource',
        completed: progress.topics[`topic-resource-${resource.id}`] || false,
      });
    });
    
    // 4. Quiz
    if (lesson.quiz_id) {
      result.push({
        id: 'topic-quiz',
        title: t('academy.lesson.quiz', 'Quiz'),
        type: 'quiz',
        completed: progress.topics['topic-quiz'] || false,
      });
    }
    
    return result;
  }, [lesson, resources, t]);
  
  const completedCount = useMemo(() => {
    return topics.filter(t => t.completed).length;
  }, [topics]);
  
  const total = topics.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  
  const markTopicComplete = useCallback((topicId: string) => {
    if (!lesson) return;
    updateTopicProgress(lesson.id, topicId, true);
  }, [lesson]);
  
  const registerTopicRef = useCallback((topicId: string, el: HTMLElement | null) => {
    topicRefs.set(topicId, el);
  }, [topicRefs]);
  
  const getTopicRef = useCallback((topicId: string) => {
    return topicRefs.get(topicId) || null;
  }, [topicRefs]);
  
  return {
    topics,
    completedCount,
    total,
    progress,
    markTopicComplete,
    getTopicRef,
    registerTopicRef,
  };
}
