/**
 * ObservabilityProvider Component
 * 
 * Provides observability context and instrumentation for React components.
 * Includes performance monitoring, user interaction tracking, and business metrics.
 */
import React, { createContext, useContext, useCallback, useRef } from 'react';
import { logger, performanceMonitor } from '@/lib/observability';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { isFeatureEnabled } from '@/lib/flags';

interface ObservabilityContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string, properties?: Record<string, any>) => void;
  trackInteraction: (element: string, action: string, properties?: Record<string, any>) => void;
  trackBusinessEvent: (event: BusinessEventType, properties?: Record<string, any>) => void;
  measurePerformance: <T>(key: string, fn: () => Promise<T> | T) => Promise<T>;
  startTimer: (key: string) => () => number;
}

type BusinessEventType = 
  | 'affiliation_check'
  | 'access_completed'  
  | 'user_signup'
  | 'login'
  | 'course_started'
  | 'signal_viewed'
  | 'copy_strategy_followed'
  | 'tool_used'
  | 'admin_dashboard_viewed';

const ObservabilityContext = createContext<ObservabilityContextType | null>(null);

interface ObservabilityProviderProps {
  children: React.ReactNode;
}

export const ObservabilityProvider: React.FC<ObservabilityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const sessionId = useRef(crypto.randomUUID());
  const correlationId = useRef(crypto.randomUUID());

  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    if (!isFeatureEnabled('obs_v1')) return;

    const eventData = {
      event_type: event,
      user_id: user?.id,
      session_id: sessionId.current,
      correlation_id: correlationId.current,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      user_agent: navigator.userAgent,
      properties: properties || {}
    };

    logger.info(`User Event: ${event}`, {
      metadata: { 
        event_type: event, 
        properties: eventData.properties,
        user_id: user?.id,
        session_id: sessionId.current
      }
    });

    // Track in local storage for offline capability
    const events = JSON.parse(localStorage.getItem('obs_events') || '[]');
    events.push(eventData);
    localStorage.setItem('obs_events', JSON.stringify(events.slice(-100))); // Keep last 100
  }, [user?.id]);

  const trackPageView = useCallback((page: string, properties?: Record<string, any>) => {
    trackEvent('page_view', {
      page,
      referrer: document.referrer,
      ...properties
    });

    // Track page load performance
    if (performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        logger.metric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms', {
          page,
          navigation_type: navigation.type.toString()
        });
      }
    }
  }, [trackEvent]);

  const trackInteraction = useCallback((element: string, action: string, properties?: Record<string, any>) => {
    trackEvent('user_interaction', {
      element,
      action,
      ...properties
    });
  }, [trackEvent]);

  const trackBusinessEvent = useCallback(async (event: BusinessEventType, properties?: Record<string, any>) => {
    if (!isFeatureEnabled('obs_v1')) return;

    try {
      // Send to business metrics edge function
      const response = await supabase.functions.invoke('business-metrics', {
        body: {
          action: 'track',
          event: {
            type: event,
            user_id: user?.id,
            properties: {
              session_id: sessionId.current,
              correlation_id: correlationId.current,
              url: window.location.pathname,
              timestamp: new Date().toISOString(),
              ...properties
            }
          }
        }
      });

      if (response.error) {
        logger.error('Failed to track business event', response.error);
      }

      logger.info(`Business Event: ${event}`, {
        metadata: { 
          event_type: event, 
          user_id: user?.id,
          properties 
        }
      });
    } catch (error) {
      logger.error('Error tracking business event', error as Error, {
        metadata: { 
          event_type: event,
          user_id: user?.id
        }
      });
    }
  }, [user?.id]);

  const measurePerformance = useCallback(async <T,>(key: string, fn: () => Promise<T> | T): Promise<T> => {
    if (!isFeatureEnabled('obs_v1')) {
      const result = await fn();
      return result;
    }

    return performanceMonitor.measure(key, async () => {
      const result = await fn();
      return result;
    });
  }, []);

  const startTimer = useCallback((key: string) => {
    performanceMonitor.start(key);
    
    return () => {
      const duration = performanceMonitor.end(key);
      return duration;
    };
  }, []);

  const contextValue: ObservabilityContextType = {
    trackEvent,
    trackPageView,
    trackInteraction,
    trackBusinessEvent,
    measurePerformance,
    startTimer
  };

  return (
    <ObservabilityContext.Provider value={contextValue}>
      {children}
    </ObservabilityContext.Provider>
  );
};

export const useObservability = (): ObservabilityContextType => {
  const context = useContext(ObservabilityContext);
  if (!context) {
    throw new Error('useObservability must be used within an ObservabilityProvider');
  }
  return context;
};

/**
 * Higher-order component for automatic page tracking
 */
export const withPageTracking = <P extends object>(
  Component: React.ComponentType<P>,
  pageName: string
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { trackPageView } = useObservability();
    
    React.useEffect(() => {
      trackPageView(pageName);
    }, [trackPageView]);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPageTracking(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Hook for tracking component mount/unmount performance
 */
export const useComponentPerformance = (componentName: string) => {
  const { startTimer } = useObservability();
  
  React.useEffect(() => {
    const endTimer = startTimer(`component.${componentName}.mount`);
    
    return () => {
      endTimer();
    };
  }, [componentName, startTimer]);
};

export default ObservabilityProvider;