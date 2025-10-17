import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { ValidateStep } from '@/components/onboarding/steps/ValidateStep';
import { EligibleStep } from '@/components/onboarding/steps/EligibleStep';
import { WelcomeNameStep } from '@/components/onboarding/steps/WelcomeNameStep';
import { ChooseGoalStep } from '@/components/onboarding/steps/ChooseGoalStep';
import { CapitalExperienceStep } from '@/components/onboarding/steps/CapitalExperienceStep';
import { RecommendationStep } from '@/components/onboarding/steps/RecommendationStep';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';

const OnboardingNew = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flowOrigin = searchParams.get('flow');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const {
    step,
    email,
    password,
    confirmPassword,
    name,
    goal,
    capital,
    experience,
    uid,
    isDemoMode,
    isNotAffiliated,
    showPartnerModal,
    setStep,
    setEmail,
    setPassword,
    setConfirmPassword,
    setName,
    setGoal,
    setCapital,
    setExperience,
    setUid,
    setIsDemoMode,
    setIsNotAffiliated,
    setShowPartnerModal,
    getStepNumber,
    progress
  } = useOnboardingState();

  // Estado del wizard de inversión si viene de ese flujo
  const [wizardState, setWizardState] = useState<any>(null);

  useEffect(() => {
    if (flowOrigin === 'investor') {
      const savedWizardState = sessionStorage.getItem('investor_wizard_state');
      if (savedWizardState) {
        const parsed = JSON.parse(savedWizardState);
        setWizardState(parsed);
        console.info('Loaded investor wizard state:', parsed);
      }
    }
  }, [flowOrigin]);

  const clearErrors = () => {
    setError('');
    setLoading(false);
  };

  const handleValidationSuccess = (receivedUid?: string) => {
    console.info('✅ Validation success, moving to create-password');
    if (receivedUid) setUid(receivedUid);
    setStep('create-password');
    clearErrors();
  };

  const handleNotAffiliated = () => {
    console.info('❌ Not affiliated');
    setIsNotAffiliated(true);
    clearErrors();
  };

  const handleDemoMode = () => {
    console.info('🎮 Demo mode activated');
    setIsDemoMode(true);
    setStep('create-password');
    clearErrors();
  };

  const handleRetryValidation = () => {
    console.info('🔄 Retry validation');
    setIsNotAffiliated(false);
    setIsDemoMode(false);
    clearErrors();
  };

  const handlePasswordSuccess = async () => {
    console.info('✅ Password created, moving to welcome step');
    
    // Si viene del flujo de inversión, pre-cargar datos
    if (flowOrigin === 'investor' && wizardState) {
      const mapInvestmentToBand = (amount: number) => {
        if (amount < 500) return '<500';
        if (amount < 2000) return '500-2000';
        if (amount < 10000) return '2000-10000';
        return '>10000';
      };
      
      setGoal('copiar');
      setCapital(mapInvestmentToBand(wizardState.profile.total_investment));
    }
    
    setStep('welcome');
    clearErrors();
  };

  const handleRestart = () => {
    setIsNotAffiliated(false);
    setIsDemoMode(false);
    setStep('validate-email');
    clearErrors();
  };

  const getContextMessage = () => {
    const referrer = sessionStorage.getItem('onboarding_source');
    
    if (flowOrigin === 'investor') {
      return {
        title: '🎯 Acceso a Copy Trading',
        description: 'Valida tu cuenta Exness para acceder a las estrategias de inversión',
        icon: Sparkles
      };
    }
    
    if (referrer === 'academy') {
      return {
        title: '📚 Acceso a la Academia',
        description: 'Valida tu cuenta para comenzar tu educación en trading',
        icon: Sparkles
      };
    }
    
    if (referrer === 'tools') {
      return {
        title: '🛠️ Acceso a Herramientas',
        description: 'Valida tu cuenta para usar nuestras herramientas profesionales',
        icon: Sparkles
      };
    }
    
    return null;
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
        // Guardar recomendaciones del wizard si existen
        ...(wizardState?.allocations && {
          metadata: {
            investor_recommendations: wizardState.allocations
          }
        })
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await refreshUser();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: '¡Bienvenido a Tálamo!',
        description: 'Tu perfil está listo',
      });
      
      // Redirigir según el goal
      if (flowOrigin === 'investor' || goal === 'copiar') {
        navigate('/copy-trading', {
          state: {
            showWelcome: true,
            recommendedAllocations: wizardState?.allocations
          }
        });
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

  const renderCurrentStep = () => {
    const contextMessage = getContextMessage();
    
    switch (step) {
      case 'validate-email':
        return (
          <div className="space-y-6">
            {contextMessage && (
              <Alert className="bg-primary/5 border-primary/20">
                <contextMessage.icon className="h-4 w-4 text-primary" />
                <AlertDescription>
                  <strong>{contextMessage.title}</strong>
                  <p className="text-sm mt-1">{contextMessage.description}</p>
                </AlertDescription>
              </Alert>
            )}
            
            <ValidateStep
              email={email}
              isNotAffiliated={isNotAffiliated}
              showPartnerModal={showPartnerModal}
              onEmailChange={setEmail}
              onValidationSuccess={handleValidationSuccess}
              onNotAffiliated={handleNotAffiliated}
              onDemoMode={handleDemoMode}
              onRetryValidation={handleRetryValidation}
              onShowPartnerModal={setShowPartnerModal}
            />
          </div>
        );

      case 'create-password':
        return (
          <EligibleStep
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            isDemoMode={isDemoMode}
            uid={uid}
            loading={loading}
            error={error}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onError={setError}
            onLoading={setLoading}
            onSuccess={handlePasswordSuccess}
          />
        );

      case 'welcome':
        return (
          <WelcomeNameStep
            name={name}
            onNameChange={setName}
            onContinue={() => setStep('choose-goal')}
          />
        );

      case 'choose-goal':
        return (
          <ChooseGoalStep
            name={name}
            goal={goal}
            flowOrigin={flowOrigin || undefined}
            onGoalSelect={setGoal}
            onBack={() => setStep('welcome')}
            onContinue={() => setStep('capital-experience')}
          />
        );

      case 'capital-experience':
        return (
          <CapitalExperienceStep
            capital={capital}
            experience={experience}
            onCapitalSelect={setCapital}
            onExperienceSelect={setExperience}
            onBack={() => setStep('choose-goal')}
            onContinue={() => setStep('recommendation')}
          />
        );

      case 'recommendation':
        return (
          <RecommendationStep
            goal={goal!}
            capital={capital!}
            experience={experience!}
            loading={loading}
            onComplete={handleComplete}
          />
        );

      default:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Paso no reconocido</h2>
            <button
              onClick={handleRestart}
              className="text-primary hover:underline"
            >
              Reiniciar proceso
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background">
      <OnboardingHeader 
        stepNumber={getStepNumber()} 
        progress={progress}
      />
      
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default OnboardingNew;
