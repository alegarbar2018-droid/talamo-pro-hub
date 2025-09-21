import { supabase } from '@/integrations/supabase/client';

export type AdminRole = 'ADMIN' | 'ANALYST' | 'CONTENT' | 'SUPPORT' | 'USER';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  role: AdminRole;
  resource: string;
  action: string;
  created_at: string;
}

// Get current admin user role
export async function getCurrentAdminRole(): Promise<AdminRole | null> {
  try {
    console.log('getCurrentAdminRole - Starting query');
    
    const { data: user } = await supabase.auth.getUser();
    console.log('getCurrentAdminRole - Got user:', !!user.user?.id);
    
    if (!user.user?.id) return null;

    console.log('getCurrentAdminRole - Querying admin_users table...');
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.user.id)
      .maybeSingle();

    console.log('getCurrentAdminRole - Query result:', { data, error });

    if (error) {
      console.error('Error getting admin role:', error);
      return null;
    }
    return data?.role || null;
  } catch (error) {
    console.error('Error getting admin role:', error);
    return null;
  }
}

// Check if user has admin permission
export async function hasAdminPermission(resource: string, action: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_admin_permission', {
      _resource: resource,
      _action: action
    });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error checking admin permission:', error);
    return false;
  }
}

// Create admin user
export async function createAdminUser(userId: string, role: AdminRole) {
  const { data, error } = await supabase
    .from('admin_users')
    .insert({ user_id: userId, role })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update admin user role
export async function updateAdminUserRole(userId: string, role: AdminRole) {
  const { data, error } = await supabase
    .from('admin_users')
    .update({ role })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all admin users
export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      *,
      profiles!inner(first_name, last_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Log admin action
export async function logAdminAction(action: string, resource?: string, meta?: any) {
  try {
    const user = await supabase.auth.getUser();
    
    await supabase
      .from('audit_logs')
      .insert({
        actor_id: user.data.user?.id,
        action,
        resource,
        meta
      });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentAdminRole();
  return role === 'ADMIN';
}

// Check if user has any admin role
export async function hasAdminAccess(): Promise<boolean> {
  const role = await getCurrentAdminRole();
  return role !== null && role !== 'USER';
}