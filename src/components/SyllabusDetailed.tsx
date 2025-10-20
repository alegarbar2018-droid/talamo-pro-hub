import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Target, TrendingUp, ChevronUp, ChevronDown, Search, Clock, PlayCircle } from "lucide-react";
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
    <motion.section
      id="syllabus-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 text-lg px-6 py-2 mb-6">
            {t('syllabus.badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('syllabus.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('syllabus.subtitle')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-surface/90 to-surface/50 backdrop-blur-2xl border-2 border-primary/30 shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-400">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                  <BookOpen className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {COURSE.length}
                </div>
                <div className="text-muted-foreground font-medium text-lg">
                  {t('syllabus.levels')}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-surface/90 to-surface/50 backdrop-blur-2xl border-2 border-primary/30 shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-400">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                  <Target className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {totalLessons}
                </div>
                <div className="text-muted-foreground font-medium text-lg">
                  {t('syllabus.lessons')}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) {
                setTimeout(() => {
                  document.getElementById('syllabus-section')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }, 100);
              }
            }}
            className="border-2 border-primary/40 bg-surface/60 backdrop-blur-2xl hover:bg-primary/20 hover:border-primary/60 hover:shadow-glow text-lg px-10 py-7 h-auto rounded-2xl transition-all duration-400 hover:scale-105"
          >
            {isExpanded ? (
              <>
                {t('syllabus.collapse')}
                <ChevronUp className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                {t('syllabus.expand')}
                <ChevronDown className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="max-w-7xl mx-auto"
            >
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                <Input
                  type="text"
                  placeholder={t('syllabus.search_lessons')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-16 text-lg bg-surface/60 backdrop-blur-2xl border-2 border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all duration-300"
                />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="0" className="w-full" value={activeLevel} onValueChange={setActiveLevel}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 gap-2 bg-surface/60 backdrop-blur-2xl p-2 rounded-2xl border-2 border-primary/30 mb-8">
                  {COURSE.map((level, originalIndex) => (
                    <TabsTrigger
                      key={originalIndex}
                      value={String(originalIndex)}
                      className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow data-[state=active]:scale-105 bg-surface/60 backdrop-blur-xl border-2 border-primary/30 hover:border-primary/50 hover:bg-surface/80 transition-all duration-400 rounded-xl"
                    >
                      <span className="text-base font-bold">
                        {t('syllabus.level')} {originalIndex + 1}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* TabsContent - iteramos sobre COURSE original */}
                {COURSE.map((level, originalIndex) => {
                  const filteredLessons = filterLessons(level.lessons, searchTerm);
                  
                  if (filteredLessons.length === 0 && searchTerm) return null;
                  
                  return (
                    <TabsContent key={originalIndex} value={String(originalIndex)} className="mt-0">
                      <Card className="bg-surface/30 backdrop-blur-xl border-primary/20 shadow-xl">
                        <CardContent className="p-8">
                          {/* Level header */}
                          <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm px-4 py-1.5">
                                {t('syllabus.level')} {originalIndex + 1}
                              </Badge>
                              <h3 className="text-2xl font-bold text-foreground">{level.level}</h3>
                            </div>
                            <p className="text-muted-foreground">
                              {filteredLessons.length} {t('syllabus.lessons_count')} • ~{filteredLessons.length * 30} min
                            </p>
                          </div>

                          {/* Lessons accordion */}
                          <Accordion type="multiple" className="w-full space-y-4">
                            {filteredLessons.map((lesson, lessonIndex) => (
                              <AccordionItem
                                key={lessonIndex}
                                value={`lesson-${originalIndex}-${lessonIndex}`}
                                className="border-2 border-primary/20 rounded-2xl bg-surface/30 backdrop-blur-sm overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02] hover:bg-surface/40 transition-all duration-400"
                              >
                                <AccordionTrigger className="text-left px-6 py-5 hover:no-underline hover:bg-surface/50 transition-all duration-300">
                                  <div className="flex items-center gap-4 w-full pr-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                                      <BookOpen className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge variant="outline" className="text-xs border-primary/40 bg-primary/10">
                                          {originalIndex + 1}.{lessonIndex + 1}
                                        </Badge>
                                        <Badge className="text-xs bg-accent/20 border border-accent/40">
                                          <Clock className="w-3 h-3 mr-1" />
                                          ~30 min
                                        </Badge>
                                        <Badge className="text-xs bg-primary/10 border border-primary/30">
                                          <PlayCircle className="w-3 h-3 mr-1" />
                                          Video + Lectura
                                        </Badge>
                                      </div>
                                      <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {lesson.title}
                                      </h4>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2">
                                  <div className="space-y-6">
                                    {/* Objectives */}
                                    {lesson.objectives && lesson.objectives.length > 0 && (
                                      <div>
                                        <h5 className="font-semibold text-base mb-3 flex items-center gap-2 text-foreground">
                                          <Target className="h-5 w-5 text-primary" />
                                          {t('syllabus.objectives')}
                                        </h5>
                                        <ul className="space-y-2 ml-7">
                                          {lesson.objectives.map((objective, objIdx) => (
                                            <li key={objIdx} className="flex items-start gap-2 text-muted-foreground">
                                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                              <span>{objective}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Practice */}
                                    {lesson.practice && lesson.practice.length > 0 && (
                                      <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-primary/20 rounded-xl p-4">
                                        <h5 className="font-semibold text-base mb-3 flex items-center gap-2 text-foreground">
                                          <TrendingUp className="h-5 w-5 text-primary" />
                                          {t('syllabus.practice')}
                                        </h5>
                                        <ul className="space-y-2 ml-7">
                                          {lesson.practice.map((item, practiceIdx) => (
                                            <li key={practiceIdx} className="flex items-start gap-2 text-muted-foreground">
                                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
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

        {/* Footer Disclaimer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 mt-16"
        >
          <div className="max-w-4xl mx-auto bg-surface/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-8">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{t('disclaimer.title')}:</strong> {t('disclaimer.text')}
            </p>
          </div>
        </motion.footer>
      </div>
    </motion.section>
  );
}
