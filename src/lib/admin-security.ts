/**
 * Security utilities for high-risk admin operations
 * Handles MFA, impersonation, audit trails, and data masking
 */
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface ImpersonationSession {
  id: string;
  impersonator_id: string;
  target_user_id: string;
  reason: string;
  expires_at: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  before_state?: any;
  after_state?: any;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
  correlation_id: string;
  created_at: string;
}

// Generate correlation ID for request tracing
export function generateCorrelationId(): string {
  return uuidv4();
}

// Create impersonation session (CRITICAL security operation) - PLACEHOLDER
export async function createImpersonationSession(
  targetUserId: string,
  reason: string,
  mfaToken?: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const { data: impersonator } = await supabase.auth.getUser();
    if (!impersonator.user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate MFA token (implement based on your MFA provider)
    if (!mfaToken) {
      return { success: false, error: 'MFA token required for impersonation' };
    }

    const sessionId = uuidv4();

    // Log the impersonation start
    await logSecurityEvent({
      action: 'impersonation.started',
      resource: 'user',
      resource_id: targetUserId,
      reason,
      correlation_id: generateCorrelationId(),
    });

    return { success: true, sessionId };
  } catch (error) {
    console.error('Failed to create impersonation session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

// End impersonation session - PLACEHOLDER
export async function endImpersonationSession(sessionId: string): Promise<void> {
  try {
    await logSecurityEvent({
      action: 'impersonation.ended',
      resource: 'user',
      resource_id: sessionId,
      correlation_id: generateCorrelationId(),
    });
  } catch (error) {
    console.error('Failed to end impersonation session:', error);
  }
}

// Comprehensive audit logging with before/after states
export async function logSecurityEvent(entry: {
  action: string;
  resource?: string;
  resource_id?: string;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
  correlation_id?: string;
}): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    const auditEntry = {
      action: entry.action,
      actor_id: user.user?.id,
      resource: entry.resource,
      meta: {
        resource_id: entry.resource_id,
        reason: entry.reason,
        ip_address: entry.ip_address || await getClientIP(),
        user_agent: entry.user_agent || navigator.userAgent,
        correlation_id: entry.correlation_id || generateCorrelationId(),
      },
      created_at: new Date().toISOString(),
    };

    await supabase
      .from('audit_logs')
      .insert(auditEntry);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Data masking for sensitive information
export interface MaskingOptions {
  maskEmail?: boolean;
  maskPhone?: boolean;
  maskName?: boolean;
  maskFinancial?: boolean;
}

export function maskSensitiveData<T extends Record<string, any>>(
  data: T,
  options: MaskingOptions = {}
): T {
  const masked = { ...data } as any;

  if (options.maskEmail && 'email' in masked && typeof masked.email === 'string') {
    const [local, domain] = masked.email.split('@');
    masked.email = `${local.slice(0, 2)}***@${domain}`;
  }

  if (options.maskPhone && 'phone' in masked && typeof masked.phone === 'string') {
    masked.phone = masked.phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
  }

  if (options.maskName) {
    if ('first_name' in masked && typeof masked.first_name === 'string') {
      masked.first_name = masked.first_name.slice(0, 1) + '***';
    }
    if ('last_name' in masked && typeof masked.last_name === 'string') {
      masked.last_name = masked.last_name.slice(0, 1) + '***';
    }
  }

  if (options.maskFinancial) {
    if ('account_number' in masked && typeof masked.account_number === 'string') {
      masked.account_number = '****' + masked.account_number.slice(-4);
    }
    if ('card_number' in masked && typeof masked.card_number === 'string') {
      masked.card_number = '**** **** **** ' + masked.card_number.slice(-4);
    }
  }

  return masked as T;
}

// Rate limiting for sensitive operations
const operationCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  operation: string,
  userId: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remainingAttempts: number; resetAt: number } {
  const key = `${operation}:${userId}`;
  const now = Date.now();
  const current = operationCounts.get(key);

  if (!current || now > current.resetAt) {
    // Reset or initialize
    operationCounts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetAt: now + windowMs };
  }

  if (current.count >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0, resetAt: current.resetAt };
  }

  current.count++;
  return { 
    allowed: true, 
    remainingAttempts: maxAttempts - current.count, 
    resetAt: current.resetAt 
  };
}

// Get client IP (implement based on your setup)
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// MFA token verification (implement based on your MFA provider)
export async function verifyMFAToken(token: string, userId: string): Promise<boolean> {
  // Implement based on your MFA provider (TOTP, SMS, etc.)
  // This is a placeholder implementation
  return token.length === 6 && /^\d{6}$/.test(token);
}

// Dual approval workflow
export interface ApprovalRequest {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  requester_id: string;
  approver_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  data: any;
  reason: string;
  expires_at: string;
  created_at: string;
}

export async function requestApproval(
  action: string,
  resourceType: string,
  resourceId: string,
  data: any,
  reason: string
): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  const requestId = uuidv4();

  await logSecurityEvent({
    action: 'approval.requested',
    resource: resourceType,
    resource_id: resourceId,
    reason,
    correlation_id: generateCorrelationId(),
  });

  return requestId;
}

export async function approveRequest(
  requestId: string,
  approverId: string,
  mfaToken?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify MFA for critical approvals
    if (mfaToken && !await verifyMFAToken(mfaToken, approverId)) {
      return { success: false, error: 'Invalid MFA token' };
    }

    await logSecurityEvent({
      action: 'approval.granted',
      resource: 'approval_request',
      resource_id: requestId,
      correlation_id: generateCorrelationId(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to approve request' };
  }
}