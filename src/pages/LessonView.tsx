import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, FileText, Download, ExternalLink, Image as ImageIcon, FileArchive } from "lucide-react";
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
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [activeTopicId, setActiveTopicId] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const tocEnabled = isFeatureEnabled('academy.lesson_toc');

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

  // TOC Adapter
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
      // Remove 'public/' prefix if present for correct URL generation
      const cleanKey = resource.storage_key.replace(/^public\//, '');
      return supabase.storage.from('lms-assets').getPublicUrl(cleanKey).data.publicUrl;
    }
    return resource.external_url;
  };

  // Smooth scroll to topic
  const handleTopicClick = (topicId: string) => {
    setActiveTopicId(topicId);
    const el = getTopicRef(topicId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Temporary highlight
      el.classList.add('ring-2', 'ring-teal', 'ring-offset-2');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-teal', 'ring-offset-2');
      }, 2000);
    }
  };

  // Video progress tracking (always run hook, condition inside)
  useEffect(() => {
    if (!tocEnabled || !videoRef.current) return;
    
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      if (progress >= 80) {
        markTopicComplete('topic-video');
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [tocEnabled, markTopicComplete]);

  // Listen to progress updates (always run hook, condition inside)
  useEffect(() => {
    if (!tocEnabled) return;
    
    const handleProgressUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-topics', lessonId] });
    };
    
    window.addEventListener('lesson-progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('lesson-progress-updated', handleProgressUpdate);
  }, [tocEnabled, queryClient, lessonId]);

  return (
    <div className="min-h-screen bg-background flex">
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
      <div className="flex-1">
        <div className="border-b border-line bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 py-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="text-teal hover:bg-teal/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{lesson.course_item?.title}</h1>
                <div className="text-sm text-muted-foreground mt-1">
                  {lesson.module?.course?.level && `Level ${lesson.module.course.level}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Cover Image */}
          {coverImageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={coverImageUrl} 
                alt={lesson.course_item?.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Video Player */}
          {videoUrl && (
            <div ref={(el) => tocEnabled && registerTopicRef('topic-video', el)}>
              <Card>
                <CardContent className="p-0">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full aspect-video bg-black"
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
            <div ref={(el) => tocEnabled && registerTopicRef('topic-content', el)}>
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedContentRenderer content={lesson.content_md} />
                  {lesson.duration_min && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Duration: {lesson.duration_min} minutes
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resources & Materials */}
          {resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resources & Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {resources.map((resource: any) => (
                    <div 
                      key={resource.id} 
                      ref={(el) => tocEnabled && registerTopicRef(`topic-resource-${resource.id}`, el)}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.kind)}
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{resource.kind}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const url = getResourceUrl(resource);
                          if (tocEnabled) {
                            markTopicComplete(`topic-resource-${resource.id}`);
                          }
                          if (resource.kind === 'link') {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            // Create a download link
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
          )}

          {/* Quiz Section */}
          {lesson.quiz_id && (
            <div ref={(el) => tocEnabled && registerTopicRef('topic-quiz', el)}>
              <Card>
                <CardHeader>
                  <CardTitle>Quiz</CardTitle>
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
              className="w-full"
              size="lg"
              onClick={() => markComplete.mutate()}
              disabled={markComplete.isPending}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Mark Lesson as Complete
            </Button>
          )}

          {/* Completed Badge */}
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-500 font-medium">Lesson Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
