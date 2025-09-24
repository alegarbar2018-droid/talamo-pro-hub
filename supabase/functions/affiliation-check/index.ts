// Secure Exness Affiliation Check Edge Function
// Implements JWT auth, rate limiting, CORS, idempotency, and proper error mapping
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-idempotency-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Interfaces
interface ValidationRequest {
  email: string;
}

interface ValidationResponse {
  ok: boolean;
  code?: string;
  message?: string;
  data?: {
    is_affiliated?: boolean;
    client_uid?: string;
    partner_id?: string;
    source?: string;
  };
  rate_limited?: boolean;
  retry_after?: number;
}

// JWT Token cache with proper typing
let cachedToken: { token: string; expires: number } | null = null;

// Rate limiting store (Deno KV in production)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

// Email-based rate limiting
const emailRateLimitStore = new Map<string, { count: number; reset: number }>();

// Idempotency store (24h TTL)
const idempotencyStore = new Map<string, { response: any; expires: number }>();

// Enhanced rate limiting function
function checkRateLimit(clientId: string, email?: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();

  // IP-based rate limit: 30 req/5m (burst 10)
  const ipWindowMs = 5 * 60 * 1000; // 5 minutes
  const ipMaxRequests = 30;
  
  const ipCurrent = rateLimitStore.get(clientId);
  if (!ipCurrent || now > ipCurrent.reset) {
    rateLimitStore.set(clientId, { count: 1, reset: now + ipWindowMs });
  } else if (ipCurrent.count >= ipMaxRequests) {
    return { 
      limited: true, 
      retryAfter: Math.ceil((ipCurrent.reset - now) / 1000)
    };
  } else {
    ipCurrent.count++;
  }

  // Email-based rate limit: 5 req/10m
  if (email) {
    const emailWindowMs = 10 * 60 * 1000; // 10 minutes
    const emailMaxRequests = 5;
    
    const emailCurrent = emailRateLimitStore.get(email);
    if (!emailCurrent || now > emailCurrent.reset) {
      emailRateLimitStore.set(email, { count: 1, reset: now + emailWindowMs });
    } else if (emailCurrent.count >= emailMaxRequests) {
      return {
        limited: true,
        retryAfter: Math.ceil((emailCurrent.reset - now) / 1000)
      };
    } else {
      emailCurrent.count++;
    }
  }

  return { limited: false };
}

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `${ip}:${userAgent.slice(0, 50)}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '[INVALID]';
  
  const visibleChars = Math.min(3, Math.floor(local.length / 2));
  const maskedLocal = local.substring(0, visibleChars) + '***';
  return `${maskedLocal}@${domain}`;
}

async function getExnessJWTToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if still valid (cache for 8 minutes, refresh after 10)
  if (cachedToken && now < cachedToken.expires) {
    return cachedToken.token;
  }

  const apiBase = Deno.env.get('PARTNER_API_BASE');
  const apiUser = Deno.env.get('PARTNER_API_USER');
  const apiPassword = Deno.env.get('PARTNER_API_PASSWORD');

  if (!apiBase || !apiUser || !apiPassword) {
    throw new Error('PARTNER_API_CREDENTIALS_MISSING');
  }

  console.log(`🔐 Requesting JWT token from: ${apiBase}/auth/`);

  const response = await fetch(`${apiBase}/auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: apiUser, password: apiPassword }),
    signal: AbortSignal.timeout(15000) // 15s timeout
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`🚨 JWT auth failed: ${response.status} - ${errorText}`);
    
    if (response.status === 401) {
      throw new Error('UPSTREAM_AUTH');
    } else if (response.status === 429) {
      throw new Error('UPSTREAM_THROTTLED');
    } else if (response.status >= 500) {
      throw new Error('UPSTREAM_UNAVAILABLE');
    }
    throw new Error('UPSTREAM_ERROR');
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error('NO_TOKEN_RECEIVED');
  }

  // Cache token for 8 minutes (Exness tokens typically last 10 minutes)
  cachedToken = {
    token: data.token,
    expires: now + (8 * 60 * 1000)
  };

  console.log(`✅ JWT token cached successfully`);
  return cachedToken.token;
}

