import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { ValidateStep } from "@/components/onboarding/steps/ValidateStep";
import { EligibleStep } from "@/components/onboarding/steps/EligibleStep";
import { DoneStep } from "@/components/onboarding/steps/DoneStep";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, GraduationCap, Wrench } from "lucide-react";

const OnboardingNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flowOrigin = searchParams.get('flow'); // 'investor' | null
  
  const {
    // State
    step,
    email,
    password,
    confirmPassword,
    uid,
    isDemoMode,
    isNotAffiliated,
    showPartnerModal,
    
    // Setters
    setStep,
    setEmail,
    setPassword,
    setConfirmPassword,
    setUid,
    setIsDemoMode,
    setIsNotAffiliated,
    setShowPartnerModal,
    
    // Computed
    getStepNumber,
    progress,
    
    // Actions
    resetState
  } = useOnboardingState();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wizardState, setWizardState] = useState<any>(null);

  // Recuperar estado del wizard si viene de copy-info
  useEffect(() => {
    if (flowOrigin === 'investor') {
      const savedState = sessionStorage.getItem('investor_wizard_state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setWizardState(parsed);
        } catch (e) {
          console.error('Error parsing wizard state:', e);
        }
      }
    }
  }, [flowOrigin]);

  // Clear errors when step changes
  const clearErrors = () => {
    setError("");
    setLoading(false);
  };

  // Step handlers
  const handleValidationSuccess = (clientUid?: string) => {
    clearErrors();
    setUid(clientUid || "");
    setIsNotAffiliated(false);
    setIsDemoMode(false);
    setStep("create-account");
  };

  const handleNotAffiliated = () => {
    console.info(`🚫 Setting not affiliated state to true`);
    setIsNotAffiliated(true);
    // Stay on validate step to show options
  };

  const handleDemoMode = () => {
    clearErrors();
    setIsDemoMode(true);
    setIsNotAffiliated(false);
    setStep("create-account");
    toast({
      title: "Modo Demo Activado",
      description: "Acceso temporal sin validación por API",
    });
  };

  const handleRetryValidation = () => {
    clearErrors();
    setIsNotAffiliated(false);
    setShowPartnerModal(false);
    // Stay on validate step for retry
  };

  const handlePasswordSuccess = () => {
    clearErrors();
    if (flowOrigin === 'investor' && wizardState) {
      // Redirigir a onboarding-welcome con datos del wizard
      navigate('/onboarding-welcome?source=copy', {
        state: { wizardData: wizardState }
      });
    } else {
      // Usuario normal va directo a onboarding-welcome para completar perfil
      navigate('/onboarding-welcome');
    }
  };

  const handleRestart = () => {
    resetState();
  };

  // Get context-aware messaging
  const getContextMessage = () => {
    if (flowOrigin === 'investor') {
      return {
        icon: <TrendingUp className="h-4 w-4 text-primary" />,
        title: "Acceso a Copy Trading",
        description: "Para seguir estrategias profesionales, valida tu cuenta Exness y crea tu acceso a Tálamo."
      };
    }
    
    // Detectar desde qué página viene basado en el referrer o sessionStorage
    const lastPage = sessionStorage.getItem('onboarding_source');
    
    if (lastPage === 'academy') {
      return {
        icon: <GraduationCap className="h-4 w-4 text-primary" />,
        title: "Acceso a Academia",
        description: "Valida tu cuenta Exness para acceder a cursos profesionales de trading sin costo."
      };
    }
    
    if (lastPage === 'tools') {
      return {
        icon: <Wrench className="h-4 w-4 text-primary" />,
        title: "Acceso a Herramientas Pro",
        description: "Valida tu cuenta Exness para usar calculadoras, journal y análisis de cuenta."
      };
    }
    
    // Default
    return {
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      title: "Solicitar Acceso a Tálamo",
      description: "Valida tu cuenta Exness para acceder a herramientas profesionales de trading sin membresía."
    };
  };

  const contextMessage = getContextMessage();

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case "validate":
        return (
          <>
            {/* Context Alert */}
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              {contextMessage.icon}
              <AlertTitle className="font-semibold">{contextMessage.title}</AlertTitle>
              <AlertDescription className="text-sm">
                {contextMessage.description}
              </AlertDescription>
            </Alert>

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
              onUserExists={() => {
                // Redirect to login with email pre-filled
                navigate(`/login?email=${encodeURIComponent(email)}`);
              }}
            />
          </>
        );
      
      case "create-account":
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
      
      case "done":
        return (
          <DoneStep
            onClearState={handleRestart}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Paso no reconocido</p>
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
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/50 to-bg">
      {/* Header */}
      <OnboardingHeader 
        stepNumber={getStepNumber()} 
        progress={progress} 
      />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-xl sm:max-w-2xl mx-auto">
          {/* Content Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-primary opacity-20 blur-xl rounded-2xl sm:rounded-3xl" />
            
            {/* Main Card */}
            <div className="relative bg-surface/90 backdrop-blur-xl border border-line rounded-2xl sm:rounded-3xl shadow-shadow-glow-subtle overflow-hidden">
              <div className="p-4 xs:p-6 sm:p-8 lg:p-12">
                {renderCurrentStep()}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 sm:mt-8 text-center px-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plataforma segura y encriptada
              <span className="hidden xs:inline"> • Powered by Exness Partnership</span>
            </p>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Mobile optimized gradients */}
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-glow opacity-30 rounded-full blur-2xl sm:blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-primary opacity-10 rounded-full blur-xl sm:blur-2xl" />
      </div>
    </div>
  );
};

export default OnboardingNew;
