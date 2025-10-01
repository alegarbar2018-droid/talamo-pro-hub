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

const rateLimitStore = new Map<string, { count: number; reset: number }>();

function isRateLimited(clientId: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxRequests = 10;

  const current = rateLimitStore.get(clientId);

  if (!current || now > current.reset) {
    rateLimitStore.set(clientId, { count: 1, reset: now + windowMs });
    return { limited: false };
  }

  if (current.count >= maxRequests) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.reset - now) / 1000),
    };
  }

  current.count++;
  return { limited: false };
}

function getClientIdentifier(req: Request): string {
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
      created_at: new Date().toISOString(),
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: username, password }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`Auth API responded with status: ${response.status}`);

  const data = await response.json();
  if (!data.token) throw new Error('No token received from auth API');

  return data.token;
}

async function checkExnessAffiliation(
  email: string,
  retryCount = 0
): Promise<{ affiliated: boolean; uid?: string; error?: string }> {
  const maxRetries = 2;

  try {
    const token = await authenticateWithExnessAPI();

    const response = await fetch('https://my.exnessaffiliates.com/api/partner/affiliation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 429 && retryCount < maxRetries) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '2');
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return checkExnessAffiliation(email, retryCount + 1);
    }

    if (!response.ok) throw new Error(`Affiliation API responded with status: ${response.status}`);

    const data = await response.json();
    console.log('Exness API Response:', JSON.stringify(data, null, 2));

    return {
      affiliated: data.affiliation || false,
      uid: data.client_uid,
      error: data.error,
    };
  } catch (error) {
    if (retryCount < maxRetries) {
      await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
      return checkExnessAffiliation(email, retryCount + 1);
    }
    throw error;
  }
}

Deno.serve(async (req) => {
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
        retry_after: rateLimit.retryAfter,
      }),
      {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': rateLimit.retryAfter?.toString() || '300' },
      }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, code: 'MethodNotAllowed', message: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { email }: ValidationRequest = await req.json();
    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return new Response(JSON.stringify({ ok: false, code: 'BadRequest', message: 'Valid email required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const emailLower = email.toLowerCase();

    // 🔑 1) Revisar si YA existe un usuario registrado en Supabase Auth
    const { data: userLookup } = await supabase.auth.admin.getUserByEmail(emailLower);
    if (userLookup?.user) {
      await logSecurityEvent(supabase, 'existing_auth_user_detected', { email: '[REDACTED]', client_id: clientId });
      return new Response(JSON.stringify({ ok: true, data: { user_exists: true } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 🔍 2) Revisar afiliación upstream (Exness)
    const result = await checkExnessAffiliation(emailLower);

    await supabase.from('affiliation_reports').insert({
      email: emailLower,
      status: result.affiliated ? 'affiliated' : 'not_affiliated',
      uid: result.uid ?? null,
      partner_id: Deno.env.get('EXNESS_PARTNER_ID') ?? null,
    });

    return new Response(JSON.stringify({ ok: true, data: { user_exists: false, is_affiliated: result.affiliated, uid: result.uid } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Validation function error:', error);
    return new Response(JSON.stringify({ ok: false, code: 'InternalError', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
