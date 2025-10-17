import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingStep } from './useOnboardingState';
import { v4 as uuidv4 } from 'uuid';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('onboarding_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('onboarding_session_id', sessionId);
  }
  return sessionId;
};

export const useOnboardingAnalytics = (step: OnboardingStep, stepNumber: number) => {
  const stepStartTime = useRef<number>(Date.now());
  const sessionId = getSessionId();

  useEffect(() => {
    // Track step view
    const trackStepView = async () => {
      try {
        await supabase.from('onboarding_analytics').insert({
          session_id: sessionId,
          user_id: (await supabase.auth.getUser()).data.user?.id || null,
          event_type: 'step_view',
          step_name: step,
          step_number: stepNumber,
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_width: window.innerWidth
          }
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackStepView();
    stepStartTime.current = Date.now();

    // Track drop-off on unmount (if user leaves without completing)
    return () => {
      const timeSpent = Date.now() - stepStartTime.current;
      
      if (timeSpent > 1000) {
        supabase.from('onboarding_analytics').insert({
          session_id: sessionId,
          event_type: 'step_exit',
          step_name: step,
          step_number: stepNumber,
          metadata: {
            time_spent_ms: timeSpent,
            timestamp: new Date().toISOString()
          }
        }).then(({ error }) => {
          if (error) console.error('Analytics exit tracking error:', error);
        });
      }
    };
  }, [step, stepNumber, sessionId]);

  const trackStepComplete = async (metadata?: Record<string, any>) => {
    const timeSpent = Date.now() - stepStartTime.current;
    
    try {
      await supabase.from('onboarding_analytics').insert({
        session_id: sessionId,
        user_id: (await supabase.auth.getUser()).data.user?.id || null,
        event_type: 'step_complete',
        step_name: step,
        step_number: stepNumber,
        metadata: {
          time_spent_ms: timeSpent,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackError = async (errorMessage: string, errorCode?: string) => {
    try {
      await supabase.from('onboarding_analytics').insert({
        session_id: sessionId,
        user_id: (await supabase.auth.getUser()).data.user?.id || null,
        event_type: 'error',
        step_name: step,
        step_number: stepNumber,
        metadata: {
          error_message: errorMessage,
          error_code: errorCode,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  return { trackStepComplete, trackError };
};