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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {t('academy.lesson.toc_title', 'Contenido')}
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('academy.lesson.progress', 'Progreso')}
            </span>
            <span className="font-medium text-foreground">
              {completedCount}/{total}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress}% {t('academy.lesson.completed', 'completado')}
          </p>
        </div>
      </div>

      {/* Topic List */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav aria-label={t('academy.lesson.toc_nav', 'Navegación de lección')}>
          <ul className="space-y-1">
            {topics.map((topic) => {
              const isActive = activeTopicId === topic.id;
              return (
                <li key={topic.id}>
                  <button
                    onClick={() => {
                      onTopicClick(topic.id);
                      onClose?.();
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors group",
                      "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {/* Completion Icon */}
                    <div className="flex-shrink-0">
                      {topic.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-teal" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Topic Icon */}
                    <div className="flex-shrink-0 text-muted-foreground">
                      {getTopicIcon(topic.type)}
                    </div>

                    {/* Title */}
                    <span className={cn(
                      "flex-1 text-left truncate",
                      topic.completed && "text-muted-foreground"
                    )}>
                      {topic.title}
                    </span>

                    {/* Arrow indicator */}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-teal" />
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
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl bg-teal hover:bg-teal/90 text-white gap-2 px-6 h-14"
            aria-label={t('academy.lesson.toc_toggle', 'Toggle table of contents')}
          >
            <Menu className="h-5 w-5" />
            <span className="font-semibold">Contenido</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SidebarContent {...props} onClose={() => {}} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Collapsible Sidebar
  return (
    <div
      className={cn(
        "sticky top-0 h-screen border-r border-border bg-surface transition-all duration-300",
        isCollapsed ? "w-14" : "w-72"
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed 
            ? t('academy.lesson.toc_expand', 'Expandir contenido')
            : t('academy.lesson.toc_collapse', 'Colapsar contenido')
          }
          className="text-teal hover:bg-teal/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar Content (hidden when collapsed) */}
      {!isCollapsed && <SidebarContent {...props} />}
      
      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
            <span className="text-xs font-bold text-teal">
              {props.completedCount}/{props.total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
