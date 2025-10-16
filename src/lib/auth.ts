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
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
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
  
  // Clear local storage including cache
  localStorage.removeItem("user");
  localStorage.removeItem("isValidated");
  localStorage.removeItem("partnerId");
  localStorage.removeItem(CACHE_KEYS.PROFILE);
  localStorage.removeItem(CACHE_KEYS.ROLES);
  localStorage.removeItem(CACHE_KEYS.VALIDATION);
  
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

// Cache keys
const CACHE_KEYS = {
  PROFILE: 'user_profile_cache',
  ROLES: 'user_roles_cache',
  VALIDATION: 'user_validation_cache',
};

// Cache utilities
const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

const getCache = <T>(key: string, maxAgeMs: number = 5 * 60 * 1000): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age > maxAgeMs) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data as T;
  } catch (error) {
    return null;
  }
};

// Utility to wrap promises with timeout (reduced to 3s for faster feedback)
const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number = 3000
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
  console.log(`📥 Fetching profile for user ${userId}...`);
  
  // Try to get from cache first
  const cached = getCache<UserProfile>(CACHE_KEYS.PROFILE);
  if (cached) {
    console.log('✅ Profile loaded from cache');
    // Revalidate in background
    fetchProfileInBackground(userId);
    return cached;
  }
  
  try {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      console.log('✅ Profile fetched successfully');
      
      // Cache the result
      if (data) {
        setCache(CACHE_KEYS.PROFILE, data);
      }
      
      return data;
    };
    
    return await withTimeout(fetchProfile(), 3000);
  } catch (error) {
    console.error('❌ getUserProfile failed:', error);
    // Return cached data as fallback even if expired
    return getCache<UserProfile>(CACHE_KEYS.PROFILE, Infinity);
  }
};

// Background fetch to update cache
const fetchProfileInBackground = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data) {
      setCache(CACHE_KEYS.PROFILE, data);
    }
  } catch (error) {
    // Silently fail background updates
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
  console.log(`📥 Fetching roles for user ${userId}...`);
  
  // Try to get from cache first
  const cached = getCache<UserRole[]>(CACHE_KEYS.ROLES);
  if (cached) {
    console.log('✅ Roles loaded from cache');
    // Revalidate in background
    fetchRolesInBackground(userId);
    return cached;
  }
  
  try {
    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      console.log(`✅ Roles fetched: ${data?.length || 0} roles`);
      
      // Cache the result
      const roles = data || [];
      setCache(CACHE_KEYS.ROLES, roles);
      
      return roles;
    };
    
    return await withTimeout(fetchRoles(), 3000);
  } catch (error) {
    console.error('❌ getUserRoles failed:', error);
    // Return cached data as fallback even if expired
    return getCache<UserRole[]>(CACHE_KEYS.ROLES, Infinity) || [];
  }
};

// Background fetch to update cache
const fetchRolesInBackground = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (data) {
      setCache(CACHE_KEYS.ROLES, data);
    }
  } catch (error) {
    // Silently fail background updates
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
  console.log(`📥 Checking validation for user ${userId}...`);
  
  // Try to get from cache first
  const cached = getCache<boolean>(CACHE_KEYS.VALIDATION);
  if (cached !== null) {
    console.log('✅ Validation loaded from cache');
    // Revalidate in background
    fetchValidationInBackground(userId);
    return cached;
  }
  
  try {
    const checkAffiliation = async () => {
      const { data, error } = await supabase
        .from('affiliations')
        .select('is_affiliated')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error checking affiliation:', error);
        // Fallback to localStorage for existing users
        return localStorage.getItem("isValidated") === 'true';
      }
      
      const isValidated = data?.is_affiliated || false;
      console.log(`✅ Validation checked: ${isValidated}`);
      
      // Cache the result
      setCache(CACHE_KEYS.VALIDATION, isValidated);
      
      return isValidated;
    };
    
    return await withTimeout(checkAffiliation(), 3000);
  } catch (error) {
    console.error('❌ isUserValidated failed:', error);
    // Return cached data as fallback
    const cachedValidation = getCache<boolean>(CACHE_KEYS.VALIDATION, Infinity);
    if (cachedValidation !== null) return cachedValidation;
    return localStorage.getItem("isValidated") === 'true';
  }
};

// Background fetch to update cache
const fetchValidationInBackground = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('affiliations')
      .select('is_affiliated')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data !== null) {
      setCache(CACHE_KEYS.VALIDATION, data.is_affiliated || false);
    }
  } catch (error) {
    // Silently fail background updates
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
