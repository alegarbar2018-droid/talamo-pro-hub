import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  PlayCircle, 
  FileText, 
  Award,
  ArrowLeft,
  Clock,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Academy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['academy']);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['0.1', '0.2', '1.1']);

  const syllabus = [
    {
      level: 0,
      title: "Fundamentos del Trading",
      description: "Conceptos básicos y preparación mental",
      lessons: [
        { code: "0.1", title: "¿Qué es el trading profesional?", bullets: ["Diferencias entre trading e inversión", "Perfil del trader profesional", "Expectativas realistas"] },
        { code: "0.2", title: "Psicología del trading", bullets: ["Control emocional", "Disciplina y paciencia", "Gestión del miedo y la codicia"] },
        { code: "0.3", title: "Terminología básica", bullets: ["Pips, spreads, leverage", "Órdenes de mercado y límite", "Long vs Short"] }
      ]
    },
    {
      level: 1,
      title: "Análisis Técnico Básico",
      description: "Introducción a gráficos y patrones",
      lessons: [
        { code: "1.1", title: "Tipos de gráficos", bullets: ["Velas japonesas", "Líneas y barras", "Timeframes"] },
        { code: "1.2", title: "Soporte y resistencia", bullets: ["Identificación de niveles", "Ruptura y retesteo", "Zonas de valor"] },
        { code: "1.3", title: "Tendencias y canales", bullets: ["Tendencia alcista/bajista", "Líneas de tendencia", "Canales de precio"] }
      ]
    },
    {
      level: 2,
      title: "Gestión de Riesgo",
      description: "Protección del capital y money management",
      lessons: [
        { code: "2.1", title: "Tamaño de posición", bullets: ["Cálculo de lotes", "Regla del 1-2%", "Risk/Reward ratio"] },
        { code: "2.2", title: "Stop Loss y Take Profit", bullets: ["Colocación técnica", "Trailing stops", "Break even"] },
        { code: "2.3", title: "Drawdown y recuperación", bullets: ["Máximo drawdown aceptable", "Curva de capital", "Pausas operativas"] }
      ]
    },
    {
      level: 3,
      title: "Estrategias Avanzadas",
      description: "Sistemas de trading y backtesting",
      lessons: [
        { code: "3.1", title: "Desarrollo de sistemas", bullets: ["Reglas de entrada", "Gestión de posiciones", "Salidas sistemáticas"] },
        { code: "3.2", title: "Backtesting", bullets: ["Datos históricos", "Métricas de rendimiento", "Optimización"] },
        { code: "3.3", title: "Trading algorítmico", bullets: ["Expert Advisors", "Automatización", "Monitoreo de sistemas"] }
      ]
    },
    {
      level: 4,
      title: "Trading Profesional",
      description: "Escalado y gestión avanzada",
      lessons: [
        { code: "4.1", title: "Escalado de capital", bullets: ["Crecimiento progresivo", "Diversificación", "Múltiples estrategias"] },
        { code: "4.2", title: "Análisis de rendimiento", bullets: ["Métricas avanzadas", "Factor de beneficio", "Ratio de Sharpe"] },
        { code: "4.3", title: "Trading como negocio", bullets: ["Planificación fiscal", "Registro de operaciones", "Mejora continua"] }
      ]
    }
  ];

  const getLessonStatus = (lessonCode: string, levelIndex: number) => {
    if (completedLessons.includes(lessonCode)) return 'completed';
    if (levelIndex === 0 || completedLessons.some(code => parseInt(code[0]) >= levelIndex - 1)) {
      return 'available';
    }
    return 'locked';
  };

  const getLevelProgress = (level: any) => {
    const totalLessons = level.lessons.length;
    const completedCount = level.lessons.filter(lesson => 
      completedLessons.includes(lesson.code)
    ).length;
    return (completedCount / totalLessons) * 100;
  };

  const markLessonCompleted = (lessonCode: string) => {
    if (!completedLessons.includes(lessonCode)) {
      setCompletedLessons([...completedLessons, lessonCode]);
    }
  };

  if (selectedLevel !== null) {
    const level = syllabus[selectedLevel];
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-line bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 py-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedLevel(null)}
                className="text-teal hover:bg-teal/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('academy:back_to_levels')}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('academy:levels.level')} {level.level}: {level.title}</h1>
                <p className="text-muted-foreground">{level.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {level.lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.code, selectedLevel);
              const isCompleted = status === 'completed';
              const isAvailable = status === 'available';

              return (
                <Card 
                  key={lesson.code}
                  className={`border-line transition-all ${
                    isCompleted ? 'bg-success/5 border-success/20' :
                    isAvailable ? 'bg-surface hover:shadow-glow-subtle cursor-pointer' :
                    'bg-muted/20 opacity-50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : isAvailable ? (
                          <PlayCircle className="h-6 w-6 text-teal" />
                        ) : (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-foreground">
                            {lesson.code}. {lesson.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {lesson.bullets.length} {t('academy:lesson.key_concepts')}
                          </CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <Badge variant="outline" className="border-success text-success">
                          {t('academy:lesson.completed_badge')}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  {isAvailable && (
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">{t('academy:lesson.objectives')}</h4>
                        <ul className="space-y-2">
                          {lesson.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="flex items-start gap-2 text-muted-foreground">
                              <Target className="h-4 w-4 mt-0.5 text-teal flex-shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex gap-3 pt-4">
                          <Button 
                            variant="outline"
                            className="border-teal text-teal hover:bg-teal/10"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {t('academy:lesson.view_content')}
                          </Button>
                          {!isCompleted && (
                            <Button 
                              onClick={() => markLessonCompleted(lesson.code)}
                              className="bg-gradient-primary hover:shadow-glow"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('academy:lesson.mark_completed')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('academy:title')}</h1>
              <p className="text-muted-foreground">{t('academy:subtitle')}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('academy:back_to_dashboard')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {syllabus.map((level, index) => {
            const progress = getLevelProgress(level);
            const totalLessons = level.lessons.length;
            const completedCount = level.lessons.filter(lesson => 
              completedLessons.includes(lesson.code)
            ).length;
            const isUnlocked = index === 0 || getLevelProgress(syllabus[index - 1]) > 0;

            return (
              <Card 
                key={level.level}
                className={`border-line transition-all cursor-pointer ${
                  isUnlocked 
                    ? 'bg-surface hover:shadow-glow-subtle' 
                    : 'bg-muted/20 opacity-50'
                }`}
                onClick={() => isUnlocked && setSelectedLevel(index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {progress === 100 ? (
                        <Award className="h-8 w-8 text-success" />
                      ) : isUnlocked ? (
                        <BookOpen className="h-8 w-8 text-teal" />
                      ) : (
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      )}
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {t('academy:levels.level')} {level.level}
                        </Badge>
                      </div>
                    </div>
                    {progress === 100 && (
                      <Badge className="bg-success text-success-foreground">
                        {t('academy:levels.completed')}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-foreground">{level.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {totalLessons} {t('academy:progress.lessons')}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('academy:levels.level')}</span>
                        <span className="text-foreground">{completedCount}/{totalLessons}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    {isUnlocked ? (
                      <Button 
                        variant="outline" 
                        className="w-full border-teal text-teal hover:bg-teal/10"
                      >
                        {progress > 0 ? t('academy:levels.continue') : t('academy:levels.start')}
                      </Button>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        {t('academy:levels.unlock_message')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Summary */}
        <Card className="border-line bg-surface mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">{t('academy:progress.title')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('academy:progress.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">{completedLessons.length}</div>
                <div className="text-sm text-muted-foreground">{t('academy:progress.lessons_completed')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">
                  {syllabus.filter(level => getLevelProgress(level) === 100).length}
                </div>
                <div className="text-sm text-muted-foreground">{t('academy:progress.levels_completed')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">
                  {Math.round((completedLessons.length / syllabus.reduce((acc, level) => acc + level.lessons.length, 0)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">{t('academy:progress.total_progress')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Academy;