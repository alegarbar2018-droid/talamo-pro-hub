import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Target, BookOpen, CheckCircle, ArrowRight, GraduationCap, Clock } from "lucide-react";
import { COURSE, type LessonDetail, type CourseLevel } from "@/data/course";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const SyllabusDetailed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState("0");
  const navigate = useNavigate();
  const { t } = useTranslation("academy");
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
    <section id="temario" className="relative py-20 overflow-hidden">
      {/* Premium background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      {/* Large blur circle */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-surface/80 border border-primary/30 shadow-[var(--shadow-glow-subtle)]">
            <GraduationCap className="w-3 h-3 mr-1" />
            {t("syllabus.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t("syllabus.title")}
          </h2>
          <p className="text-muted-foreground/90 max-w-2xl mx-auto text-lg">
            {t("syllabus.subtitle")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t("syllabus.search_lessons")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-surface/50 border-line/50 focus:border-primary/50 focus:bg-surface/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center gap-8 mb-12">
          <Card className="bg-surface/50 backdrop-blur-sm border-line/50 px-6 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{filteredCourse.length}</div>
              <div className="text-sm text-muted-foreground/80 mt-1">{t("syllabus.levels")}</div>
            </div>
          </Card>
          <Card className="bg-surface/50 backdrop-blur-sm border-line/50 px-6 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{totalLessons}</div>
              <div className="text-sm text-muted-foreground/80 mt-1">{t("syllabus.lessons")}</div>
            </div>
          </Card>
        </div>

        {/* Course Content with Tabs */}
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeLevel} onValueChange={setActiveLevel} className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-surface/50 backdrop-blur-sm border border-line/50 p-2 h-auto flex-wrap">
              {filteredCourse.map((level, levelIndex) => (
                <TabsTrigger 
                  key={levelIndex} 
                  value={String(levelIndex)}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-primary/30 data-[state=active]:shadow-[var(--shadow-glow-subtle)] px-6 py-3"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {t("syllabus.level")} {levelIndex + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {filteredCourse.map((level, levelIndex) => (
              <TabsContent key={levelIndex} value={String(levelIndex)} className="mt-0">
                <Card className="bg-surface/30 backdrop-blur-sm border-primary/20 shadow-[var(--shadow-elevated)]">
                  <CardContent className="p-8">
                    {/* Level header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                          {t("syllabus.level")} {levelIndex + 1}
                        </Badge>
                        <h3 className="text-2xl font-bold">{level.level}</h3>
                      </div>
                      <p className="text-muted-foreground/80">
                        {level.lessons.length} {t("syllabus.lessons_count")}
                      </p>
                    </div>

                    {/* Lessons accordion */}
                    <Accordion type="multiple" className="w-full space-y-4">
                      {level.lessons.map((lesson, lessonIndex) => (
                        <AccordionItem 
                          key={lessonIndex} 
                          value={`lesson-${levelIndex}-${lessonIndex}`}
                          className="border border-line/30 rounded-lg bg-surface/20 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
                        >
                          <AccordionTrigger className="text-left px-6 py-4 hover:no-underline hover:bg-surface/30 transition-colors">
                            <div className="flex items-center gap-4 flex-1 pr-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-foreground mb-1">{lesson.title}</div>
                                <Badge variant="outline" className="border-primary/30 text-xs">
                                  {lesson.code}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-6 pt-4 border-t border-line/20">
                              {/* Objectives */}
                              <div className="bg-surface/30 rounded-lg p-4 border border-line/20">
                                <h4 className="flex items-center gap-2 font-semibold mb-3 text-foreground">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <Target className="h-4 w-4 text-primary" />
                                  </div>
                                  {t("syllabus.objectives")}
                                </h4>
                                <ul className="space-y-2">
                                  {lesson.objectives.map((objective, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground/90">
                                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span>{objective}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Practice */}
                              {lesson.practice.length > 0 && (
                                <div className="bg-surface/30 rounded-lg p-4 border border-line/20">
                                  <h4 className="flex items-center gap-2 font-semibold mb-3 text-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                                      <Clock className="h-4 w-4 text-accent" />
                                    </div>
                                    {t("syllabus.practice")}
                                  </h4>
                                  <ul className="space-y-2">
                                    {lesson.practice.map((practice, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground/90">
                                        <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                        <span>{practice}</span>
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
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/onboarding')}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-[var(--shadow-glow-subtle)] hover:shadow-[var(--glow-primary)] px-10 py-7 text-base transition-all duration-300"
          >
            {t("syllabus.start_academy")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default SyllabusDetailed;