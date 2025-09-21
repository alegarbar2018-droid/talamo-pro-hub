/**
 * Production RBAC System for Tálamo Admin Back Office
 * Implements granular permissions with scope-based access control
 */
import { supabase } from '@/integrations/supabase/client';

export type AdminRole = 
  | 'ADMIN'
  | 'CONTENT' 
  | 'SUPPORT'
  | 'ANALYST'
  | 'USER';

export type Permission = {
  resource: string;
  action: string;
  scope?: string[];
};

export type ActionRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Comprehensive RBAC Matrix
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  ADMIN: [
    { resource: '*', action: '*' },
  ],
  CONTENT: [
    { resource: 'courses', action: '*' },
    { resource: 'lessons', action: '*' },
    { resource: 'assessments', action: '*' },
    { resource: 'questions', action: '*' },
  ],
  SUPPORT: [
    { resource: 'tickets', action: '*' },
    { resource: 'users', action: 'read', scope: ['masked'] },
    { resource: 'users', action: 'suspend' },
  ],
  ANALYST: [
    { resource: 'metrics', action: 'read' },
    { resource: 'metrics', action: 'export' },
    { resource: 'reports', action: '*' },
    { resource: 'users', action: 'read', scope: ['masked'] },
  ],
  USER: [
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
};

// Action Risk Assessment
export const ACTION_RISKS: Record<string, ActionRisk> = {
  'users.impersonate': 'CRITICAL',
  'users.delete': 'CRITICAL',
  'tournaments.settle': 'CRITICAL',
  'prizes.settle': 'CRITICAL',
  'prizes.reverse': 'CRITICAL',
  'roles.assign': 'HIGH',
  'users.suspend': 'HIGH',
  'courses.publish': 'HIGH',
  'signals.approve': 'MEDIUM',
  'tickets.escalate': 'MEDIUM',
  'users.read': 'LOW',
  'metrics.export': 'LOW',
};

export interface SecurityContext {
  requiresMFA: boolean;
  requiresReason: boolean;
  requiresDualApproval: boolean;
  sessionTimeout?: number;
}

export function getSecurityContext(action: string): SecurityContext {
  const risk = ACTION_RISKS[action] || 'LOW';
  
  switch (risk) {
    case 'CRITICAL':
      return {
        requiresMFA: true,
        requiresReason: true,
        requiresDualApproval: true,
        sessionTimeout: 15 * 60 * 1000, // 15 minutes
      };
    case 'HIGH':
      return {
        requiresMFA: true,
        requiresReason: true,
        requiresDualApproval: false,
      };
    case 'MEDIUM':
      return {
        requiresMFA: false,
        requiresReason: true,
        requiresDualApproval: false,
      };
    default:
      return {
        requiresMFA: false,
        requiresReason: false,
        requiresDualApproval: false,
      };
  }
}

export async function checkPermission(
  resource: string, 
  action: string,
  userId?: string
): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    const targetUserId = userId || user.user?.id;
    
    if (!targetUserId) return false;

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', targetUserId)
      .single();

    if (!adminUser) return false;

    const permissions = ROLE_PERMISSIONS[adminUser.role as AdminRole];
    if (!permissions) return false;

    // Check for wildcard permissions (SUPERADMIN)
    if (permissions.some(p => p.resource === '*' && p.action === '*')) {
      return true;
    }

    // Check specific permissions
    return permissions.some(p => 
      (p.resource === resource || p.resource === '*') &&
      (p.action === action || p.action === '*')
    );
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

export async function getEffectivePermissions(userId: string): Promise<Permission[]> {
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (!adminUser) return [];
  
  return ROLE_PERMISSIONS[adminUser.role as AdminRole] || [];
}

export async function validateRoleAssignment(
  targetUserId: string,
  newRole: AdminRole,
  assignerUserId: string
): Promise<{ valid: boolean; reason?: string }> {
  // Check if assigner has permission to assign roles
  const canAssignRoles = await checkPermission('roles', 'assign', assignerUserId);
  if (!canAssignRoles) {
    return { valid: false, reason: 'Insufficient permissions to assign roles' };
  }

  // Prevent removing the last ADMIN
  if (newRole !== 'ADMIN') {
    const { data: currentRole } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', targetUserId)
      .single();

    if (currentRole?.role === 'ADMIN') {
      const { count } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'ADMIN');

      if ((count || 0) <= 1) {
        return { 
          valid: false, 
          reason: 'Cannot remove the last ADMIN. Assign another ADMIN first.' 
        };
      }
    }
  }

  return { valid: true };
}