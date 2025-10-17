import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Goal, CapitalBand, ExperienceLevel } from '@/hooks/useOnboardingState';

interface RecommendationStepProps {
  goal: Goal;
  capital: CapitalBand;
  experience: ExperienceLevel;
  loading: boolean;
  onComplete: () => void;
}

export const RecommendationStep: React.FC<RecommendationStepProps> = ({
  goal,
  capital,
  experience,
  loading,
  onComplete
}) => {
  const getAccountRecommendation = () => {
    if (experience === 'ninguna' || experience === 'basica') {
      return {
        account: 'Standard Cent',
        reason: 'Perfecta para principiantes. Opera con micro-lotes ($1 = 100 centavos) y practica sin riesgo alto.'
      };
    } else if (experience === 'intermedia') {
      return {
        account: capital === '>10000' ? 'Pro' : 'Standard',
        reason: capital === '>10000' 
          ? 'Cuenta Pro: spreads desde 0.1 pips, ideal para tu capital y experiencia.'
          : 'Cuenta Standard: spreads competitivos y condiciones balanceadas para traders intermedios.'
      };
    } else {
      return {
        account: capital === '>10000' ? 'Zero' : 'Pro',
        reason: capital === '>10000'
          ? 'Cuenta Zero: spreads de 0.0 pips en pares principales, perfecta para scalping y alta frecuencia.'
          : 'Cuenta Pro: condiciones profesionales con spreads reducidos.'
      };
    }
  };

  const getNextStepMessage = () => {
    if (goal === 'copiar') {
      return 'Acceder a Copy Trading';
    } else if (goal === 'aprender') {
      return 'Ir a la Academia';
    } else {
      return 'Ir al Dashboard';
    }
  };

  const recommendation = getAccountRecommendation();

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
      <Sparkles className="h-16 w-16 mx-auto text-primary" />
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">¡Tu plan está listo!</h2>
        
        <div className="relative p-8 rounded-2xl bg-card border border-border shadow-lg">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Recomendación personalizada</span>
              </div>
              <h3 className="text-2xl font-bold text-primary">
                {recommendation.account}
              </h3>
            </div>
            
            <p className="text-base leading-relaxed text-foreground/80">
              {recommendation.reason}
            </p>
            
            <div className="pt-6 border-t border-border/50 space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Tu siguiente paso
              </div>
              <div className="text-lg font-semibold text-foreground">
                {getNextStepMessage()}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          disabled={loading}
          size="lg"
          className="text-lg px-8"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Guardando...</span>
            </div>
          ) : (
            <>
              Comenzar mi viaje
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
