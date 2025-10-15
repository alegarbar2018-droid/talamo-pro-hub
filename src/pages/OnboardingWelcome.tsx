import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Sparkles, TrendingUp, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Goal = 'copiar' | 'aprender' | 'operar' | 'mixto';
type CapitalBand = '<500' | '500-2000' | '2000-10000' | '>10000';
type ExperienceLevel = 'ninguna' | 'basica' | 'intermedia' | 'avanzada';

const OnboardingWelcome = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // User answers
  const [name, setName] = useState(user?.profile?.first_name || '');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [capital, setCapital] = useState<CapitalBand | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Determine recommended account based on experience and capital
      let recommendedAccount = 'Standard Cent';
      let recommendedRoute = goal;
      
      if (experience === 'ninguna' || experience === 'basica') {
        recommendedAccount = 'Standard Cent';
      } else if (experience === 'intermedia') {
        recommendedAccount = capital === '>10000' ? 'Pro' : 'Standard';
      } else if (experience === 'avanzada') {
        recommendedAccount = capital === '>10000' ? 'Zero' : 'Pro';
      }

      const updateData = {
        first_name: name,
        goal,
        capital_band: capital,
        level: experience,
        recommended_account: recommendedAccount,
        recommended_route: recommendedRoute,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Esperar a que se actualice el perfil
      await refreshUser();
      
      // Pequeña espera adicional para asegurar que el perfil se actualizó
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: '¡Bienvenido a Tálamo!',
        description: 'Tu perfil está listo',
      });
      
      // Redirect based on goal
      if (goal === 'copiar') {
        navigate('/copy-trading');
      } else if (goal === 'aprender') {
        navigate('/academy');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar el proceso',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="step0"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 text-center max-w-2xl mx-auto"
          >
            <div className="space-y-4">
              <Sparkles className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold">Bienvenido a Tálamo</h1>
              <p className="text-xl text-muted-foreground">
                Vamos a personalizar tu experiencia en solo 3 pasos
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="¿Cómo te llamas?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-md mx-auto block px-6 py-4 text-lg rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
              />
              
              <Button
                onClick={() => setStep(1)}
                disabled={!name.trim()}
                size="lg"
                className="text-lg px-8"
              >
                Comenzar
              </Button>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Hola {name}, ¿qué te gustaría hacer?</h2>
              <p className="text-muted-foreground">Selecciona la opción que más te interese</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setGoal('copiar');
                  setStep(2);
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Copiar traders exitosos</h3>
                <p className="text-muted-foreground">Invierte automáticamente siguiendo estrategias verificadas</p>
              </button>

              <button
                onClick={() => {
                  setGoal('aprender');
                  setStep(2);
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <GraduationCap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Aprender trading</h3>
                <p className="text-muted-foreground">Domina el trading desde cero con nuestra academia</p>
              </button>

              <button
                onClick={() => {
                  setGoal('operar');
                  setStep(2);
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <TrendingUp className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Operar por mi cuenta</h3>
                <p className="text-muted-foreground">Usa herramientas profesionales y señales de trading</p>
              </button>

              <button
                onClick={() => {
                  setGoal('mixto');
                  setStep(2);
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <Sparkles className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Todo lo anterior</h3>
                <p className="text-muted-foreground">Acceso completo a todas las funcionalidades</p>
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-3xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">¿Con cuánto capital iniciarías?</h2>
              <p className="text-muted-foreground">Esto nos ayuda a recomendarte la cuenta ideal</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setCapital('<500');
                  setStep(3);
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all"
              >
                <div className="text-2xl font-bold mb-2">Menos de $500</div>
                <p className="text-sm text-muted-foreground">Ideal para empezar con micro-lotes</p>
              </button>

              <button
                onClick={() => {
                  setCapital('500-2000');
                  setStep(3);
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all"
              >
                <div className="text-2xl font-bold mb-2">$500 - $2,000</div>
                <p className="text-sm text-muted-foreground">Buen balance para operar</p>
              </button>

              <button
                onClick={() => {
                  setCapital('2000-10000');
                  setStep(3);
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all"
              >
                <div className="text-2xl font-bold mb-2">$2,000 - $10,000</div>
                <p className="text-sm text-muted-foreground">Capital intermedio sólido</p>
              </button>

              <button
                onClick={() => {
                  setCapital('>10000');
                  setStep(3);
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all"
              >
                <div className="text-2xl font-bold mb-2">Más de $10,000</div>
                <p className="text-sm text-muted-foreground">Acceso a cuentas premium</p>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="mx-auto block"
            >
              ← Atrás
            </Button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-3xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">¿Cuál es tu nivel de experiencia?</h2>
              <p className="text-muted-foreground">Último paso para personalizar tu ruta</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setExperience('ninguna');
                  setStep(4);
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Nunca he operado</div>
                <p className="text-sm text-muted-foreground">Quiero aprender desde cero</p>
              </button>

              <button
                onClick={() => {
                  setExperience('basica');
                  setStep(4);
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Experiencia básica</div>
                <p className="text-sm text-muted-foreground">He probado en demo o hecho pocas operaciones reales</p>
              </button>

              <button
                onClick={() => {
                  setExperience('intermedia');
                  setStep(4);
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Experiencia intermedia</div>
                <p className="text-sm text-muted-foreground">Opero regularmente, tengo mi estrategia</p>
              </button>

              <button
                onClick={() => {
                  setExperience('avanzada');
                  setStep(4);
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Experiencia avanzada</div>
                <p className="text-sm text-muted-foreground">Trader consistente con historial verificable</p>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep(2)}
              className="mx-auto block"
            >
              ← Atrás
            </Button>
          </motion.div>
        );

      case 4:
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

        const recommendation = getAccountRecommendation();
        
        return (
          <motion.div
            key="step4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-2xl mx-auto text-center"
          >
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
                      {goal === 'copiar' && 'Explorar estrategias de Copy Trading'}
                      {goal === 'aprender' && 'Comenzar la Academia de Trading'}
                      {goal === 'operar' && 'Acceder a herramientas y señales'}
                      {goal === 'mixto' && 'Explorar todo Tálamo'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleComplete}
              disabled={loading}
              size="lg"
              className="text-lg px-8"
            >
              {loading ? 'Configurando...' : 'Comenzar mi viaje'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setStep(3)}
              disabled={loading}
            >
              ← Atrás
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Progress indicator */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center gap-2">
            {[0, 1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
