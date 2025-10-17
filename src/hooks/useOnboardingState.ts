import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnboardingStep = 
  | "intro"
  | "email-capture"
  | "user-exists"
  | "no-exness-account"
  | "exness-detection"
  | "has-exness-flow"
  | "no-exness-flow"
  | "create-password"
  | "welcome"
  | "goal"
  | "capital"
  | "experience"
  | "recommendation";

export type Goal = 'copiar' | 'aprender' | 'operar' | 'mixto';
export type CapitalBand = '<500' | '500-2000' | '2000-10000' | '>10000';
export type ExperienceLevel = 'ninguna' | 'basica' | 'intermedia' | 'avanzada';

export const useOnboardingState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL or default to "intro"
  const initialStep = (searchParams.get("step") as OnboardingStep) || "intro";
  const initialEmail = searchParams.get("email") || "";
  
  // State
  const [step, setStepInternal] = useState<OnboardingStep>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [capital, setCapital] = useState<CapitalBand | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [uid, setUid] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isNotAffiliated, setIsNotAffiliated] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [showNewAccountCreated, setShowNewAccountCreated] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'unknown' | 'exists' | 'no-exness' | 'not-affiliated' | 'affiliated'>('unknown');

  // Step setter that updates URL
  const setStep = useCallback((newStep: OnboardingStep) => {
    setStepInternal(newStep);
    setSearchParams({ step: newStep });
    console.info(`onboarding_step_change`, { step: newStep });
  }, [setSearchParams]);

  // Navigate to previous step
  const goBack = useCallback(() => {
    const backMap: Partial<Record<OnboardingStep, OnboardingStep>> = {
      "email-capture": "intro",
      "create-password": "email-capture",
      "welcome": "create-password",
      "goal": "welcome",
      "capital": "goal",
      "experience": "capital",
      "recommendation": "experience"
    };
    
    const previousStep = backMap[step];
    if (previousStep) {
      setStep(previousStep);
    }
  }, [step, setStep]);

  const canGoBack = () => {
    return step !== "intro" && 
           step !== "user-exists" && 
           step !== "no-exness-account" &&
           step !== "exness-detection" &&
           step !== "has-exness-flow" &&
           step !== "no-exness-flow";
  };

  const getStepNumber = () => {
    const stepMap: Record<OnboardingStep, number> = {
      "intro": 1,
      "email-capture": 2,
      "user-exists": 2,
      "no-exness-account": 3,
      "exness-detection": 3,
      "has-exness-flow": 3,
      "no-exness-flow": 3,
      "create-password": 4,
      "welcome": 5,
      "goal": 6,
      "capital": 7,
      "experience": 8,
      "recommendation": 9
    };
    return stepMap[step] || 1;
  };

  // Reset all state
  const resetState = useCallback(() => {
    setStepInternal("intro");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setGoal(null);
    setCapital(null);
    setExperience(null);
    setUid("");
    setIsDemoMode(false);
    setIsNotAffiliated(false);
    setShowPartnerModal(false);
    setCopiedText("");
    setShowNewAccountCreated(false);
    setAccountStatus('unknown');
    setSearchParams({});
  }, [setSearchParams]);

  return {
    // State
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
    copiedText,
    showNewAccountCreated,
    accountStatus,
    
    // Setters
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
    setCopiedText,
    setShowNewAccountCreated,
    setAccountStatus,
    
    // Computed
    getStepNumber,
    progress: (getStepNumber() / 9) * 100,
    
    // Actions
    resetState,
    goBack,
    canGoBack: canGoBack()
  };
};