import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface RegisterResponse {
  ok: boolean;
  code?: string;
  message?: string;
  data?: {
    user?: any;
    session?: any;
  };
}

function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateEmailFormat(email: string): boolean {
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
      resource: 'auth_register',
      meta: details,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        ok: false,
        code: 'MethodNotAllowed',
        message: 'Method not allowed'
      } as RegisterResponse),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: RegisterRequest = await req.json();
    const { email, password, firstName, lastName } = body;

    // Input validation
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'BadRequest',
          message: 'Valid email required'
        } as RegisterResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEmailFormat(email)) {
      await logSecurityEvent(supabase, 'invalid_email_format', { 
        email: '[REDACTED]'
      });
      
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'BadRequest',
          message: 'Invalid email format'
        } as RegisterResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-side password validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      await logSecurityEvent(supabase, 'weak_password_attempt', { 
        email: '[REDACTED]',
        errors: passwordValidation.errors
      });
      
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'WeakPassword',
          message: passwordValidation.errors.join('. ')
        } as RegisterResponse),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Attempt registration
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) {
      await logSecurityEvent(supabase, 'registration_failed', { 
        email: '[REDACTED]',
        error: error.message
      });
      
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'RegistrationFailed',
          message: error.message
        } as RegisterResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await logSecurityEvent(supabase, 'registration_successful', { 
      email: '[REDACTED]',
      user_id: data.user?.id
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Registration successful',
        data: {
          user: data.user,
          session: data.session
        }
      } as RegisterResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Registration function error:', error);
    
    return new Response(
      JSON.stringify({
        ok: false,
        code: 'InternalError',
        message: 'Internal server error'
      } as RegisterResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});