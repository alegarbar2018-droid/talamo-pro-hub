import { useCallback } from 'react';
import { OnboardingStep, Goal, CapitalBand, ExperienceLevel } from './useOnboardingState';

interface OnboardingState {
  step?: OnboardingStep;
  email?: string;
  name?: string;
  goal?: Goal;
  capital?: CapitalBand;
  experience?: ExperienceLevel;
  accountStatus?: 'unknown' | 'exists' | 'no-exness' | 'not-affiliated' | 'affiliated';
  lastSaved?: number;
}

const STORAGE_KEY = 'talamo_onboarding_state';
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

export const useOnboardingPersistence = () => {
  const saveState = useCallback((state: Partial<OnboardingState>) => {
    try {
      const existing = sessionStorage.getItem(STORAGE_KEY);
      const current = existing ? JSON.parse(existing) : {};
      const updated = { ...current, ...state, lastSaved: Date.now() };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  }, []);

  const loadState = useCallback((): Partial<OnboardingState> | null => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      const ageInMs = Date.now() - (parsed.lastSaved || 0);

      if (ageInMs > MAX_AGE_MS) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      return null;
    }
  }, []);

  const clearState = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing onboarding state:', error);
    }
  }, []);

  return { saveState, loadState, clearState };
};
