import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, GraduationCap, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Goal } from '@/hooks/useOnboardingState';

interface ChooseGoalStepProps {
  name: string;
  goal: Goal | null;
  flowOrigin?: string;
  onGoalSelect: (goal: Goal) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const ChooseGoalStep: React.FC<ChooseGoalStepProps> = ({
  name,
  goal,
  flowOrigin,
  onGoalSelect,
  onBack,
  onContinue
}) => {
  const goals = [
    {
      id: 'copiar' as Goal,
      icon: Users,
      title: 'Copiar traders exitosos',
      description: 'Invierte automáticamente siguiendo estrategias verificadas',
      badge: 'Sin experiencia requerida'
    },
    {
      id: 'aprender' as Goal,
      icon: GraduationCap,
      title: 'Aprender trading',
      description: 'Domina el trading desde cero con nuestra academia',
      badge: 'Educación estructurada'
    },
    {
      id: 'operar' as Goal,
      icon: TrendingUp,
      title: 'Operar por mi cuenta',
      description: 'Usa herramientas profesionales y señales de trading'
    },
    {
      id: 'mixto' as Goal,
      icon: Sparkles,
      title: 'Todo lo anterior',
      description: 'Acceso completo a todas las funcionalidades'
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {flowOrigin === 'investor' && (
        <Alert className="bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription>
            Basado en tu perfil de inversionista, confirma tu objetivo principal
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">
          Hola {name}, ¿qué te gustaría hacer?
        </h2>
        <p className="text-muted-foreground">
          {flowOrigin === 'investor' ? 'Confirma tu objetivo principal' : 'Selecciona la opción que más te interese'}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const Icon = g.icon;
          const isSelected = goal === g.id;
          
          return (
            <button
              key={g.id}
              onClick={() => onGoalSelect(g.id)}
              className={cn(
                "group p-8 rounded-2xl border-2 transition-all text-left relative overflow-hidden",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-surface/80"
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-primary opacity-5" />
              )}
              
              <div className="relative z-10">
                <Icon className={cn(
                  "h-12 w-12 mb-4 transition-colors",
                  isSelected ? "text-primary" : "text-primary/70"
                )} />
                
                <h3 className={cn(
                  "text-xl font-semibold mb-2 transition-colors",
                  isSelected ? "text-foreground" : "text-foreground"
                )}>
                  {g.title}
                </h3>
                
                <p className={cn(
                  "text-sm transition-colors",
                  isSelected 
                    ? "text-foreground/80 font-medium"
                    : "text-muted-foreground"
                )}>
                  {g.description}
                </p>
                
                {g.badge && (
                  <div className={cn(
                    "inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium",
                    isSelected
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {g.badge}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Atrás
        </Button>
        
        <Button
          onClick={onContinue}
          disabled={!goal}
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
