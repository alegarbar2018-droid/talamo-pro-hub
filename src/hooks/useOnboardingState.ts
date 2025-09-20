import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnboardingStep = "choose" | "validate" | "eligible" | "create-password" | "profile" | "done";

interface WizardState {
  step: OnboardingStep;
  email: string;
  uid: string;
  isDemoMode: boolean;
  isNotAffiliated: boolean;
}

interface ProfileData {
  language: string;
  level: string;
  objective: string;
  riskTolerance: string;
  interests: string[];
}

export const useOnboardingState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStep = searchParams.get("step") as OnboardingStep;
  const initialEmail = searchParams.get("email") || "";
  
  // Always start with "choose" unless we have saved state or explicit URL navigation
  const [step, setStep] = useState<OnboardingStep>("choose");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState<ProfileData>({
    language: "español",
    level: "",
    objective: "",
    riskTolerance: "",
    interests: []
  });
  const [uid, setUid] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isNotAffiliated, setIsNotAffiliated] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [showNewAccountCreated, setShowNewAccountCreated] = useState(false);

  // Load state from localStorage or URL
  useEffect(() => {
    const savedState = localStorage.getItem('talamo.wizard.state');
    
    if (savedState) {
      const parsed: WizardState = JSON.parse(savedState);
      // If there's saved state and it's different from current step, ask user
      if (parsed.step !== "choose") {
        const shouldResume = window.confirm('Tienes un proceso de acceso iniciado. ¿Quieres continuarlo?');
        if (shouldResume) {
          setStep(parsed.step);
          setEmail(parsed.email);
          setUid(parsed.uid);
          setIsDemoMode(parsed.isDemoMode);
          setIsNotAffiliated(parsed.isNotAffiliated || false);
          setSearchParams({ step: parsed.step });
          return;
        } else {
          localStorage.removeItem('talamo.wizard.state');
        }
      }
    }
    
    // If no saved state but URL has a step, use it (direct navigation)
    if (urlStep && urlStep !== "choose") {
      setStep(urlStep);
    } else {
      // Clear URL parameters and start fresh
      setSearchParams({});
    }
    
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [urlStep, initialEmail, setSearchParams]);

  // Save state to localStorage
  const saveWizardState = (newStep: OnboardingStep) => {
    const state: WizardState = {
      step: newStep,
      email,
      uid,
      isDemoMode,
      isNotAffiliated
    };
    localStorage.setItem('talamo.wizard.state', JSON.stringify(state));
  };

  // Update URL when step changes
  useEffect(() => {
    setSearchParams({ step });
    saveWizardState(step);
    console.info(`onboarding_view`, { step });
  }, [step, setSearchParams]);

  const getStepNumber = () => {
    const stepMap = {
      choose: 1,
      validate: 2,
      eligible: 3,
      "create-password": 3,
      profile: 4,
      done: 5
    };
    return stepMap[step];
  };

  const clearWizardState = () => {
    localStorage.removeItem('talamo.wizard.state');
  };

  return {
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
    copiedText,
    showNewAccountCreated,
    
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
    setCopiedText,
    setShowNewAccountCreated,
    
    // Computed
    getStepNumber,
    progress: (getStepNumber() / 5) * 100,
    
    // Actions
    clearWizardState
  };
};