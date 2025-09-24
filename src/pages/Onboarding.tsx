import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { ChooseStep } from "@/components/onboarding/steps/ChooseStep";
import { ValidateStep } from "@/components/onboarding/steps/ValidateStep";
import { EligibleStep } from "@/components/onboarding/steps/EligibleStep";
import { ProfileStep } from "@/components/onboarding/steps/ProfileStep";
import { DoneStep } from "@/components/onboarding/steps/DoneStep";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles, Crown } from "lucide-react";

const OnboardingNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    setStep("profile");
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
          <div className="text-center">
            <p className="text-muted-foreground">Paso no reconocido</p>
            <button onClick={handleRestart} className="text-primary underline mt-2">
              Reiniciar proceso
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-surface relative overflow-x-hidden">
      {/* Header */}
      <OnboardingHeader 
        stepNumber={getStepNumber()} 
        progress={progress} 
      />

      {/* Value Proposition Banner - Mobile Optimized */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20 border-b border-green-200/50 dark:border-green-800/30">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-surface/50 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground">Sin Costos Ocultos</h3>
                  <p className="text-xs text-muted-foreground">100% gratuito para siempre</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-surface/50 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground">Herramientas Premium</h3>
                  <p className="text-xs text-muted-foreground">Acceso completo incluido</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-surface/50 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                  <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground">Soporte Exness</h3>
                  <p className="text-xs text-muted-foreground">Partnership oficial</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
              Financiado por nuestro partnership con Exness. Sin comisiones ni suscripciones mensuales.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Content Card */}
          <div className="relative">
            {/* Premium Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-75" />
            
            <div className="relative bg-surface/80 backdrop-blur-xl border border-line/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Premium Top Border */}
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              
              <div className="p-6 sm:p-8 lg:p-12">
                {renderCurrentStep()}
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Seguro & Encriptado</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Verificación Automática</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                <span>Setup en 2 minutos</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Tu información está protegida con encriptación de nivel bancario. 
              Solo validamos tu elegibilidad, no almacenamos datos sensibles.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Primary Gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/8 via-transparent to-accent/8 rounded-full blur-3xl" />
        
        {/* Mobile Optimized Decorations */}
        <div className="absolute top-1/3 -right-24 w-48 h-48 bg-gradient-to-l from-accent/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 -left-24 w-48 h-48 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]" />
      </div>
    </div>
  );
};

export default OnboardingNew;