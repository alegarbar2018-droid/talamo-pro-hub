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
  return <section id="temario" className="relative py-24 overflow-hidden">
      {/* Premium background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_70%)] opacity-5" />
      
      {/* Floating orbs */}
      <div className="absolute top-32 left-1/6 w-40 h-40 bg-gradient-to-r from-teal/15 to-accent/15 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-32 right-1/6 w-32 h-32 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      
    </section>;
};
export default SyllabusDetailed;