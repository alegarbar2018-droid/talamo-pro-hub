/**
 * Production RBAC System for Tálamo Admin Back Office
 * Implements granular permissions with scope-based access control
 */
import { supabase } from '@/integrations/supabase/client';

export type AdminRole = 
  | 'SUPERADMIN' 
  | 'ADMIN_OPERATIONS'
  | 'ADMIN_CONTENT' 
  | 'MODERATOR_SIGNALS'
  | 'SUPPORT'
  | 'ANALYST'
  | 'AUDITOR'
  | 'PROVIDER';

export type Permission = {
  resource: string;
  action: string;
  scope?: string[];
};

export type ActionRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Comprehensive RBAC Matrix
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPERADMIN: [
    { resource: '*', action: '*' },
  ],
  ADMIN_OPERATIONS: [
    { resource: 'tournaments', action: 'read' },
    { resource: 'tournaments', action: 'write' },
    { resource: 'tournaments', action: 'publish' },
    { resource: 'tournaments', action: 'settle' },
    { resource: 'prizes', action: '*' },
    { resource: 'signals', action: 'read' },
    { resource: 'providers', action: 'read' },
    { resource: 'metrics', action: 'read' },
  ],
  ADMIN_CONTENT: [
    { resource: 'courses', action: '*' },
    { resource: 'lessons', action: '*' },
    { resource: 'assessments', action: '*' },
    { resource: 'questions', action: '*' },
  ],
  MODERATOR_SIGNALS: [
    { resource: 'signals', action: 'read' },
    { resource: 'signals', action: 'review' },
    { resource: 'signals', action: 'approve' },
    { resource: 'signals', action: 'reject' },
    { resource: 'signals', action: 'suspend' },
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
  AUDITOR: [
    { resource: 'audit', action: 'read' },
    { resource: 'audit', action: 'export' },
  ],
  PROVIDER: [
    { resource: 'signals', action: 'create', scope: ['own'] },
    { resource: 'signals', action: 'read', scope: ['own'] },
    { resource: 'signals', action: 'edit', scope: ['own'] },
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

  // Prevent removing the last SUPERADMIN
  if (newRole !== 'SUPERADMIN') {
    const { data: currentRole } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', targetUserId)
      .single();

    if (currentRole?.role === 'SUPERADMIN') {
      const { count } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'SUPERADMIN');

      if ((count || 0) <= 1) {
        return { 
          valid: false, 
          reason: 'Cannot remove the last SUPERADMIN. Assign another SUPERADMIN first.' 
        };
      }
    }
  }

  return { valid: true };
}