async function checkExnessAffiliation(email: string, retryCount = 0): Promise<any> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  
  if (!apiBase) {
    throw new Error('PARTNER_API_BASE_MISSING');
  }

  try {
    const token = await getExnessJWTToken();
    
    console.log(`🔍 Checking affiliation for: ${maskEmail(email)}`);
    
    const response = await fetch(`${apiBase}/partner/affiliation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`, // Correct JWT format for Exness
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(20000) // 20s timeout
    });

    // Handle token refresh on 401 (single retry)
    if (response.status === 401 && retryCount === 0) {
      console.log('🔄 Token expired, clearing cache and retrying');
      cachedToken = null;
      return await checkExnessAffiliation(email, 1);
    }

    console.log(`📡 Exness API response: ${response.status}`);

    // Handle specific error codes
    if (response.status === 401) {
      throw new Error('UPSTREAM_AUTH');
    } else if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '60');
      console.log(`⏳ Rate limited, retry after: ${retryAfter}s`);
      
      // Exponential backoff for 429
      if (retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 2000); // 500ms, 1s, 2s max
        await new Promise(resolve => setTimeout(resolve, delay));
        return await checkExnessAffiliation(email, retryCount + 1);
      }
      throw new Error('UPSTREAM_THROTTLED');
    } else if (response.status === 404) {
      // 404 from upstream means not affiliated, not an error
      return { affiliation: false };
    } else if (response.status >= 500) {
      throw new Error('UPSTREAM_UNAVAILABLE');
    } else if (!response.ok) {
      throw new Error('UPSTREAM_ERROR');
    }

    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error(`🚨 Affiliation check error: ${error.message}`);
    
    // Don't retry on authentication or configuration errors
    if (error.message.includes('UPSTREAM_AUTH') || error.message.includes('MISSING')) {
      throw error;
    }
    
    // Retry network errors up to 3 times
    if (retryCount < 3 && (
      error.name === 'TypeError' || 
      error.name === 'TimeoutError' ||
      error.message.includes('network')
    )) {
      const delay = 1000 * (retryCount + 1); // 1s, 2s, 3s
      await new Promise(resolve => setTimeout(resolve, delay));
      return await checkExnessAffiliation(email, retryCount + 1);
    }
    
    throw error;
  }
}

