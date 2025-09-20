import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnboardingStep = "choose" | "validate" | "eligible" | "create-password" | "profile" | "done";

interface ProfileData {
  language: string;
  level: string;
  objective: string;
  riskTolerance: string;
  interests: string[];
}

export const useOnboardingState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL or default to "choose"
  const initialStep = (searchParams.get("step") as OnboardingStep) || "choose";
  const initialEmail = searchParams.get("email") || "";
  
  // State
  const [step, setStepInternal] = useState<OnboardingStep>(initialStep);
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

  // Step setter that updates URL
  const setStep = useCallback((newStep: OnboardingStep) => {
    setStepInternal(newStep);
    setSearchParams({ step: newStep });
    console.info(`onboarding_step_change`, { step: newStep });
  }, [setSearchParams]);

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

  // Reset all state
  const resetState = useCallback(() => {
    setStepInternal("choose");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
    resetState
  };
};