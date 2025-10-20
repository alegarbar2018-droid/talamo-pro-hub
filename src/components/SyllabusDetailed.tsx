import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, Target, CheckCircle, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { COURSE } from "@/data/course";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SyllabusDetailed() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState(COURSE[0].id.toString());
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const filterLessons = (lessons: any[], term: string) => {
    if (!term) return lessons;
    return lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(term.toLowerCase()) ||
        lesson.objectives.some((obj: string) => obj.toLowerCase().includes(term.toLowerCase())) ||
        lesson.practice.some((prac: string) => prac.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const filteredCourse = COURSE.map((level) => ({
    ...level,
    lessons: filterLessons(level.lessons, searchTerm),
  })).filter((level) => level.lessons.length > 0);

  const totalLessons = COURSE.reduce((acc, level) => acc + level.lessons.length, 0);

  return (
    <motion.section
      id="syllabus-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-20 relative overflow-hidden"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-surface/80 backdrop-blur-xl border border-primary/30 shadow-lg px-6 py-3 text-sm">
            {t('academy.syllabus.badge')}
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t('academy.syllabus.title')}
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            {t('academy.syllabus.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">
                  {COURSE.length}
                </div>
                <div className="text-muted-foreground font-medium">
                  {t('academy.syllabus.levels')}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border-teal/20">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal/20 to-primary/20 rounded-2xl mb-4">
                  <Target className="w-8 h-8 text-teal" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">
                  {totalLessons}
                </div>
                <div className="text-muted-foreground font-medium">
                  {t('academy.syllabus.lessons')}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Expandir/Colapsar botón */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-2 border-primary/30 bg-surface/50 backdrop-blur-xl hover:bg-primary/10 text-lg px-8 py-6 h-auto rounded-2xl"
          >
            {isExpanded ? (
              <>
                {t('academy.syllabus.collapse')}
                <ChevronUp className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                {t('academy.syllabus.expand')}
                <ChevronDown className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Contenido expandible */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={t('academy.syllabus.search_lessons')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-surface/50 backdrop-blur-xl border-primary/20 focus:border-primary/40 rounded-2xl"
              />
            </div>

            {/* Tabs de niveles */}
            <Tabs value={activeLevel} onValueChange={setActiveLevel} className="space-y-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-transparent">
                {COURSE.map((level) => (
                  <TabsTrigger
                    key={level.id}
                    value={level.id.toString()}
                    className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow bg-surface/50 backdrop-blur-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <span className="text-sm font-semibold">
                      {t('academy.syllabus.level')} {level.id}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {filteredCourse.map((level) => (
                <TabsContent key={level.id} value={level.id.toString()} className="mt-0">
                  <Card className="bg-surface/30 backdrop-blur-xl border-primary/20">
                    <CardContent className="p-8">
                      {/* Level header */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm px-4 py-1">
                            {t('academy.syllabus.level')} {level.id}
                          </Badge>
                          <h3 className="text-2xl font-bold text-foreground">{level.level}</h3>
                        </div>
                        <p className="text-muted-foreground">
                          {level.lessons.length} {t('academy.syllabus.lessons_count')}
                        </p>
                      </div>

                      {/* Lessons accordion */}
                      <Accordion type="multiple" className="w-full space-y-4">
                        {level.lessons.map((lesson, lessonIndex) => (
                          <AccordionItem
                            key={lessonIndex}
                            value={`lesson-${level.id}-${lessonIndex}`}
                            className="border border-primary/20 rounded-xl bg-surface/20 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all duration-300"
                          >
                            <AccordionTrigger className="text-left px-6 py-4 hover:no-underline hover:bg-surface/30 transition-colors">
                              <div className="flex items-center gap-4 flex-1 pr-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-foreground text-lg mb-2">{lesson.title}</div>
                                  <Badge variant="outline" className="border-primary/30 text-xs">
                                    {lesson.code}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-6 pt-4 border-t border-primary/10">
                                {/* Objectives */}
                                <div className="bg-surface/30 rounded-xl p-5 border border-primary/10">
                                  <h4 className="flex items-center gap-2 font-semibold mb-4 text-foreground text-base">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                      <Target className="h-4 w-4 text-primary" />
                                    </div>
                                    {t('academy.syllabus.objectives')}
                                  </h4>
                                  <ul className="space-y-3">
                                    {lesson.objectives.map((objective, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>{objective}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Practice */}
                                {lesson.practice.length > 0 && (
                                  <div className="bg-surface/30 rounded-xl p-5 border border-accent/10">
                                    <h4 className="flex items-center gap-2 font-semibold mb-4 text-foreground text-base">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-accent" />
                                      </div>
                                      {t('academy.syllabus.practice')}
                                    </h4>
                                    <ul className="space-y-3">
                                      {lesson.practice.map((practice, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
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
          </motion.div>
        )}

        {/* CTA final */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-16"
          >
            <Card className="bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 backdrop-blur-xl border-primary/20 p-12 inline-block max-w-2xl">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground">
                  {t('academy.syllabus.start_academy')}
                </h3>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('academy.syllabus.cta_description')}
                </p>

                <Button
                  size="lg"
                  onClick={() => navigate("/onboarding")}
                  className="bg-gradient-primary hover:shadow-glow text-lg px-10 py-7 h-auto rounded-2xl group"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  {t('academy.syllabus.cta_button')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
