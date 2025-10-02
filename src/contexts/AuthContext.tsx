import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { 
  getUserProfile, 
  getUserRoles, 
  isUserValidated, 
  validateStoredSession, 
  forceCleanSession,
  type UserProfile, 
  type UserRole, 
  type AuthUser 
} from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isValidated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  
  // Circuit breaker state
  const enrichmentFailures = React.useRef(0);
  const MAX_ENRICHMENT_FAILURES = 2;

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Force sign out with local scope to clear all cookies and tokens
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('Supabase signOut successful, cleaning localStorage...');
      
      // Clear ALL localStorage items related to auth and app state
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || 
        ['user', 'isValidated', 'partnerId', 'supabase.auth.token'].includes(key)
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('Cleared localStorage keys:', keysToRemove);
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setIsValidated(false);
      
      console.log('Sign out completed successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      
      // Force clear state even if signOut fails
      setUser(null);
      setSession(null);
      setIsValidated(false);
      
      // Force clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || ['user', 'isValidated', 'partnerId'].includes(key)) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  // Validate token health before enrichment
  const validateTokenHealth = async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('❌ Token validation failed:', error);
        return false;
      }

      // Check if token is about to expire (less than 1 hour left)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const now = Date.now();
      const hoursUntilExpiry = (expiresAt - now) / (1000 * 60 * 60);

      if (hoursUntilExpiry < 1) {
        console.warn('⚠️ Token expires soon, refreshing...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return false;
    }
  };

  const enrichUserData = async (baseUser: User): Promise<AuthUser> => {
    console.log('🔄 Starting user data enrichment with validation...');
    const startTime = Date.now();
    
    // Validate token before attempting queries
    const isTokenHealthy = await validateTokenHealth();
    if (!isTokenHealthy) {
      console.error('❌ Token is not healthy, incrementing failure count');
      enrichmentFailures.current++;
      
      if (enrichmentFailures.current >= MAX_ENRICHMENT_FAILURES) {
        console.error('🚨 Circuit breaker triggered - too many failures');
        handleSignOut();
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      
      throw new Error('Token validation failed');
    }
    
    // Progressive loading: Try to get each piece of data independently
    const profilePromise = getUserProfile(baseUser.id).catch(err => {
      console.warn('⚠️ getUserProfile failed, using defaults:', err);
      enrichmentFailures.current++;
      return null;
    });
    
    const rolesPromise = getUserRoles(baseUser.id).catch(err => {
      console.warn('⚠️ getUserRoles failed, using defaults:', err);
      enrichmentFailures.current++;
      return [];
    });
    
    const validatedPromise = isUserValidated(baseUser.id).catch(err => {
      console.warn('⚠️ isUserValidated failed, using defaults:', err);
      enrichmentFailures.current++;
      return false;
    });

    // Wait for all promises
    const [profile, roles, validated] = await Promise.all([
      profilePromise,
      rolesPromise,
      validatedPromise
    ]);

    // Check circuit breaker after all queries
    if (enrichmentFailures.current >= MAX_ENRICHMENT_FAILURES) {
      console.error('🚨 Circuit breaker triggered - too many enrichment failures');
      handleSignOut();
      throw new Error('Error al cargar datos de usuario. Por favor, inicia sesión nuevamente.');
    }

    // Reset failure counter on success
    if (profile || roles.length > 0) {
      enrichmentFailures.current = 0;
    }

    const duration = Date.now() - startTime;
    console.log(`✅ User data enriched in ${duration}ms`);
    console.log('📊 Data status:', { 
      hasProfile: !!profile, 
      rolesCount: roles?.length || 0, 
      isValidated: validated,
      failures: enrichmentFailures.current
    });

    return {
      ...baseUser,
      profile: profile || undefined,
      roles: roles || [],
      isAffiliated: validated,
    };
  };

  const refreshUser = async () => {
    if (session?.user) {
      setLoading(true);
      try {
        const enrichedUser = await enrichUserData(session.user);
        setUser(enrichedUser);
        setIsValidated(enrichedUser.isAffiliated || false);
      } catch (error) {
        console.error('⚠️ Error refreshing user data (non-fatal):', error);
        // Don't force logout on refresh failure - progressive auth
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // HEALTH CHECK: Validate stored session before proceeding
    console.log('🔍 Starting auth health check...');
    
    const isValid = validateStoredSession();
    
    if (!isValid) {
      console.log('⚠️ Invalid stored session detected - cleaning up');
      forceCleanSession();
      setLoading(false);
      // Don't return - still set up listeners for new sessions
    } else {
      console.log('✅ Stored session validation passed');
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, !!session);
        setSession(session);
        
        if (session?.user) {
          setLoading(true);
          try {
            // Progressive auth: Always set basic user first
            setUser({
              ...session.user,
              profile: undefined,
              roles: [],
              isAffiliated: false,
            });
            
            // Then enrich data in background (non-blocking)
            const enrichedUser = await enrichUserData(session.user);
            setUser(enrichedUser);
            setIsValidated(enrichedUser.isAffiliated || false);
          } catch (error) {
            console.error('⚠️ Error enriching user data (non-fatal):', error);
            // Don't logout on enrichment failure with progressive auth
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setIsValidated(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session only if validation passed
    if (isValid) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        console.log('🔍 Initial session check:', !!session);
        setSession(session);
        
        if (session?.user) {
          setLoading(true);
          try {
            // Progressive auth: Set basic user immediately
            setUser({
              ...session.user,
              profile: undefined,
              roles: [],
              isAffiliated: false,
            });
            
            // Then enrich in background
            const enrichedUser = await enrichUserData(session.user);
            setUser(enrichedUser);
            setIsValidated(enrichedUser.isAffiliated || false);
          } catch (error) {
            console.error('⚠️ Error enriching user data (non-fatal):', error);
            // Don't logout with progressive auth
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
    isValidated,
    signOut: handleSignOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};