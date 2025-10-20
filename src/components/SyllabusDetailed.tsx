import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Target, TrendingUp, ChevronDown, Search, Clock } from "lucide-react";
import { COURSE } from "@/data/course";

export default function SyllabusDetailed() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState("0");
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation('academy');

  const filterLessons = (lessons: any[], term: string) => {
    if (!term) return lessons;
    return lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(term.toLowerCase()) ||
        lesson.objectives.some((obj: string) => obj.toLowerCase().includes(term.toLowerCase())) ||
        lesson.practice.some((prac: string) => prac.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const totalLessons = useMemo(() => 
    COURSE.reduce((acc, level) => acc + level.lessons.length, 0),
    []
  );

  return (
    <section id="syllabus-section" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto relative">
        {/* Clean header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Temario completo
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {COURSE.length} niveles • {totalLessons} lecciones estructuradas
          </p>
        </motion.div>

        {/* Simple expand button */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 h-auto text-base rounded-xl transition-all duration-300"
          >
            {isExpanded ? "Ocultar temario" : "Ver temario detallado"}
            <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Clean search */}
              <div className="relative max-w-xl mx-auto mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar lecciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base bg-surface/50 border-primary/20 focus:border-primary/40 rounded-xl"
                />
              </div>

              {/* Simple tabs */}
              <Tabs value={activeLevel} onValueChange={setActiveLevel} className="space-y-8">
                <TabsList className="grid grid-cols-4 md:grid-cols-7 gap-2 bg-surface/30 p-1 rounded-xl">
                  {COURSE.map((_, index) => (
                    <TabsTrigger
                      key={index}
                      value={String(index)}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                    >
                      N{index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {COURSE.map((level, originalIndex) => {
                  const filteredLessons = filterLessons(level.lessons, searchTerm);
                  if (filteredLessons.length === 0 && searchTerm) return null;

                  return (
                    <TabsContent key={originalIndex} value={String(originalIndex)} className="mt-0">
                      <Card className="bg-surface/30 border-primary/10">
                        <CardContent className="p-8">
                          {/* Level info */}
                          <div className="mb-8 pb-6 border-b border-primary/10">
                            <h3 className="text-3xl font-bold mb-2">{level.level}</h3>
                            <p className="text-muted-foreground">
                              {filteredLessons.length} lecciones • ~{filteredLessons.length * 30} minutos
                            </p>
                          </div>

                          {/* Lessons */}
                          <Accordion type="multiple" className="space-y-3">
                            {filteredLessons.map((lesson, lessonIndex) => (
                              <AccordionItem
                                key={lessonIndex}
                                value={`lesson-${originalIndex}-${lessonIndex}`}
                                className="border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 transition-colors duration-300"
                              >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-surface/30">
                                  <div className="flex items-center gap-4 w-full pr-4 text-left">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">
                                          {originalIndex + 1}.{lessonIndex + 1}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="w-3 h-3 mr-1" />
                                          30 min
                                        </Badge>
                                      </div>
                                      <h4 className="font-semibold text-foreground">
                                        {lesson.title}
                                      </h4>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4">
                                  <div className="space-y-4 pt-2">
                                    {/* Objectives */}
                                    {lesson.objectives?.length > 0 && (
                                      <div>
                                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                          <Target className="w-4 h-4 text-primary" />
                                          Objetivos
                                        </h5>
                                        <ul className="space-y-1.5 ml-6">
                                          {lesson.objectives.map((objective, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                                              <span>{objective}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Practice */}
                                    {lesson.practice?.length > 0 && (
                                      <div>
                                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                          <TrendingUp className="w-4 h-4 text-primary" />
                                          Práctica
                                        </h5>
                                        <ul className="space-y-1.5 ml-6">
                                          {lesson.practice.map((item, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                                              <span>{item}</span>
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
                  );
                })}
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
