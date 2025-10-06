import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, FileText, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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

  const resources = lesson.resources as any[] || [];

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
        <Card>
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                {lesson.course_item?.title || 'Watch the video above to learn more.'}
              </p>
              {lesson.course_item?.duration_min && (
                <p className="text-sm text-muted-foreground">
                  Duration: {lesson.course_item.duration_min} minutes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        {resources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resources.map((resource: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {resource.type === 'pdf' ? <FileText className="h-5 w-5" /> : <Download className="h-5 w-5" />}
                      <span>{resource.title || `Resource ${index + 1}`}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mark Complete Button */}
        {session && (
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
      </div>
    </div>
  );
};

export default LessonView;
