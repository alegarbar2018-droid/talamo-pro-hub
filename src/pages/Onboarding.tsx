import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { ChooseStep } from "@/components/onboarding/steps/ChooseStep";
import { ValidateStep } from "@/components/onboarding/steps/ValidateStep";
import { EligibleStep } from "@/components/onboarding/steps/EligibleStep";
import { ProfileStep } from "@/components/onboarding/steps/ProfileStep";
import { DoneStep } from "@/components/onboarding/steps/DoneStep";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp } from "lucide-react";

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
    profile,
    uid,
    isDemoMode,
    isNotAffiliated,
    showPartnerModal,
    
    // Setters
    setStep,
    setEmail,
    setPassword,
    setConfirmPassword,
    setProfile,
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
  const handleChooseCreateAccount = () => {
    console.info('user_chose_create_account');
    // User opens partner link, stays on choose step
  };

  const handleChooseValidateExisting = () => {
    clearErrors();
    setStep("validate");
  };

  const handleValidationSuccess = (clientUid?: string) => {
    clearErrors();
    setUid(clientUid || "");
    setIsNotAffiliated(false);
    setIsDemoMode(false);
    setStep("eligible");
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
    setStep("eligible");
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
      setStep("profile");
    }
  };

  const handleProfileComplete = () => {
    clearErrors();
    setStep("done");
  };

  const handleRestart = () => {
    resetState();
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case "choose":
        return (
          <ChooseStep
            onChooseCreateAccount={handleChooseCreateAccount}
            onChooseValidateExisting={handleChooseValidateExisting}
          />
        );
      
      case "validate":
        return (
          <>
            {flowOrigin === 'investor' && (
              <Alert className="mb-6 bg-primary/5 border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
                <AlertDescription>
                  Para seguir estrategias de copy trading, necesitas validar tu cuenta Exness y crear tu acceso.
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
              onUserExists={() => {
                // Redirect to login with email pre-filled
                navigate(`/login?email=${encodeURIComponent(email)}`);
              }}
            />
          </>
        );
      
      case "eligible":
      case "create-password":
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
      
      case "profile":
        return (
          <ProfileStep
            profile={profile}
            onProfileUpdate={setProfile}
            onComplete={handleProfileComplete}
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