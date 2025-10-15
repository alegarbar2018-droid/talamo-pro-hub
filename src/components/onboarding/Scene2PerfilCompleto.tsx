import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Target, Clock, Zap, Laptop, CheckCircle2 } from 'lucide-react';
import { OnboardingProfile, ExperienceAnswers, Goal, CapitalBand, RiskTolerance, Availability, TradingStyle, Platform } from '@/lib/onboarding-engine';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Scene2PerfilCompletoProps {
  profile: Partial<OnboardingProfile>;
  onUpdate: (profile: Partial<OnboardingProfile>) => void;
  experienceAnswers: ExperienceAnswers;
  onUpdateExperience: (answers: ExperienceAnswers) => void;
  onNext: () => void;
  onBack: () => void;
}

type Section = 'objetivo' | 'recursos' | 'experiencia';

export const Scene2PerfilCompleto: React.FC<Scene2PerfilCompletoProps> = ({
  profile,
  onUpdate,
  experienceAnswers,
  onUpdateExperience,
  onNext,
  onBack
}) => {
  const [currentSection, setCurrentSection] = useState<Section>('objetivo');
  
  const goalOptions: { value: Goal; label: string; icon: typeof Target; color: string }[] = [
    { value: 'copiar', label: 'Invertir sin operar', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20' },
    { value: 'aprender', label: 'Invertir y aprender', icon: Target, color: 'bg-green-500/10 text-green-600 hover:bg-green-500/20' },
    { value: 'operar', label: 'Ya opero y quiero mejorar', icon: Zap, color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20' },
    { value: 'senales', label: 'Aprender y usar señales', icon: Laptop, color: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20' },
  ];
  
  const handleGoalSelect = (goal: Goal) => {
    onUpdate({ ...profile, goal });
    setTimeout(() => setCurrentSection('recursos'), 300);
  };
  
  const isRecursosValid = 
    profile.capital_band &&
    profile.risk_tolerance &&
    profile.availability &&
    profile.trading_style &&
    profile.platform_preference;
  
  const isExperienciaValid =
    experienceAnswers.control_perdidas !== undefined &&
    experienceAnswers.tamano_posicion !== undefined &&
    experienceAnswers.planificacion !== undefined &&
    experienceAnswers.registro !== undefined &&
    experienceAnswers.tiempo_operando !== undefined &&
    experienceAnswers.num_operaciones !== undefined;
  
  const handleContinue = () => {
    if (currentSection === 'objetivo' && profile.goal) {
      setCurrentSection('recursos');
    } else if (currentSection === 'recursos' && isRecursosValid) {
      setCurrentSection('experiencia');
    } else if (currentSection === 'experiencia' && isExperienciaValid) {
      onNext();
    }
  };
  
  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full space-y-6">
        {/* Progress badges */}
        <div className="flex justify-center gap-4">
          <Badge variant={currentSection === 'objetivo' ? 'default' : profile.goal ? 'outline' : 'secondary'}>
            {currentSection === 'objetivo' ? '1' : <CheckCircle2 className="h-4 w-4" />} Objetivo
          </Badge>
          <Badge variant={currentSection === 'recursos' ? 'default' : isRecursosValid ? 'outline' : 'secondary'}>
            {currentSection === 'recursos' ? '2' : isRecursosValid ? <CheckCircle2 className="h-4 w-4" /> : '2'} Recursos
          </Badge>
          <Badge variant={currentSection === 'experiencia' ? 'default' : isExperienciaValid ? 'outline' : 'secondary'}>
            {currentSection === 'experiencia' ? '3' : isExperienciaValid ? <CheckCircle2 className="h-4 w-4" /> : '3'} Experiencia
          </Badge>
        </div>
        
        {/* Objetivo Section */}
        {currentSection === 'objetivo' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">¿Qué quieres lograr ahora?</h2>
              <p className="text-muted-foreground">Selecciona el camino que mejor describa tus objetivos</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      profile.goal === option.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleGoalSelect(option.value)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`w-12 h-12 mx-auto rounded-full ${option.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="font-medium">{option.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Recursos Section */}
        {currentSection === 'recursos' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Cuéntame sobre tus recursos</h2>
              <p className="text-muted-foreground">Esto nos ayuda a personalizar tu experiencia</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">¿Con cuánto planeas empezar?</label>
                <Select value={profile.capital_band} onValueChange={(value) => onUpdate({ ...profile, capital_band: value as CapitalBand })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<500">Menos de $500</SelectItem>
                    <SelectItem value="500-2000">$500 - $2,000</SelectItem>
                    <SelectItem value="2000-10000">$2,000 - $10,000</SelectItem>
                    <SelectItem value=">10000">Más de $10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">¿Qué tanto riesgo te resulta cómodo?</label>
                <Select value={profile.risk_tolerance} onValueChange={(value) => onUpdate({ ...profile, risk_tolerance: value as RiskTolerance })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajo">Bajo - Prefiero estabilidad</SelectItem>
                    <SelectItem value="medio">Medio - Balance equilibrado</SelectItem>
                    <SelectItem value="alto">Alto - Busco crecimiento rápido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">¿Cuánto tiempo puedes dedicar por semana?</label>
                <Select value={profile.availability} onValueChange={(value) => onUpdate({ ...profile, availability: value as Availability })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<2h">Menos de 2 horas</SelectItem>
                    <SelectItem value="2-5h">2 a 5 horas</SelectItem>
                    <SelectItem value="5-10h">5 a 10 horas</SelectItem>
                    <SelectItem value=">10h">Más de 10 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">¿Qué tipo de estrategia te atrae más?</label>
                <Select value={profile.trading_style} onValueChange={(value) => onUpdate({ ...profile, trading_style: value as TradingStyle })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tranquila">Tranquila - Posiciones largas</SelectItem>
                    <SelectItem value="moderada">Moderada - Swing trading</SelectItem>
                    <SelectItem value="rapida">Rápida - Day trading/Scalping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">¿Qué plataforma te gustaría usar?</label>
                <Select value={profile.platform_preference} onValueChange={(value) => onUpdate({ ...profile, platform_preference: value as Platform })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MT4">MetaTrader 4</SelectItem>
                    <SelectItem value="MT5">MetaTrader 5</SelectItem>
                    <SelectItem value="solo_copiar">Solo Copy Trading</SelectItem>
                    <SelectItem value="no_lo_se">No estoy seguro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        
        {/* Experiencia Section */}
        {currentSection === 'experiencia' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Evaluemos tu experiencia</h2>
              <p className="text-muted-foreground">Responde honestamente, no hay respuestas malas</p>
            </div>
            
            <div className="space-y-4">
              {/* Control de pérdidas */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-3">Cuando una operación va en tu contra, ¿qué haces?</p>
                  <div className="space-y-2">
                    <Button
                      variant={experienceAnswers.control_perdidas === 1 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, control_perdidas: 1 })}
                    >
                      Cierro donde dije al principio
                    </Button>
                    <Button
                      variant={experienceAnswers.control_perdidas === 0 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, control_perdidas: 0 })}
                    >
                      Espero a que se recupere
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tamaño de posición */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-3">¿Cómo eliges el tamaño de tus operaciones?</p>
                  <div className="space-y-2">
                    <Button
                      variant={experienceAnswers.tamano_posicion === 1 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, tamano_posicion: 1 })}
                    >
                      Pequeño y calculado
                    </Button>
                    <Button
                      variant={experienceAnswers.tamano_posicion === 0 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, tamano_posicion: 0 })}
                    >
                      Depende de cómo me sienta
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Planificación */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-3">Antes de operar, ¿tienes un plan definido?</p>
                  <div className="space-y-2">
                    <Button
                      variant={experienceAnswers.planificacion === 1 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, planificacion: 1 })}
                    >
                      Sí, tengo reglas claras
                    </Button>
                    <Button
                      variant={experienceAnswers.planificacion === 0 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, planificacion: 0 })}
                    >
                      No, improviso según veo el mercado
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Registro */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-3">¿Llevas registro de tus operaciones?</p>
                  <div className="space-y-2">
                    <Button
                      variant={experienceAnswers.registro === 1 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, registro: 1 })}
                    >
                      Siempre registro todo
                    </Button>
                    <Button
                      variant={experienceAnswers.registro === 0 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, registro: 0 })}
                    >
                      No llevo registro
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tiempo operando */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-3">¿Cuánto tiempo llevas operando con dinero real?</p>
                  <div className="space-y-2">
                    <Button
                      variant={experienceAnswers.tiempo_operando === 0 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, tiempo_operando: 0 })}
                    >
                      Nunca / Solo demo
                    </Button>
                    <Button
                      variant={experienceAnswers.tiempo_operando === 1 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, tiempo_operando: 1 })}
                    >
                      Menos de 6 meses
                    </Button>
                    <Button
                      variant={experienceAnswers.tiempo_operando === 2 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, tiempo_operando: 2 })}
                    >
                      6 meses a 2 años
                    </Button>
                    <Button
                      variant={experienceAnswers.tiempo_operando === 3 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, tiempo_operando: 3 })}
                    >
                      Más de 2 años
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Número de operaciones */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-3">¿Aproximadamente cuántas operaciones has hecho?</p>
                  <div className="space-y-2">
                    <Button
                      variant={experienceAnswers.num_operaciones === 0 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, num_operaciones: 0 })}
                    >
                      Menos de 50
                    </Button>
                    <Button
                      variant={experienceAnswers.num_operaciones === 1 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, num_operaciones: 1 })}
                    >
                      50 a 200
                    </Button>
                    <Button
                      variant={experienceAnswers.num_operaciones === 2 ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => onUpdateExperience({ ...experienceAnswers, num_operaciones: 2 })}
                    >
                      Más de 200
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex gap-3">
          {(currentSection === 'recursos' || currentSection === 'experiencia') && (
            <Button
              variant="outline"
              onClick={() => {
                if (currentSection === 'recursos') setCurrentSection('objetivo');
                else if (currentSection === 'experiencia') setCurrentSection('recursos');
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Atrás
            </Button>
          )}
          
          {currentSection === 'objetivo' && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Atrás
            </Button>
          )}
          
          <Button
            onClick={handleContinue}
            disabled={
              (currentSection === 'objetivo' && !profile.goal) ||
              (currentSection === 'recursos' && !isRecursosValid) ||
              (currentSection === 'experiencia' && !isExperienciaValid)
            }
            className="flex-1"
          >
            {currentSection === 'experiencia' ? 'Ver mi plan' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
