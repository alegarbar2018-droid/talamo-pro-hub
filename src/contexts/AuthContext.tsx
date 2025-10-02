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

  const enrichUserData = async (baseUser: User): Promise<AuthUser> => {
    try {
      console.log('⏳ Enriching user data with 5s timeout...');
      
      // Add overall timeout for enrichment process
      const enrichmentPromise = Promise.all([
        getUserProfile(baseUser.id),
        getUserRoles(baseUser.id),
        isUserValidated(baseUser.id),
      ]);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Enrichment timeout after 5s')), 5000);
      });
      
      const [profile, roles, validated] = await Promise.race([
        enrichmentPromise,
        timeoutPromise
      ]);

      console.log('✅ User data enriched successfully');
      return {
        ...baseUser,
        profile: profile || undefined,
        roles: roles || [],
        isAffiliated: validated,
      };
    } catch (error) {
      console.error('❌ Error enriching user data:', error);
      
      // Don't call handleSignOut here to avoid infinite loops
      // Just throw the error and let the caller handle cleanup
      throw new Error('Session corrupta detectada. Por favor inicia sesión nuevamente.');
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      setLoading(true);
      try {
        const enrichedUser = await enrichUserData(session.user);
        setUser(enrichedUser);
        setIsValidated(enrichedUser.isAffiliated || false);
      } catch (error) {
        console.error('Error refreshing user data:', error);
        // Force logout on refresh failure
        await handleSignOut();
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
        console.log('Auth state change:', event, !!session);
        setSession(session);
        
        if (session?.user) {
          setLoading(true);
          try {
            const enrichedUser = await enrichUserData(session.user);
            setUser(enrichedUser);
            setIsValidated(enrichedUser.isAffiliated || false);
          } catch (error) {
            console.error('Error enriching user data:', error);
            // Clear state and force sign out on enrichment failure
            setUser(null);
            setIsValidated(false);
            forceCleanSession();
            await supabase.auth.signOut({ scope: 'local' });
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
        console.log('Initial session check:', !!session);
        setSession(session);
        
        if (session?.user) {
          setLoading(true);
          try {
            const enrichedUser = await enrichUserData(session.user);
            setUser(enrichedUser);
            setIsValidated(enrichedUser.isAffiliated || false);
          } catch (error) {
            console.error('Error enriching user data:', error);
            // Clear state and force sign out on enrichment failure
            setUser(null);
            setIsValidated(false);
            forceCleanSession();
            await supabase.auth.signOut({ scope: 'local' });
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