/**
 * LessonTOCSidebar - Collapsible TOC with progress tracking
 * 
 * Desktop: Fixed left sidebar with collapse
 * Mobile: Bottom sheet/drawer
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, CheckCircle2, Circle, ChevronRight, Video, FileText, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Topic } from '@/hooks/useLessonTopics';

interface LessonTOCSidebarProps {
  topics: Topic[];
  completedCount: number;
  total: number;
  progress: number;
  onTopicClick: (topicId: string) => void;
  activeTopicId?: string;
}

const COLLAPSED_KEY = 'academy_sidebar_collapsed';

function getTopicIcon(type: string) {
  switch (type) {
    case 'video': return <Video className="h-4 w-4" />;
    case 'content': return <FileText className="h-4 w-4" />;
    case 'resource': return <Download className="h-4 w-4" />;
    case 'quiz': return <HelpCircle className="h-4 w-4" />;
    default: return <Circle className="h-4 w-4" />;
  }
}

function SidebarContent({ 
  topics, 
  completedCount, 
  total, 
  progress, 
  onTopicClick, 
  activeTopicId,
  onClose 
}: LessonTOCSidebarProps & { onClose?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-surface via-surface to-[hsl(222_20%_5%)]">
      {/* Header */}
      <div className="sidebar-header p-6 border-b border-line/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-subtle">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {t('academy.lesson.toc_title', 'Contenido')}
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              {t('academy.lesson.progress', 'Progreso')}
            </span>
            <span className="font-bold text-teal-ink text-base">
              {completedCount}/{total}
            </span>
          </div>
          <div className="relative h-2.5 bg-[hsl(var(--academy-progress-bg))] rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal to-teal-dark rounded-full shadow-glow-subtle transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {progress}% {t('academy.lesson.completed', 'completado')}
          </p>
        </div>
      </div>

      {/* Topic List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <nav aria-label={t('academy.lesson.toc_nav', 'Navegación de lección')}>
          <ul className="space-y-2">
            {topics.map((topic, index) => {
              const isActive = activeTopicId === topic.id;
              return (
                <li key={topic.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <button
                    onClick={() => {
                      onTopicClick(topic.id);
                      onClose?.();
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      "topic-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                      "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                      isActive 
                        ? "bg-gradient-to-r from-teal/20 to-teal/10 text-foreground font-semibold border border-teal/30 shadow-lg shadow-teal/10" 
                        : "hover:bg-[hsl(var(--academy-topic-hover))] border border-transparent"
                    )}
                  >
                    {/* Glow effect on active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-teal/10 to-transparent opacity-50 blur-xl" />
                    )}
                    
                    {/* Completion Icon */}
                    <div className="flex-shrink-0 relative z-10">
                      {topic.completed ? (
                        <div className="relative">
                          <CheckCircle2 className="h-5 w-5 text-teal animate-scale-in" />
                          <div className="absolute inset-0 bg-teal/20 rounded-full blur-md" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground group-hover:text-teal-ink transition-colors" />
                      )}
                    </div>

                    {/* Topic Icon */}
                    <div className={cn(
                      "flex-shrink-0 relative z-10 transition-colors",
                      isActive ? "text-teal-ink" : "text-muted-foreground group-hover:text-teal-ink"
                    )}>
                      {getTopicIcon(topic.type)}
                    </div>

                    {/* Title */}
                    <span className={cn(
                      "flex-1 text-left truncate relative z-10 transition-colors",
                      isActive && "text-foreground",
                      topic.completed && !isActive && "text-muted-foreground",
                      !topic.completed && !isActive && "text-foreground/90"
                    )}>
                      {topic.title}
                    </span>

                    {/* Arrow indicator */}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-teal animate-pulse relative z-10" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function LessonTOCSidebar(props: LessonTOCSidebarProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSED_KEY);
    return stored === 'true';
  });

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(COLLAPSED_KEY, newValue.toString());
  };

  // Mobile: Sheet/Drawer
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-50 rounded-2xl shadow-2xl bg-gradient-primary hover:shadow-glow-intense text-white gap-2.5 px-7 h-16 font-semibold text-base backdrop-blur-sm border border-teal/20 animate-fade-in"
            aria-label={t('academy.lesson.toc_toggle', 'Toggle table of contents')}
          >
            <Menu className="h-5 w-5" />
            <span>Contenido</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] bg-surface/95 backdrop-blur-xl border-t border-teal/20">
          <SidebarContent {...props} onClose={() => {}} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Collapsible Sidebar
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-line/30 bg-surface/80 backdrop-blur-xl transition-all duration-500 ease-in-out shadow-[var(--shadow-card)] flex flex-col flex-shrink-0 z-40",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-line/30 bg-gradient-to-r from-surface/50 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed 
            ? t('academy.lesson.toc_expand', 'Expandir contenido')
            : t('academy.lesson.toc_collapse', 'Colapsar contenido')
          }
          className="text-teal hover:bg-teal/10 hover:text-teal-ink transition-all duration-200 rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar Content (hidden when collapsed) */}
      {!isCollapsed && (
        <div className="animate-fade-in">
          <SidebarContent {...props} />
        </div>
      )}
      
      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-6 py-6 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-subtle relative group">
            <span className="text-xs font-bold text-white">
              {props.completedCount}/{props.total}
            </span>
            <div className="absolute inset-0 bg-teal/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="h-24 w-1 bg-gradient-to-b from-teal/50 via-teal/20 to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
