import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, PlayCircle, Lock, FolderOpen, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const CourseView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data: courseTree, isLoading } = useQuery({
    queryKey: ['course-tree', slug, session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_course_tree', {
        course_slug_or_id: slug!,
        requesting_user_id: session?.user?.id || null,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!courseTree) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Course not found</p>
            <Button onClick={() => navigate('/academy')}>Back to Academy</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const course = (courseTree as any).course;
  const modules = (courseTree as any).modules || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/academy")}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge>Level {course.level}</Badge>
                {course.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {modules.map((module: any, moduleIndex: number) => (
            <Card key={module.id} className="border-line">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">
                    Module {moduleIndex + 1}: {module.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.lessons?.map((lesson: any, lessonIndex: number) => {
                    const isCompleted = lesson.completed;
                    const isAvailable = true;

                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isCompleted
                            ? 'bg-success/5 border-success/20'
                            : isAvailable
                            ? 'bg-surface hover:shadow-sm cursor-pointer'
                            : 'bg-muted/20 opacity-50'
                        }`}
                        onClick={() => isAvailable && navigate(`/academy/lesson/${lesson.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : isAvailable ? (
                            <PlayCircle className="h-5 w-5 text-teal" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              {lessonIndex + 1}. {lesson.title}
                            </div>
                            {lesson.duration_min && (
                              <div className="text-sm text-muted-foreground">
                                {lesson.duration_min} min
                              </div>
                            )}
                          </div>
                        </div>
                        {isCompleted && (
                          <Badge variant="outline" className="border-success text-success">
                            Completed
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                  
                  {module.quizzes?.map((quiz: any, quizIndex: number) => {
                    const isCompleted = quiz.completed;
                    const isAvailable = true;

                    return (
                      <div
                        key={quiz.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isCompleted
                            ? 'bg-success/5 border-success/20'
                            : isAvailable
                            ? 'bg-surface hover:shadow-sm cursor-pointer'
                            : 'bg-muted/20 opacity-50'
                        }`}
                        onClick={() => isAvailable && navigate(`/academy/quiz/${quiz.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : isAvailable ? (
                            <ClipboardCheck className="h-5 w-5 text-teal" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              Quiz: {quiz.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Puntaje mínimo: {quiz.pass_score}%
                            </div>
                          </div>
                        </div>
                        {isCompleted && (
                          <Badge variant="outline" className="border-success text-success">
                            Completed
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {modules.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">This course has no modules yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
