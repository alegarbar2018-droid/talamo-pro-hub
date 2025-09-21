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
  success: boolean;
  is_affiliated?: boolean;
  user_exists?: boolean;
  demo_mode?: boolean;
  error?: string;
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
  const baseUrl = Deno.env.get('PARTNER_API_BASE');
  const username = Deno.env.get('PARTNER_API_USER');
  const password = Deno.env.get('PARTNER_API_PASSWORD');

  if (!baseUrl || !username || !password) {
    throw new Error('Partner API configuration missing');
  }

  try {
    const response = await fetch(`${baseUrl}/validate-affiliation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
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
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      affiliated: data.is_affiliated || false,
      uid: data.uid,
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
        success: false,
        error: 'Too many requests',
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
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
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
        JSON.stringify({ success: false, error: 'Valid email required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!validateEmail(email)) {
      await logSecurityEvent(supabase, 'invalid_email_format', { 
        email: '[REDACTED]', 
        client_id: clientId 
      });
      
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { status: 400, headers: corsHeaders }
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
          success: true,
          demo_mode: true,
          is_affiliated: true
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
          success: true,
          user_exists: true,
          is_affiliated: true
        } as ValidationResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
            success: true,
            is_affiliated: affiliationResult.affiliated,
            uid: affiliationResult.uid
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
            success: false,
            error: 'Unable to verify affiliation at this time'
          } as ValidationResponse),
          { status: 503, headers: corsHeaders }
        );
      }
    }

    // Fallback response when Partner API is disabled
    return new Response(
      JSON.stringify({
        success: true,
        is_affiliated: false
      } as ValidationResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Validation function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      } as ValidationResponse),
      { status: 500, headers: corsHeaders }
    );
  }
});