async function logAuditEvent(
  supabase: any,
  action: string,
  email: string,
  details: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      action,
      resource: 'affiliation_validation',
      meta: {
        email: maskEmail(email),
        ...details,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const clientId = getClientIdentifier(req);
  
  console.log(`🚀 Affiliation check started - Client: ${clientId.slice(0, 50)}...`);

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'INVALID_METHOD',
          message: 'Method not allowed'
        } as ValidationResponse),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate request
    let requestData: ValidationRequest;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'INVALID_JSON',
          message: 'Invalid JSON body'
        } as ValidationResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { email } = requestData;

    // Validate email
    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      await logAuditEvent(supabase, 'invalid_email_attempt', email || '[EMPTY]', { client_id: clientId });
      
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'INVALID_EMAIL',
          message: 'Valid email required'
        } as ValidationResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check idempotency
    const idempotencyKey = req.headers.get('x-idempotency-key');
    if (idempotencyKey) {
      const existing = idempotencyStore.get(idempotencyKey);
      if (existing && Date.now() < existing.expires) {
        console.log(`🔄 Returning cached response for idempotency key: ${idempotencyKey.slice(0, 10)}...`);
        return new Response(
          JSON.stringify(existing.response),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Rate limiting
    const rateLimit = checkRateLimit(clientId, normalizedEmail);
    if (rateLimit.limited) {
      await logAuditEvent(supabase, 'rate_limit_exceeded', normalizedEmail, { 
        client_id: clientId,
        retry_after: rateLimit.retryAfter 
      });

      return new Response(
        JSON.stringify({
          ok: false,
          code: 'RATE_LIMITED',
          message: 'Too many requests',
          rate_limited: true,
          retry_after: rateLimit.retryAfter
        } as ValidationResponse),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': rateLimit.retryAfter?.toString() || '300'
          }
        }
      );
    }

    // Check CORS origins
    const origin = req.headers.get('origin');
    const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || ['*'];
    if (allowedOrigins[0] !== '*' && origin && !allowedOrigins.includes(origin)) {
      await logAuditEvent(supabase, 'cors_violation', normalizedEmail, { 
        client_id: clientId,
        origin 
      });

      return new Response(
        JSON.stringify({
          ok: false,
          code: 'ORIGIN_NOT_ALLOWED',
          message: 'Origin not allowed'
        } as ValidationResponse),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for demo bypass
    const allowDemo = Deno.env.get('ALLOW_DEMO') === 'true';
    const isDemoEmail = /demo|test/i.test(normalizedEmail);
    
    if (allowDemo && isDemoEmail) {
      const demoResponse: ValidationResponse = {
        ok: true,
        data: {
          is_affiliated: true,
          source: 'demo-bypass',
          partner_id: Deno.env.get('EXNESS_PARTNER_ID') || undefined
        }
      };

      await logAuditEvent(supabase, 'demo_access_granted', normalizedEmail, { client_id: clientId });

      // Cache demo response if idempotency key provided
      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, {
          response: demoResponse,
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24h
        });
      }

      return new Response(
        JSON.stringify(demoResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists in system
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      const existingResponse: ValidationResponse = {
        ok: true,
        data: {
          is_affiliated: true,
          source: 'existing-user'
        }
      };

      await logAuditEvent(supabase, 'existing_user_validation', normalizedEmail, { 
        client_id: clientId,
        user_id: existingUser.user_id 
      });

      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, {
          response: existingResponse,
          expires: Date.now() + (24 * 60 * 60 * 1000)
        });
      }

      return new Response(
        JSON.stringify(existingResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check with Exness Partner API
    const usePartnerAPI = Deno.env.get('USE_PARTNER_API') === 'true';
    
    if (!usePartnerAPI) {
      const disabledResponse: ValidationResponse = {
        ok: false,
        code: 'SERVICE_DISABLED',
        message: 'Validation service is currently disabled'
      };

      await logAuditEvent(supabase, 'service_disabled_attempt', normalizedEmail, { client_id: clientId });

      return new Response(
        JSON.stringify(disabledResponse),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    try {
      const affiliationData = await checkExnessAffiliation(normalizedEmail);
      const latencyMs = Date.now() - startTime;
      
      console.log(`📊 Affiliation check completed in ${latencyMs}ms`);

      let response: ValidationResponse;
      
      if (affiliationData && affiliationData.affiliation === true) {
        response = {
          ok: true,
          data: {
            is_affiliated: true,
            client_uid: affiliationData.client_uid || affiliationData.clientUid || undefined,
            partner_id: Deno.env.get('EXNESS_PARTNER_ID') || undefined,
            source: 'exness-api'
          }
        };

        // Store affiliation report
        await supabase.from('affiliation_reports').insert({
          email: normalizedEmail,
          status: 'affiliated',
          uid: affiliationData.client_uid || affiliationData.clientUid || null,
          partner_id: Deno.env.get('EXNESS_PARTNER_ID') || null
        });

        await logAuditEvent(supabase, 'affiliation_validated', normalizedEmail, {
          client_id: clientId,
          latency_ms: latencyMs,
          source: 'exness-api'
        });

      } else {
        response = {
          ok: true, // Still OK response, just not affiliated
          data: {
            is_affiliated: false,
            source: 'exness-api'
          }
        };

        await supabase.from('affiliation_reports').insert({
          email: normalizedEmail,
          status: 'not_affiliated',
          partner_id: Deno.env.get('EXNESS_PARTNER_ID') || null
        });

        await logAuditEvent(supabase, 'affiliation_not_found', normalizedEmail, {
          client_id: clientId,
          latency_ms: latencyMs
        });
      }

      // Cache successful response
      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, {
          response,
          expires: Date.now() + (24 * 60 * 60 * 1000)
        });
      }

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (apiError: any) {
      const latencyMs = Date.now() - startTime;
      console.error(`🚨 API Error after ${latencyMs}ms:`, apiError.message);

      await logAuditEvent(supabase, 'api_error', normalizedEmail, {
        client_id: clientId,
        error: apiError.message,
        latency_ms: latencyMs
      });

      // Map errors to consistent HTTP status codes
      let statusCode = 502;
      let errorCode = 'UPSTREAM_ERROR';
      let message = 'Unable to verify affiliation at this time';

      switch (apiError.message) {
        case 'UPSTREAM_AUTH':
          statusCode = 401;
          errorCode = 'UPSTREAM_AUTH';
          message = 'Authentication error with broker';
          break;
        case 'UPSTREAM_THROTTLED':
          statusCode = 429;
          errorCode = 'UPSTREAM_THROTTLED';
          message = 'Too many requests to broker, try again later';
          break;
        case 'UPSTREAM_UNAVAILABLE':
          statusCode = 503;
          errorCode = 'UPSTREAM_UNAVAILABLE';
          message = 'Broker service temporarily unavailable';
          break;
        default:
          // Generic upstream error
          break;
      }

      return new Response(
        JSON.stringify({
          ok: false,
          code: errorCode,
          message
        } as ValidationResponse),
        {
          status: statusCode,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error(`🚨 Critical error after ${latencyMs}ms:`, error);

    return new Response(
      JSON.stringify({
        ok: false,
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      } as ValidationResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});