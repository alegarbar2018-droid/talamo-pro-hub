import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnboardingStep = "validate" | "create-password" | "welcome" | "goal" | "capital" | "experience" | "recommendation";

export type Goal = 'copiar' | 'aprender' | 'operar' | 'mixto';
export type CapitalBand = '<500' | '500-2000' | '2000-10000' | '>10000';
export type ExperienceLevel = 'ninguna' | 'basica' | 'intermedia' | 'avanzada';

export const useOnboardingState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL or default to "validate"
  const initialStep = (searchParams.get("step") as OnboardingStep) || "validate";
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

  // Step setter that updates URL
  const setStep = useCallback((newStep: OnboardingStep) => {
    setStepInternal(newStep);
    setSearchParams({ step: newStep });
    console.info(`onboarding_step_change`, { step: newStep });
  }, [setSearchParams]);

  const getStepNumber = () => {
    const stepMap = {
      validate: 1,
      "create-password": 2,
      welcome: 3,
      goal: 4,
      capital: 5,
      experience: 6,
      recommendation: 7
    };
    return stepMap[step];
  };

  // Reset all state
  const resetState = useCallback(() => {
    setStepInternal("validate");
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
    
    // Computed
    getStepNumber,
    progress: (getStepNumber() / 7) * 100,
    
    // Actions
    resetState
  };
};