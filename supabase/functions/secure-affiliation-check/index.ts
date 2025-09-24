import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ValidationRequest {
  email: string;
  captcha_token?: string;
}

interface ValidationResponse {
  ok: boolean;
  code?: string;
  message?: string;
  data?: {
    is_affiliated?: boolean;
    user_exists?: boolean;
    demo_mode?: boolean;
    uid?: string;
  };
  rate_limited?: boolean;
  retry_after?: number;
}

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

function isRateLimited(clientId: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 10;

  const current = rateLimitStore.get(clientId);
  
  if (!current || now > current.reset) {
    rateLimitStore.set(clientId, { count: 1, reset: now + windowMs });
    return { limited: false };
  }

  if (current.count >= maxRequests) {
    return { 
      limited: true, 
      retryAfter: Math.ceil((current.reset - now) / 1000) 
    };
  }

  current.count++;
  return { limited: false };
}

function getClientIdentifier(req: Request): string {
  // In production, use IP address and user agent
  const forwarded = req.headers.get('x-forwarded-for');
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `${ip}:${userAgent}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

async function logSecurityEvent(
  supabase: any,
  event: string,
  details: Record<string, any>
) {
  try {
    await supabase.from('audit_logs').insert({
      action: event,
      resource: 'affiliation_validation',
      meta: details,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

async function checkExnessAffiliation(
  email: string,
  retryCount = 0
): Promise<{ affiliated: boolean; uid?: string; error?: string }> {
  const maxRetries = 2;
  // Use fixed Exness API base URL as per specifications
  const baseUrl = "https://my.exnessaffiliates.com";
  const username = Deno.env.get('PARTNER_API_USER');
  const password = Deno.env.get('PARTNER_API_PASSWORD');

  console.log("🔧 Exness API config:", {
    baseUrl,
    hasUsername: !!username,
    hasPassword: !!password,
    retryCount
  });

  if (!username || !password) {
    throw new Error('PARTNER_API_USER or PARTNER_API_PASSWORD not configured');
  }

  try {
    // First, get JWT token
    console.log("🎫 Getting JWT token from:", `${baseUrl}/api/auth`);
    const authResponse = await fetch(`${baseUrl}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("🚨 Auth request failed:", authResponse.status, errorText);
      throw new Error(`Authentication failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    console.log("✅ Auth response received:", { hasToken: !!authData.token });

    if (!authData.token) {
      throw new Error('No token received from authentication');
    }

    // Now check affiliation
    console.log("🔍 Checking affiliation at:", `${baseUrl}/api/partner/affiliation/`);
    const response = await fetch(`${baseUrl}/api/partner/affiliation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.status === 429 && retryCount < maxRetries) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '2');
      console.log(`⏳ Rate limited, waiting ${retryAfter}s before retry ${retryCount + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return checkExnessAffiliation(email, retryCount + 1);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 Affiliation check failed:", response.status, errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Affiliation API response:", data);
    
    return {
      affiliated: data.affiliation === true,
      uid: data.client_uid,
      error: data.error
    };
  } catch (error) {
    console.error("🚨 checkExnessAffiliation error:", error);
    if (retryCount < maxRetries) {
      const backoffMs = 1000 * (retryCount + 1);
      console.log(`🔄 Retrying after ${backoffMs}ms, attempt ${retryCount + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      return checkExnessAffiliation(email, retryCount + 1);
    }
    throw error;
  }
}

Deno.serve(async (req) => {
  console.log("🚀 === SECURE AFFILIATION CHECK FUNCTION START ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("Timestamp:", new Date().toISOString());
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("✅ Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  const clientId = getClientIdentifier(req);
  const rateLimit = isRateLimited(clientId);
  
  if (rateLimit.limited) {
    return new Response(
      JSON.stringify({
        ok: false,
        code: 'Throttled',
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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          code: 'MethodNotAllowed',
          message: 'Method not allowed' 
        }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, captcha_token }: ValidationRequest = await req.json();

    console.log("📧 Email received:", email);
    console.log("🎫 Captcha token:", !!captcha_token);

    // Input validation
    if (!email || typeof email !== 'string') {
      console.log("❌ Invalid email provided:", email);
      await logSecurityEvent(supabase, 'invalid_email_format', { 
        email: '[REDACTED]', 
        client_id: clientId 
      });
      
      return new Response(
        JSON.stringify({ 
          ok: false, 
          code: 'BadRequest',
          message: 'Valid email required' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEmail(email)) {
      console.log("❌ Invalid email format:", email);
      await logSecurityEvent(supabase, 'invalid_email_format', { 
        email: '[REDACTED]', 
        client_id: clientId 
      });
      
      return new Response(
        JSON.stringify({ 
          ok: false, 
          code: 'BadRequest',
          message: 'Invalid email format' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for demo mode bypass
    const allowDemo = Deno.env.get('ALLOW_DEMO') === 'true';
    const isDemoEmail = email.toLowerCase().includes('demo') || email.toLowerCase().includes('test');
    
    console.log("🧪 Demo check:", { allowDemo, isDemoEmail, email: email.toLowerCase() });
    
    if (allowDemo && isDemoEmail) {
      console.log("✅ Demo mode activated for:", email);
      await logSecurityEvent(supabase, 'demo_access_granted', { 
        email: '[REDACTED]',
        client_id: clientId
      });
      
      return new Response(
        JSON.stringify({
          ok: true,
          data: {
            demo_mode: true,
            is_affiliated: true
          }
        } as ValidationResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      await logSecurityEvent(supabase, 'existing_user_validation_attempt', { 
        email: '[REDACTED]',
        user_id: existingUser.user_id,
        client_id: clientId
      });
      
      return new Response(
        JSON.stringify({
          ok: true,
          data: {
            user_exists: true,
            is_affiliated: true
          }
        } as ValidationResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check affiliation via Partner API
    const usePartnerAPI = Deno.env.get('USE_PARTNER_API') === 'true';
    
    console.log("🔧 Environment check:", {
      USE_PARTNER_API: usePartnerAPI,
      HAS_PARTNER_API_BASE: !!Deno.env.get('PARTNER_API_BASE'),
      HAS_PARTNER_API_USER: !!Deno.env.get('PARTNER_API_USER'),
      HAS_PARTNER_API_PASSWORD: !!Deno.env.get('PARTNER_API_PASSWORD')
    });
    
    if (usePartnerAPI) {
      console.log("🌐 Partner API is enabled, proceeding with affiliation check");
      try {
        const affiliationResult = await checkExnessAffiliation(email);
        console.log("📋 Affiliation result:", affiliationResult);
        
        // Log affiliation check result
        await supabase.from('affiliation_reports').insert({
          email: email.toLowerCase(),
          status: affiliationResult.affiliated ? 'affiliated' : 'not_affiliated',
          uid: affiliationResult.uid || null,
          partner_id: Deno.env.get('EXNESS_PARTNER_ID') || null
        });

        await logSecurityEvent(supabase, 'affiliation_check_completed', {
          email: '[REDACTED]',
          is_affiliated: affiliationResult.affiliated,
          client_id: clientId
        });

        return new Response(
          JSON.stringify({
            ok: true,
            data: {
              is_affiliated: affiliationResult.affiliated,
              uid: affiliationResult.uid
            }
          } as ValidationResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (apiError) {
        console.error('🚨 Partner API error:', apiError);
        console.error('Error details:', {
          message: apiError instanceof Error ? apiError.message : 'Unknown error',
          stack: apiError instanceof Error ? apiError.stack : 'No stack trace'
        });
        
        await logSecurityEvent(supabase, 'partner_api_error', {
          email: '[REDACTED]',
          error: apiError instanceof Error ? apiError.message : 'Unknown error',
          client_id: clientId
        });

        return new Response(
          JSON.stringify({
            ok: false,
            code: 'UpstreamError',
            message: 'Unable to verify affiliation at this time'
          } as ValidationResponse),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fallback response when Partner API is disabled
    console.log("⚠️ Partner API is disabled, returning not affiliated");
    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          is_affiliated: false
        }
      } as ValidationResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🚨 Validation function error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return new Response(
      JSON.stringify({
        ok: false,
        code: 'InternalError',
        message: 'Internal server error'
      } as ValidationResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});