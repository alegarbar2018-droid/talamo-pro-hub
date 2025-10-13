import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, FileText, Download, ExternalLink, Image as ImageIcon, FileArchive } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';

const LessonView = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['user-completed-lessons'] });
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

  return (
    <div className="min-h-screen bg-background">
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
          <Card>
            <CardContent className="p-0">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        {lesson.content_md && (
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{lesson.content_md}</ReactMarkdown>
              </div>
              {lesson.duration_min && (
                <p className="text-sm text-muted-foreground mt-4">
                  Duration: {lesson.duration_min} minutes
                </p>
              )}
            </CardContent>
          </Card>
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
                  <div key={resource.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
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
  );
};

export default LessonView;
