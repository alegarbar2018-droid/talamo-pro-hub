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

// Profile functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
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
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
  
  return data || [];
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
  const { data, error } = await supabase
    .from('affiliations')
    .select('is_affiliated')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    // Fallback to localStorage for existing users
    return localStorage.getItem("isValidated") === 'true';
  }
  
  return data?.is_affiliated || false;
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

// Session management
export const getCurrentUser = (): User | null => {
  // This will be replaced by the auth context
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};
