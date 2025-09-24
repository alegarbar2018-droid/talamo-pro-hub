/**
 * Affiliation Validation Endpoint - API v1
 * 
 * Versioned proxy to the existing affiliation validation logic.
 * Maintains same behavior but with enhanced security, logging, and timeout handling.
 * 
 * This endpoint does NOT replace the existing one - it's a parallel implementation
 * for gradual migration when the api_v1 flag is enabled.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

// Rate limiting (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(clientId: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute

  const record = rateLimitStore.get(clientId);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { limited: true, retryAfter };
  }

  record.count++;
  return { limited: false };
}

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const userAgent = req.headers.get('user-agent') || '';
  return `${forwarded || 'unknown'}:${userAgent.slice(0, 100)}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

async function validateAffiliationSecure(email: string): Promise<ValidationResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    // Call the existing secure-affiliation-check function
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase.functions.invoke('secure-affiliation-check', {
      body: { email },
    });

    if (error) {
      console.error('Supabase function error:', error);
      return { 
        success: false, 
        error: 'Validation service temporarily unavailable' 
      };
    }

    return data;

  } catch (error) {
    console.error('Affiliation validation error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return { 
        success: false, 
        error: 'Validation timeout - please try again' 
      };
    }

    return { 
      success: false, 
      error: 'Validation service error'
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

serve(async (req: Request) => {
  const requestStart = Date.now();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateCheck = isRateLimited(clientId);
    
    if (rateCheck.limited) {
      console.warn(`Rate limit exceeded for client: ${clientId}`);
      
      return new Response(
        JSON.stringify({
          success: false,
          rate_limited: true,
          retry_after: rateCheck.retryAfter,
          error: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateCheck.retryAfter || 60),
          },
        }
      );
    }

    // Parse and validate request
    let requestBody: ValidationRequest;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON request' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email } = requestBody;
    
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Perform validation
    const result = await validateAffiliationSecure(email.toLowerCase().trim());
    const duration = Date.now() - requestStart;
    
    // Log successful validation (info level)
    console.info(`Affiliation validation completed: ${email} - ${result.success ? 'success' : 'failed'} (${duration}ms)`);

    // Return appropriate status code based on result
    let statusCode = 200;
    if (!result.success) {
      if (result.rate_limited) {
        statusCode = 429;
      } else if (result.error?.includes('Invalid') || result.error?.includes('format')) {
        statusCode = 400;
      } else if (result.error?.includes('Unauthorized')) {
        statusCode = 401;
      } else {
        statusCode = 500;
      }
    }

    return new Response(
      JSON.stringify(result),
      {
        status: statusCode,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Response-Time': `${duration}ms`,
        },
      }
    );

  } catch (error) {
    const duration = Date.now() - requestStart;
    console.error('API v1 affiliation validation error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Response-Time': `${duration}ms`,
        },
      }
    );
  }
});