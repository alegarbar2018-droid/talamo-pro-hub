import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, password, profile } = await req.json();

    if (!email || !password || !profile) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and profile are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate profile completeness
    const requiredFields = ['language', 'level', 'goal', 'risk'];
    for (const field of requiredFields) {
      if (!profile[field]) {
        return new Response(
          JSON.stringify({ error: `Profile field '${field}' is required` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate password requirements
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters with one uppercase letter and one number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating user account for:', email);

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ 
          error: authError.message || 'Failed to create user account',
          code: authError.message?.includes('already registered') ? 'USER_EXISTS' : 'AUTH_ERROR'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user ID' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        email: email.toLowerCase().trim(),
        language: profile.language,
        level: profile.level,
        goal: profile.goal,
        risk_tolerance: profile.risk,
        interested_assets: profile.assets || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't fail if profile creation fails - user is already created
    }

    // Mark as validated since they completed the access process
    await supabase
      .from('user_validations')
      .upsert({
        user_id: userId,
        email: email.toLowerCase().trim(),
        is_validated: true,
        validated_at: new Date().toISOString(),
        validation_source: 'access_wizard',
      }, {
        onConflict: 'user_id'
      });

    // Generate session token for immediate login
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase().trim(),
    });

    console.log('User account created successfully:', userId);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        userId,
        sessionUrl: sessionData?.properties?.action_link 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Access finalize error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});