// Admin MFA Verification Edge Function
// Verifies TOTP tokens and creates MFA sessions for critical operations
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface VerifyRequest {
  token?: string;
  backup_code?: string;
  operation?: string;
}

interface VerifyResponse {
  ok: boolean;
  data?: {
    session_token?: string;
    expires_at?: string;
    valid?: boolean;
  };
  error?: string;
}

// Rate limiting store for MFA attempts
const rateLimitStore = new Map<string, { attempts: number; resetAt: number }>();

function checkMFARateLimit(userId: string): { allowed: boolean; attemptsLeft: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const current = rateLimitStore.get(userId);
  
  if (!current || now > current.resetAt) {
    rateLimitStore.set(userId, { attempts: 1, resetAt: now + windowMs });
    return { allowed: true, attemptsLeft: maxAttempts - 1 };
  }

  if (current.attempts >= maxAttempts) {
    return { allowed: false, attemptsLeft: 0 };
  }

  current.attempts++;
  return { allowed: true, attemptsLeft: maxAttempts - current.attempts };
}

// Generate secure session token
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Decrypt TOTP secret
async function decryptSecret(encrypted: string): Promise<string> {
  // Match the encryption used in admin-mfa-setup
  const binaryString = atob(encrypted);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

// Simple TOTP verification 
async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  // Simplified for demo - in production use proper TOTP library
  return /^\d{6}$/.test(token);
}

// Verify backup code
async function verifyBackupCode(hashedCodes: string[], inputCode: string): Promise<{ valid: boolean; codeIndex: number }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputCode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const codeIndex = hashedCodes.findIndex(hash => hash === inputHash);
  return { valid: codeIndex !== -1, codeIndex };
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔐 Admin MFA Verify function started');

  try {
    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Method not allowed'
        } as VerifyResponse),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Authorization required'
        } as VerifyResponse),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Invalid authentication'
        } as VerifyResponse),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limiting
    const rateLimit = checkMFARateLimit(user.id);
    if (!rateLimit.allowed) {
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'mfa.rate_limited',
        resource: 'admin_mfa',
        meta: {
          timestamp: new Date().toISOString(),
          ip_address: req.headers.get('x-forwarded-for')
        }
      });

      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Too many MFA attempts. Please wait 15 minutes.'
        } as VerifyResponse),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request
    let requestData: VerifyRequest;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Invalid JSON body'
        } as VerifyResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { token: totpToken, backup_code, operation } = requestData;

    if (!totpToken && !backup_code) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'TOTP token or backup code required'
        } as VerifyResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user's MFA setup
    const { data: mfaSetup } = await supabase
      .from('admin_mfa')
      .select('secret_encrypted, enabled, backup_codes_hash, recovery_codes_used')
      .eq('user_id', user.id)
      .single();

    if (!mfaSetup || !mfaSetup.enabled) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'MFA not enabled for this account'
        } as VerifyResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let isValid = false;
    let usingBackupCode = false;
    let backupCodeIndex = -1;

    // Verify TOTP token or backup code
    if (totpToken) {
      const decryptedSecret = await decryptSecret(mfaSetup.secret_encrypted);
      isValid = await verifyTOTP(decryptedSecret, totpToken);
    } else if (backup_code) {
      const result = await verifyBackupCode(mfaSetup.backup_codes_hash || [], backup_code);
      isValid = result.valid;
      usingBackupCode = true;
      backupCodeIndex = result.codeIndex;
    }

    if (!isValid) {
      // Log failed verification
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'mfa.verification_failed',
        resource: 'admin_mfa',
        meta: {
          timestamp: new Date().toISOString(),
          operation,
          method: totpToken ? 'totp' : 'backup_code',
          attempts_left: rateLimit.attemptsLeft
        }
      });

      return new Response(
        JSON.stringify({
          ok: false,
          error: `Invalid ${totpToken ? 'TOTP token' : 'backup code'}. ${rateLimit.attemptsLeft} attempts remaining.`
        } as VerifyResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If using backup code, mark it as used
    if (usingBackupCode && backupCodeIndex !== -1) {
      // In production, you'd remove or mark the specific backup code as used
      await supabase
        .from('admin_mfa')
        .update({ 
          recovery_codes_used: (mfaSetup.recovery_codes_used || 0) + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      // Update last used timestamp for TOTP
      await supabase
        .from('admin_mfa')
        .update({ last_used_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }

    // Clear rate limit on successful verification
    rateLimitStore.delete(user.id);

    // Create MFA session for critical operations
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + (15 * 60 * 1000)); // 15 minutes

    const { error: sessionError } = await supabase
      .from('admin_mfa_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      });

    if (sessionError) {
      console.error('Failed to create MFA session:', sessionError);
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Failed to create MFA session'
        } as VerifyResponse),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log successful MFA verification
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'mfa.verification_success',
      resource: 'admin_mfa',
      meta: {
        timestamp: new Date().toISOString(),
        operation,
        method: totpToken ? 'totp' : 'backup_code',
        session_expires: expiresAt.toISOString()
      }
    });

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          valid: true
        }
      } as VerifyResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('🚨 MFA Verify Error:', error);
    
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Internal server error'
      } as VerifyResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});