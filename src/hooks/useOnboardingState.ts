import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnboardingStep = 
  | "validate-email" 
  | "create-password" 
  | "welcome" 
  | "choose-goal" 
  | "capital-experience" 
  | "recommendation";

export type Goal = 'copiar' | 'aprender' | 'operar' | 'mixto';
export type CapitalBand = '<500' | '500-2000' | '2000-10000' | '>10000';
export type ExperienceLevel = 'ninguna' | 'basica' | 'intermedia' | 'avanzada';

interface ProfileData {
  language: string;
  level: string;
  objective: string;
  riskTolerance: string;
  interests: string[];
}

export const useOnboardingState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL or default to "validate-email"
  const initialStep = (searchParams.get("step") as OnboardingStep) || "validate-email";
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

  // Step setter that updates URL
  const setStep = useCallback((newStep: OnboardingStep) => {
    setStepInternal(newStep);
    setSearchParams({ step: newStep });
    console.info(`onboarding_step_change`, { step: newStep });
  }, [setSearchParams]);

  const getStepNumber = () => {
    const stepMap = {
      "validate-email": 1,
      "create-password": 2,
      "welcome": 3,
      "choose-goal": 4,
      "capital-experience": 5,
      "recommendation": 6
    };
    return stepMap[step];
  };

  // Reset all state
  const resetState = useCallback(() => {
    setStepInternal("validate-email");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setGoal(null);
    setCapital(null);
    setExperience(null);
    setProfile({
      language: "español",
      level: "",
      objective: "",
      riskTolerance: "",
      interests: []
    });
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
    setName,
    setGoal,
    setCapital,
    setExperience,
    setProfile,
    setUid,
    setIsDemoMode,
    setIsNotAffiliated,
    setShowPartnerModal,
    setCopiedText,
    setShowNewAccountCreated,
    
    // Computed
    getStepNumber,
    progress: (getStepNumber() / 6) * 100,
    
    // Actions
    resetState
  };
};