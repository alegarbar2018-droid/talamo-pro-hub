import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { getUserProfile, getUserRoles, isUserValidated, type UserProfile, type UserRole, type AuthUser } from '@/lib/auth';

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

  const enrichUserData = async (baseUser: User): Promise<AuthUser> => {
    try {
      const [profile, roles, validated] = await Promise.all([
        getUserProfile(baseUser.id),
        getUserRoles(baseUser.id),
        isUserValidated(baseUser.id),
      ]);

      return {
        ...baseUser,
        profile: profile || undefined,
        roles: roles || [],
        isAffiliated: validated,
      };
    } catch (error) {
      console.error('Error enriching user data:', error);
      return baseUser as AuthUser;
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
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
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
            setUser(session.user as AuthUser);
            setIsValidated(false);
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

    // Check for existing session
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
          setUser(session.user as AuthUser);
          setIsValidated(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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