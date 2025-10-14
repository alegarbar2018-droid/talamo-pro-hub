import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, FileText, Download, ExternalLink, Image as ImageIcon, FileArchive, Sparkles, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QuizView } from "@/components/student/QuizView";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedContentRenderer } from "@/components/student/EnhancedContentRenderer";
import { LessonTOCSidebar } from "@/components/academy/LessonTOCSidebar";
import { useLessonTopics } from "@/hooks/useLessonTopics";
import { isFeatureEnabled } from "@/lib/flags";
import { updateTopicProgress } from "@/lib/lessonTracking";

const LessonView = () => {
  // ============================================
  // HOOKS SECTION - ALL HOOKS MUST BE HERE
  // (before any conditional returns)
  // ============================================
  
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [activeTopicId, setActiveTopicId] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const tocEnabled = isFeatureEnabled('academy.lesson_toc');
  
  // Badge onboarding state
  const [showNewBadge, setShowNewBadge] = useState(() => {
    const viewCount = parseInt(localStorage.getItem('toc_view_count') || '0', 10);
    return viewCount < 3;
  });

  useEffect(() => {
    if (tocEnabled && showNewBadge) {
      const viewCount = parseInt(localStorage.getItem('toc_view_count') || '0', 10);
      const newCount = viewCount + 1;
      localStorage.setItem('toc_view_count', newCount.toString());
      if (newCount >= 3) {
        setTimeout(() => setShowNewBadge(false), 5000);
      }
    }
  }, [tocEnabled, showNewBadge]);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lms_lessons')
        .select(`
          *,
          course_item:course_items(*),
          module:lms_modules(
            *,
            course:lms_courses(*)
          )
        `)
        .eq('id', lessonId!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  // Fetch resources separately
  const { data: resources = [] } = useQuery({
    queryKey: ['lesson-resources', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lms_resources')
        .select('*')
        .eq('lesson_id', lessonId!)
        .order('position', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!lessonId,
  });

  // TOC Adapter - ALWAYS called, returns empty when flag is off
  const { topics, completedCount, total, progress, markTopicComplete, registerTopicRef, getTopicRef } = useLessonTopics(lesson, resources);

  // Check if lesson is already completed
  const { data: isCompleted } = useQuery({
    queryKey: ['lesson-completion', lessonId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !lesson?.item_id) return false;

      const { data, error } = await supabase
        .from('course_events')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('course_id', lesson.item_id)
        .eq('verb', 'completed')
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!session?.user?.id && !!lesson?.item_id,
  });

  const markComplete = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('mark_lesson_complete', {
        lesson_id_param: lessonId!,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Lesson marked as complete!');
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lesson-completion', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['user-completed-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-all-courses-progress'] });
      
      // Invalidate course tree if we know the course
      if (lesson?.module?.course?.id) {
        queryClient.invalidateQueries({ queryKey: ['course-tree', lesson.module.course.id] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to mark lesson complete', {
        description: error.message,
      });
    },
  });

  // Video progress tracking with 90% threshold
  useEffect(() => {
    if (!tocEnabled || !videoRef.current) return;
    
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      if (progress >= 90) {
        markTopicComplete('topic-video');
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [tocEnabled, markTopicComplete]);

  // Intersection Observer for content sections auto-tracking
  useEffect(() => {
    if (!tocEnabled) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const topicId = entry.target.getAttribute('data-topic-id');
          if (topicId) {
            // Delay to ensure user actually reads content
            setTimeout(() => {
              if (entry.isIntersecting) {
                markTopicComplete(topicId);
              }
            }, 2000);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.6,
      rootMargin: '0px',
    });

    // Observe all content sections with data-topic-id
    const contentSections = document.querySelectorAll('[data-topic-id]');
    contentSections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [tocEnabled, markTopicComplete, lesson]);

  // Listen for quiz completion event
  useEffect(() => {
    if (!tocEnabled) return;

    const handleQuizComplete = () => {
      markTopicComplete('topic-quiz');
    };

    window.addEventListener('quiz-completed', handleQuizComplete);
    return () => window.removeEventListener('quiz-completed', handleQuizComplete);
  }, [tocEnabled, markTopicComplete]);

  // ============================================
  // END HOOKS SECTION
  // Conditional returns are safe after this point
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Lesson not found</p>
            <Button onClick={() => navigate('/academy')}>Back to Academy</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================
  // DERIVED VALUES (after hooks, before render)
  // ============================================

  const videoUrl = lesson.video_storage_key
    ? supabase.storage.from('lms').getPublicUrl(lesson.video_storage_key).data.publicUrl
    : lesson.video_external_url;

  const coverImageUrl = lesson.cover_image
    ? supabase.storage.from('lms-assets').getPublicUrl(lesson.cover_image).data.publicUrl
    : null;

  const getResourceIcon = (kind: string) => {
    switch (kind) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'zip': return <FileArchive className="h-5 w-5" />;
      case 'link': return <ExternalLink className="h-5 w-5" />;
      default: return <Download className="h-5 w-5" />;
    }
  };

  const getResourceUrl = (resource: any) => {
    if (resource.storage_key) {
      const cleanKey = resource.storage_key.replace(/^public\//, '');
      return supabase.storage.from('lms-assets').getPublicUrl(cleanKey).data.publicUrl;
    }
    return resource.external_url;
  };

  const handleTopicClick = (topicId: string) => {
    setActiveTopicId(topicId);
    
    // First try to get from registered refs
    let el = getTopicRef(topicId);
    
    // Fallback: try to find by data-topic-id attribute
    if (!el) {
      el = document.querySelector(`[data-topic-id="${topicId}"]`) as HTMLElement;
    }
    
    // Fallback: for h2 topics, find by id in the rendered markdown
    if (!el && topicId.startsWith('topic-h2-')) {
      const h2Elements = document.querySelectorAll('.prose h2');
      const index = parseInt(topicId.replace('topic-h2-', ''), 10);
      el = h2Elements[index] as HTMLElement;
    }
    
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-teal', 'ring-offset-2');
      setTimeout(() => {
        el?.classList.remove('ring-2', 'ring-teal', 'ring-offset-2');
      }, 2000);
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[hsl(222_20%_5%)] flex">
      {/* TOC Sidebar - Always rendered to maintain hook count, but hidden via CSS when disabled */}
      <div className={tocEnabled ? 'block' : 'hidden'}>
        <LessonTOCSidebar
          topics={topics}
          completedCount={completedCount}
          total={total}
          progress={progress}
          onTopicClick={handleTopicClick}
          activeTopicId={activeTopicId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 border-b border-teal/10 bg-gradient-to-r from-surface/95 via-surface/90 to-surface/95 backdrop-blur-2xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-teal/5 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 relative">
            <div className="flex items-center gap-5 py-6">
              <Button 
                variant="ghost" 
                onClick={() => {
                  const courseId = lesson.module?.course?.id;
                  if (courseId) {
                    navigate(`/academy/course/${courseId}`);
                  } else {
                    navigate('/academy');
                  }
                }}
                className="text-teal hover:bg-teal/10 hover:text-teal-ink transition-all rounded-xl group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <ArrowLeft className="h-4 w-4 mr-2 relative z-10 group-hover:-translate-x-1 transition-transform" />
                <span className="relative z-10 font-semibold">Regresar</span>
              </Button>
              
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-line/50 to-transparent" />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-teal-ink bg-clip-text text-transparent tracking-tight">
                    {lesson.course_item?.title}
                  </h1>
                  {tocEnabled && showNewBadge && (
                    <Badge className="bg-gradient-primary text-white border-teal/20 gap-1.5 animate-pulse shadow-glow-subtle px-3 py-1.5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      <Sparkles className="h-3.5 w-3.5 relative z-10" />
                      <span className="font-semibold relative z-10">{t('academy.lesson.new_feature', '¡Nuevo!')}</span>
                    </Badge>
                  )}
                </div>
                {lesson.module?.course?.level && (
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal/50 animate-pulse" />
                    <span className="text-sm text-muted-foreground font-medium tracking-wide">
                      Level {lesson.module.course.level}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 space-y-8">
          {/* Cover Image */}
          {coverImageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-lg animate-fade-in ring-1 ring-line/20">
              <img 
                src={coverImageUrl} 
                alt={lesson.course_item?.title}
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Video Player */}
          {videoUrl && (
            <div ref={(el) => tocEnabled && registerTopicRef('topic-video', el)} className="animate-slide-up">
              <Card className="content-card overflow-hidden">
                <CardContent className="p-0">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full aspect-video bg-black rounded-t-lg"
                    src={videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lesson Content */}
          {lesson.content_md && (
            <div 
              ref={(el) => tocEnabled && registerTopicRef('topic-content', el)} 
              data-topic-id="topic-content"
              className="animate-slide-up"
            >
              <Card className="content-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-subtle">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Lesson Content</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <EnhancedContentRenderer content={lesson.content_md} />
                  {lesson.duration_min && (
                    <div className="mt-6 pt-6 border-t border-line/30 flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Duration: {lesson.duration_min} minutes</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resources & Materials */}
          {resources.length > 0 && (
            <div className="animate-slide-up">
              <Card className="content-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-subtle">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Resources & Materials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {resources.map((resource: any, index: number) => (
                      <div 
                        key={resource.id} 
                        ref={(el) => tocEnabled && registerTopicRef(`topic-resource-${resource.id}`, el)}
                        className="group flex items-center justify-between p-4 border border-line/30 rounded-xl hover:bg-gradient-accent hover:border-teal/30 transition-all duration-300 hover:shadow-md animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-lg bg-surface/50 flex items-center justify-center text-teal-ink group-hover:bg-teal/10 group-hover:text-teal transition-all">
                            {getResourceIcon(resource.kind)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-teal-ink transition-colors">{resource.title}</p>
                            <p className="text-xs text-muted-foreground capitalize mt-0.5">{resource.kind}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-primary hover:shadow-glow-subtle text-white border-none"
                          onClick={() => {
                            const url = getResourceUrl(resource);
                            if (tocEnabled) {
                              markTopicComplete(`topic-resource-${resource.id}`);
                            }
                            if (resource.kind === 'link') {
                              window.open(url, '_blank', 'noopener,noreferrer');
                            } else {
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = resource.title;
                              link.target = '_blank';
                              link.rel = 'noopener noreferrer';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          {resource.kind === 'link' ? 'Open' : 'Download'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quiz Section */}
          {lesson.quiz_id && (
            <div ref={(el) => tocEnabled && registerTopicRef('topic-quiz', el)} className="animate-slide-up">
              <Card className="content-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-subtle">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Quiz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <QuizView 
                    quizId={lesson.quiz_id}
                    lessonId={lessonId}
                    onComplete={() => {
                      if (tocEnabled) {
                        markTopicComplete('topic-quiz');
                      }
                      toast.success('Quiz completed! Lesson progress updated.');
                      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
                      queryClient.invalidateQueries({ queryKey: ['lesson-completion', lessonId] });
                      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mark Complete Button */}
          {session && !isCompleted && (
            <Button
              className="w-full bg-gradient-primary hover:shadow-glow-intense text-white border-none h-14 text-base font-semibold rounded-xl animate-fade-in"
              onClick={() => markComplete.mutate()}
              disabled={markComplete.isPending}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Mark Lesson as Complete
            </Button>
          )}

          {/* Completed Badge */}
          {isCompleted && (
            <div className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-success/20 to-success/10 border border-success/30 rounded-xl shadow-lg animate-scale-in">
              <CheckCircle className="h-6 w-6 text-success" />
              <span className="text-success font-bold text-lg">Lesson Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
