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
    <section id="temario" className="relative py-24 overflow-hidden">
      {/* Premium background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_70%)] opacity-5" />
      
      {/* Floating orbs */}
      <div className="absolute top-32 left-1/6 w-40 h-40 bg-gradient-to-r from-teal/15 to-accent/15 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-32 right-1/6 w-32 h-32 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-teal" />
            <span className="text-sm font-medium text-teal tracking-wider uppercase">Academia Estructurada</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-teal to-accent bg-clip-text text-transparent">
              Temario Detallado
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Programa completo de formación estructurada en trading profesional. 
            <span className="text-teal font-semibold">{totalLessons} lecciones</span> organizadas en 
            <span className="text-accent font-semibold"> 5 niveles progresivos</span>.
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-teal to-accent mx-auto mb-8 rounded-full" />
          
          {/* Premium search */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-teal/20 to-accent/20 rounded-xl blur opacity-50" />
            <div className="relative bg-surface/80 backdrop-blur-sm border border-line/50 rounded-xl p-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal" />
                <Input
                  placeholder="Buscar lecciones, objetivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {filteredCourse.map((level, levelIndex) => (
            <Card 
              key={levelIndex} 
              className="group relative border-line/50 bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-sm hover:shadow-glow-elegant transition-all duration-500"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative pb-6">
                <CardTitle className="text-2xl text-foreground flex items-center gap-4 group-hover:text-teal transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className="bg-gradient-to-r from-teal/20 to-accent/20 border-teal/30 text-teal font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm hover:shadow-md hover:from-teal/30 hover:to-accent/30 transition-all duration-200"
                    >
                      {level.lessons.length} lecciones
                    </Badge>
                    <div className="w-2 h-8 bg-gradient-to-b from-teal to-accent rounded-full" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-teal bg-clip-text text-transparent">
                    {level.level}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative">
                <Accordion type="multiple" className="w-full space-y-4">
                  {level.lessons.map((lesson, lessonIndex) => (
                    <AccordionItem 
                      key={lessonIndex} 
                      value={`${levelIndex}-${lessonIndex}`}
                      className="border border-line/30 rounded-lg bg-surface/30 hover:bg-surface/50 transition-colors duration-300"
                    >
                      <AccordionTrigger className="text-left px-6 py-4 hover:no-underline group/trigger">
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex items-center gap-3">
                            <Badge 
                              className="bg-gradient-to-r from-primary/20 to-teal/20 border-primary/30 text-primary font-mono text-xs px-3 py-1 rounded-full backdrop-blur-sm shadow-sm group-hover/trigger:shadow-md group-hover/trigger:from-primary/30 group-hover/trigger:to-teal/30 transition-all duration-200"
                            >
                              {lesson.code}
                            </Badge>
                            <span className="font-medium text-foreground group-hover/trigger:text-teal transition-colors">
                              {lesson.title}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                          {/* Objetivos */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-teal/10">
                                <Target className="h-5 w-5 text-teal" />
                              </div>
                              <h4 className="font-bold text-foreground text-lg">Objetivos</h4>
                            </div>
                            <ul className="space-y-3">
                              {lesson.objectives.map((objective, objIndex) => (
                                <li key={objIndex} className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group/item">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal to-accent mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                                  <span className="leading-relaxed">{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Práctica */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-accent/10">
                                <BookOpen className="h-5 w-5 text-accent" />
                              </div>
                              <h4 className="font-bold text-foreground text-lg">Práctica</h4>
                            </div>
                            <ul className="space-y-3">
                              {lesson.practice.map((practice, pracIndex) => (
                                <li key={pracIndex} className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group/item">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-primary mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                                  <span className="leading-relaxed">{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Evaluación */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <h4 className="font-bold text-foreground text-lg">Evaluación</h4>
                            </div>
                            <ul className="space-y-3">
                              {lesson.evaluation.map((evaluation, evalIndex) => (
                                <li key={evalIndex} className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group/item">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-teal mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                                  <span className="leading-relaxed">{evaluation}</span>
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

        {/* Premium CTA Section */}
        <div className="relative mt-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-accent/5 to-primary/5 rounded-2xl blur-xl" />
          <div className="relative bg-surface/60 backdrop-blur-sm border border-line/50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-foreground via-teal to-accent bg-clip-text text-transparent">
                ¿Listo para comenzar tu formación?
              </span>
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Accede a todo el contenido estructurado y comienza tu camino hacia el trading profesional
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth/validate")}
                className="group bg-gradient-to-r from-teal to-accent hover:from-teal-bright hover:to-accent-bright text-background font-semibold px-8 py-4 rounded-xl shadow-glow hover:shadow-glow-bright transition-all duration-300 hover:scale-105"
                data-event="cta-ingresar-academia"
              >
                <span className="mr-2">Ingresar a la Academia</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/auth/exness?flow=create")}
                className="group border-2 border-teal/50 text-teal hover:bg-teal/10 hover:border-teal font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                data-event="cta-crear-cuenta-temario"
              >
                <Target className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>Crear Cuenta</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal to-accent animate-pulse" />
            <div className="w-12 h-0.5 bg-gradient-to-r from-teal/60 via-accent/60 to-primary/60" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary animate-pulse delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyllabusDetailed;