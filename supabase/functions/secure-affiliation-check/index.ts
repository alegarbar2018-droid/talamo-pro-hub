import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

async function authenticateWithExnessAPI(): Promise<string> {
  const username = Deno.env.get('PARTNER_API_USER');
  const password = Deno.env.get('PARTNER_API_PASSWORD');

  if (!username || !password) {
    throw new Error('Partner API credentials missing');
  }

  const response = await fetch('https://my.exnessaffiliates.com/api/auth/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: username,
      password: password
    }),
    signal: AbortSignal.timeout(10000) // 10 second timeout
  });

  if (!response.ok) {
    throw new Error(`Auth API responded with status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error('No token received from auth API');
  }

  return data.token;
}

async function checkExnessAffiliation(
  email: string,
  retryCount = 0
): Promise<{ affiliated: boolean; uid?: string; error?: string }> {
  const maxRetries = 2;

  try {
    // Step 1: Get authentication token
    const token = await authenticateWithExnessAPI();

    // Step 2: Check affiliation with the token
    const response = await fetch('https://my.exnessaffiliates.com/api/partner/affiliation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.status === 429 && retryCount < maxRetries) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '2');
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return checkExnessAffiliation(email, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`Affiliation API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Exness API Response:', JSON.stringify(data, null, 2));
    
    return {
      affiliated: data.affiliation || false,
      uid: data.client_uid,
      error: data.error
    };
  } catch (error) {
    if (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return checkExnessAffiliation(email, retryCount + 1);
    }
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
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

    // Input validation
    if (!email || typeof email !== 'string') {
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
    
    if (allowDemo && isDemoEmail) {
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
    const emailLower = email.toLowerCase();

    // 1) ¿Existe perfil?
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', emailLower)
      .maybeSingle(); // evita throw si no hay fila
    
    if (profile?.user_id) {
      // 2) ¿Tenemos evidencia local de afiliación válida?
      const { data: aff } = await supabase
        .from('affiliations')
        .select('is_affiliated, verified_at, partner_id')
        .eq('user_id', profile.user_id)
        .maybeSingle();
    
      const partnerId = Deno.env.get('EXNESS_PARTNER_ID') || null;
      const locallyAffiliated =
        !!aff?.is_affiliated &&
        !!aff?.verified_at &&
        (!!partnerId ? aff.partner_id === partnerId : true);
    
      await logSecurityEvent(supabase, 'existing_user_validation_attempt', { 
        email: '[REDACTED]',
        user_id: profile.user_id,
        client_id: clientId,
        locallyAffiliated
      });
    
      if (locallyAffiliated) {
        // Evidencia local suficiente: no llamamos upstream
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
    
      // Si existe usuario pero no hay evidencia local, seguimos con la verificación upstream.
      // Nota: devolveremos user_exists: true junto con el resultado real de afiliación.
    }
    
    // 3) Verificación upstream (si no hay perfil o no hay evidencia local)
    try {
      const result = await checkExnessAffiliation(emailLower);
    
      // Guarda/actualiza reporte
      await supabase.from('affiliation_reports').insert({
        email: emailLower,
        status: result.affiliated ? 'affiliated' : 'not_affiliated',
        uid: result.uid ?? null,
        partner_id: Deno.env.get('EXNESS_PARTNER_ID') ?? null
      });
    
      return new Response(
        JSON.stringify({
          ok: true,
          data: {
            user_exists: !!profile?.user_id,
            is_affiliated: result.affiliated,
            uid: result.uid
          }
        } as ValidationResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      // manejo de error como ya tienes
    }

    // Check affiliation via Partner API
    const usePartnerAPI = Deno.env.get('USE_PARTNER_API') === 'true';
    
    if (usePartnerAPI) {
      try {
        const affiliationResult = await checkExnessAffiliation(email);
        
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
        console.error('Partner API error:', apiError);
        
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
    console.error('Validation function error:', error);
    
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