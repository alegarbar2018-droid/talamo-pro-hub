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
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("✅ Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  // Simple test to verify the function is working
  try {
    console.log("📧 Function is running, processing request...");
    
    // Parse request body
    let requestBody;
    try {
      const rawBody = await req.text();
      console.log("📦 Raw request body:", rawBody);
      requestBody = JSON.parse(rawBody);
      console.log("📋 Parsed request body:", requestBody);
    } catch (parseError) {
      console.error("❌ Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'BadRequest',
          message: 'Invalid request body'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email } = requestBody;
    console.log("📧 Processing email:", email);

    // Basic validation
    if (!email) {
      console.log("❌ No email provided");
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'BadRequest',
          message: 'Email is required'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, return a simple success response for testing
    console.log("✅ Returning test response");
    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          is_affiliated: false,
          message: `Function is working! Processed email: ${email}`
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🚨 Function error:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        code: 'InternalError',
        message: 'Function error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});