import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  notification_preferences: any;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'trader' | 'partner';
  created_at: string;
}

export interface AuthUser extends User {
  profile?: UserProfile;
  roles?: UserRole[];
  isAffiliated?: boolean;
}

// Error types for better debugging
type QueryErrorType = 'RLS_POLICY_VIOLATION' | 'QUERY_TIMEOUT' | 'NETWORK_ERROR' | 'TOKEN_EXPIRED' | 'UNKNOWN';

const getErrorType = (error: any): QueryErrorType => {
  if (error?.code === '42501' || error?.message?.includes('RLS') || error?.message?.includes('policy')) {
    return 'RLS_POLICY_VIOLATION';
  }
  if (error?.message?.includes('timed out') || error?.message?.includes('timeout')) {
    return 'QUERY_TIMEOUT';
  }
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return 'NETWORK_ERROR';
  }
  if (error?.message?.includes('token') || error?.message?.includes('JWT')) {
    return 'TOKEN_EXPIRED';
  }
  return 'UNKNOWN';
};

// Authentication functions
export const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
  const redirectUrl = `${window.location.origin}/auth/callback`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  // Clear local storage
  localStorage.removeItem("user");
  localStorage.removeItem("isValidated");
  localStorage.removeItem("partnerId");
  
  return { error };
};

export const resetPassword = async (email: string) => {
  const redirectUrl = `${window.location.origin}/auth/reset-password`;
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  
  return { data, error };
};

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  return { data, error };
};

// Utility to wrap promises with timeout (increased to 8s for better reliability)
const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number = 8000
): Promise<T> => {
  const startTime = Date.now();
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timeout after ${timeoutMs}ms`)), timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    const duration = Date.now() - startTime;
    console.log(`✅ Operation completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Operation failed after ${duration}ms:`, error);
    throw error;
  }
};

// Profile functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting getUserProfile for userId: ${userId}`);
  
  try {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        const errorType = getErrorType(error);
        console.error(`[${new Date().toISOString()}] getUserProfile error [${errorType}]:`, error);
        
        if (errorType === 'RLS_POLICY_VIOLATION') {
          console.error('🚨 RLS policy violation detected - session may be corrupted');
          forceCleanSession();
        }
        throw error;
      }
      
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ✅ Profile fetched in ${duration}ms`);
      return data;
    };
    
    return await withTimeout(fetchProfile(), 8000);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorType = getErrorType(error);
    console.error(`[${new Date().toISOString()}] ❌ getUserProfile failed [${errorType}] after ${duration}ms`);
    
    if (errorType === 'RLS_POLICY_VIOLATION') {
      forceCleanSession();
    }
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { data, error };
};

// Role functions
export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting getUserRoles for userId: ${userId}`);
  
  try {
    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        const errorType = getErrorType(error);
        console.error(`[${new Date().toISOString()}] getUserRoles error [${errorType}]:`, error);
        
        if (errorType === 'RLS_POLICY_VIOLATION') {
          console.error('🚨 RLS policy violation detected - session may be corrupted');
          forceCleanSession();
        }
        throw error;
      }
      
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ✅ Roles fetched in ${duration}ms: ${data?.length || 0} roles`);
      return data || [];
    };
    
    return await withTimeout(fetchRoles(), 8000);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorType = getErrorType(error);
    console.error(`[${new Date().toISOString()}] ❌ getUserRoles failed [${errorType}] after ${duration}ms`);
    
    if (errorType === 'RLS_POLICY_VIOLATION') {
      forceCleanSession();
    }
    return [];
  }
};

export const hasRole = async (userId: string, role: 'admin' | 'trader' | 'partner'): Promise<boolean> => {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: role,
  });
  
  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }
  
  return data || false;
};

export const addUserRole = async (userId: string, role: 'admin' | 'trader' | 'partner') => {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select()
    .single();
  
  return { data, error };
};

// Affiliation functions (integration with existing system)
export const isUserValidated = async (userId: string): Promise<boolean> => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting isUserValidated for userId: ${userId}`);
  
  try {
    const checkAffiliation = async () => {
      const { data, error } = await supabase
        .from('affiliations')
        .select('is_affiliated')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        const errorType = getErrorType(error);
        console.error(`[${new Date().toISOString()}] isUserValidated error [${errorType}]:`, error);
        
        if (errorType === 'RLS_POLICY_VIOLATION') {
          console.error('🚨 RLS policy violation detected - session may be corrupted');
          forceCleanSession();
          return false;
        }
        
        // Fallback to localStorage for existing users
        return localStorage.getItem("isValidated") === 'true';
      }
      
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ✅ Validation checked in ${duration}ms: ${data?.is_affiliated || false}`);
      return data?.is_affiliated || false;
    };
    
    return await withTimeout(checkAffiliation(), 8000);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorType = getErrorType(error);
    console.error(`[${new Date().toISOString()}] ❌ isUserValidated failed [${errorType}] after ${duration}ms`);
    
    if (errorType === 'RLS_POLICY_VIOLATION') {
      forceCleanSession();
    }
    return localStorage.getItem("isValidated") === 'true';
  }
};

export const setUserValidation = async (userId: string, validated: boolean, partnerId?: string) => {
  // Update in Supabase
  const { error } = await supabase
    .from('affiliations')
    .upsert({
      user_id: userId,
      is_affiliated: validated,
      partner_id: partnerId || "1141465940423171000",
      verified_at: validated ? new Date().toISOString() : null,
    });
  
  if (error) {
    console.error('Error updating affiliation:', error);
  }
  
  // Keep localStorage for compatibility
  localStorage.setItem("isValidated", validated.toString());
  if (validated) {
    localStorage.setItem("partnerId", partnerId || "1141465940423171000");
  }
};

// Session validation and cleanup
export const validateStoredSession = (): boolean => {
  try {
    const keys = Object.keys(localStorage);
    const authKeys = keys.filter(key => key.startsWith('sb-'));
    
    if (authKeys.length === 0) return true; // No session stored
    
    // Try to parse the auth token
    const tokenKey = authKeys.find(key => key.includes('auth-token'));
    if (!tokenKey) return true;
    
    const tokenData = localStorage.getItem(tokenKey);
    if (!tokenData) return true;
    
    try {
      const parsed = JSON.parse(tokenData);
      
      // Check if token is expired
      if (parsed.expires_at) {
        const expiresAt = new Date(parsed.expires_at * 1000);
        if (expiresAt < new Date()) {
          console.log('Stored token is expired');
          return false;
        }
      }
      
      return true;
    } catch (e) {
      console.error('Failed to parse auth token:', e);
      return false;
    }
  } catch (error) {
    console.error('Error validating stored session:', error);
    return false;
  }
};

export const forceCleanSession = () => {
  console.log('🔥 Force cleaning all session data...');
  
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.startsWith('sb-') || 
    ['user', 'isValidated', 'partnerId', 'supabase.auth.token'].includes(key)
  );
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log('Cleaned keys:', keysToRemove);
};

// Session management
export const getCurrentUser = (): User | null => {
  // This will be replaced by the auth context
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};
