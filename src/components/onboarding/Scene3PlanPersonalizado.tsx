import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';
import { OnboardingProfile, ExperienceAnswers, calculateLevel, buildRecommendation } from '@/lib/onboarding-engine';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Scene3PlanPersonalizadoProps {
  profile: Partial<OnboardingProfile>;
  experienceAnswers: ExperienceAnswers;
  onComplete: () => void;
  onBack: () => void;
  loading: boolean;
}

export const Scene3PlanPersonalizado: React.FC<Scene3PlanPersonalizadoProps> = ({
  profile,
  experienceAnswers,
  onComplete,
  onBack,
  loading
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  
  const level = calculateLevel(experienceAnswers);
  const recommendation = buildRecommendation(profile as OnboardingProfile, level);
  
  const levelLabels = {
    nuevo: 'Nuevo',
    en_marcha: 'En marcha',
    con_experiencia: 'Con experiencia',
    avanzado: 'Avanzado'
  };
  
  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };
  
  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center px-4 py-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.3}
        />
      )}
      
      <div className="max-w-2xl w-full space-y-6">
        {/* Header con nivel detectado */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Nivel detectado: {levelLabels[level]}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold">Tu plan personalizado está listo</h1>
          <p className="text-muted-foreground">
            Hola {profile.first_name}, basándonos en tus respuestas, hemos diseñado un plan ideal para ti
          </p>
        </div>
        
        {/* Tu ruta sugerida */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tu ruta sugerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary mb-2">{recommendation.route}</p>
            <p className="text-muted-foreground">
              Este camino se adapta perfectamente a tu perfil y objetivos
            </p>
          </CardContent>
        </Card>
        
        {/* Tu cuenta recomendada */}
        <Card>
          <CardHeader>
            <CardTitle>Tu cuenta recomendada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
              <p className="text-sm text-muted-foreground">Cuenta principal</p>
              <p className="text-2xl font-bold">{recommendation.primaryAccount}</p>
              {recommendation.secondaryAccount && (
                <p className="text-sm text-muted-foreground mt-2">
                  También recomendamos: {recommendation.secondaryAccount}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Por qué te conviene esta cuenta:</p>
              <ul className="space-y-2">
                {recommendation.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Tus próximos pasos */}
        <Card>
          <CardHeader>
            <CardTitle>Tus próximos pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">Completar onboarding inicial</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full border-2 border-muted" />
                <span className="text-sm text-muted-foreground">Crear tu cuenta de trading</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full border-2 border-muted" />
                <span className="text-sm text-muted-foreground">Explorar la plataforma</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full border-2 border-muted" />
                <span className="text-sm text-muted-foreground">Comenzar tu primera lección</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Nota del mentor */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground italic">
            "Este plan es solo el inicio. Lo iremos ajustando contigo a medida que avances en tu camino."
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Atrás
          </Button>
          
          <Button
            onClick={handleComplete}
            disabled={loading}
            className="flex-1"
            size="lg"
          >
            {loading ? 'Guardando...' : 'Seguir con mi plan'}
          </Button>
        </div>
      </div>
    </div>
  );
};
