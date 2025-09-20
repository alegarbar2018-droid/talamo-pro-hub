import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { ChooseStep } from "@/components/onboarding/steps/ChooseStep";
import { ValidateStep } from "@/components/onboarding/steps/ValidateStep";
import { EligibleStep } from "@/components/onboarding/steps/EligibleStep";
import { ProfileStep } from "@/components/onboarding/steps/ProfileStep";
import { DoneStep } from "@/components/onboarding/steps/DoneStep";

const OnboardingNew = () => {
  const { toast } = useToast();
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
    clearWizardState
  } = useOnboardingState();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step handlers
  const handleChooseCreateAccount = () => {
    // Just log the action, user will come back to validate after creating account
    console.info('user_chose_create_account');
  };

  const handleChooseValidateExisting = () => {
    setStep("validate");
  };

  const handleValidationSuccess = (clientUid?: string) => {
    setUid(clientUid || "");
    setIsNotAffiliated(false);
    setStep("eligible");
  };

  const handleNotAffiliated = () => {
    setIsNotAffiliated(true);
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
    setStep("eligible");
    toast({
      title: "Modo Demo Activado",
      description: "Acceso temporal sin validación por API",
    });
  };

  const handleRetryValidation = () => {
    setError("");
    setIsNotAffiliated(false);
  };

  const handlePasswordSuccess = () => {
    setStep("profile");
  };

  const handleProfileComplete = () => {
    setStep("done");
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
            onClearState={clearWizardState}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <OnboardingHeader 
        stepNumber={getStepNumber()} 
        progress={progress} 
      />

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default OnboardingNew;