import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Target, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { COURSE, type LessonDetail, type CourseLevel } from "@/data/course";
import { useNavigate } from "react-router-dom";

const SyllabusDetailed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filterLessons = (lessons: LessonDetail[], term: string): LessonDetail[] => {
    if (!term) return lessons;
    
    return lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(term.toLowerCase()) ||
      lesson.objectives.some(obj => obj.toLowerCase().includes(term.toLowerCase())) ||
      lesson.practice.some(prac => prac.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const filteredCourse: CourseLevel[] = COURSE.map(level => ({
    ...level,
    lessons: filterLessons(level.lessons, searchTerm)
  })).filter(level => level.lessons.length > 0);

  const totalLessons = COURSE.reduce((acc, level) => acc + level.lessons.length, 0);

  return (
    <section id="temario" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Temario Detallado
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Programa completo de formación estructurada en trading profesional. 
          {totalLessons} lecciones organizadas en 5 niveles progresivos.
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lecciones, objetivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredCourse.map((level, levelIndex) => (
          <Card key={levelIndex} className="border-line bg-surface">
            <CardHeader>
              <CardTitle className="text-xl text-foreground flex items-center gap-3">
                <Badge variant="outline" className="text-teal border-teal">
                  {level.lessons.length} lecciones
                </Badge>
                {level.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {level.lessons.map((lesson, lessonIndex) => (
                  <AccordionItem key={lessonIndex} value={`${levelIndex}-${lessonIndex}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {lesson.code}
                        </Badge>
                        <span>{lesson.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-teal" />
                            <h4 className="font-semibold text-foreground">Objetivos</h4>
                          </div>
                          <ul className="space-y-2">
                            {lesson.objectives.map((objective, objIndex) => (
                              <li key={objIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-teal" />
                            <h4 className="font-semibold text-foreground">Práctica</h4>
                          </div>
                          <ul className="space-y-2">
                            {lesson.practice.map((practice, pracIndex) => (
                              <li key={pracIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                                {practice}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-teal" />
                            <h4 className="font-semibold text-foreground">Evaluación</h4>
                          </div>
                          <ul className="space-y-2">
                            {lesson.evaluation.map((evaluation, evalIndex) => (
                              <li key={evalIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                                {evaluation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Button 
          size="lg" 
          onClick={() => navigate("/auth/validate")}
          className="bg-gradient-primary hover:shadow-glow"
          data-event="cta-ingresar-academia"
        >
          Ingresar a la Academia
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={() => navigate("/auth/exness?flow=create")}
          className="border-teal text-teal hover:bg-teal/10"
          data-event="cta-crear-cuenta-temario"
        >
          <Target className="h-5 w-5 mr-2" />
          Crear Cuenta
        </Button>
      </div>
    </section>
  );
};

export default SyllabusDetailed;