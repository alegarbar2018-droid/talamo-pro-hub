import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Target, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { COURSE, type LessonDetail, type CourseLevel } from "@/data/course";
import { useNavigate } from "react-router-dom";
const SyllabusDetailed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const filterLessons = (lessons: LessonDetail[], term: string): LessonDetail[] => {
    if (!term) return lessons;
    return lessons.filter(lesson => lesson.title.toLowerCase().includes(term.toLowerCase()) || lesson.objectives.some(obj => obj.toLowerCase().includes(term.toLowerCase())) || lesson.practice.some(prac => prac.toLowerCase().includes(term.toLowerCase())));
  };
  const filteredCourse: CourseLevel[] = COURSE.map(level => ({
    ...level,
    lessons: filterLessons(level.lessons, searchTerm)
  })).filter(level => level.lessons.length > 0);
  const totalLessons = COURSE.reduce((acc, level) => acc + level.lessons.length, 0);
  return (
    <section id="temario" className="relative py-12 overflow-hidden">
      {/* Premium background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_70%)] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Temario Detallado
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Programa estructurado de formación profesional en trading
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar lecciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{filteredCourse.length}</div>
            <div className="text-sm text-muted-foreground">Niveles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalLessons}</div>
            <div className="text-sm text-muted-foreground">Lecciones</div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-4xl mx-auto">
          {filteredCourse.map((level, levelIndex) => (
            <Card key={levelIndex} className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    Nivel {levelIndex + 1}
                  </Badge>
                  <span>{level.level}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {level.lessons.map((lesson, lessonIndex) => (
                    <AccordionItem key={lessonIndex} value={`lesson-${levelIndex}-${lessonIndex}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>{lesson.title}</span>
                          <Badge variant="outline" className="ml-auto">
                            {lesson.code}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          {/* Objectives */}
                          <div>
                            <h4 className="flex items-center gap-2 font-semibold mb-2">
                              <Target className="h-4 w-4 text-primary" />
                              Objetivos
                            </h4>
                            <ul className="space-y-1">
                              {lesson.objectives.map((objective, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {objective}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Practice */}
                          {lesson.practice.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Práctica</h4>
                              <ul className="space-y-1">
                                {lesson.practice.map((practice, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <ArrowRight className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                                    {practice}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/onboarding')}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            Comenzar Academia
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default SyllabusDetailed;