import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateTOTP } from '../_shared/totp.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExnessAgentLinkResponse {
  id: string;
  link_code: string;
  referral_link: string;
  alias: string;
  email: string;
  created: string;
}

interface TOTPVerificationResponse {
  verification_uid: string;
}

interface TOTPCompleteResponse {
  verification_token: string;
}

/**
 * Step 1: Authenticate with Exness Partner API
 */
async function getExnessToken(): Promise<string> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  const login = Deno.env.get('PARTNER_API_USER');
  const password = Deno.env.get('PARTNER_API_PASSWORD');

  if (!apiBase || !login || !password) {
    throw new Error('Missing Exness API credentials');
  }

  console.log('🔐 Authenticating with Exness...');
  
  const response = await fetch(`${apiBase}/api/auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Exness auth failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('✅ Authenticated successfully');
  return data.token;
}

/**
 * Step 2: Create Exness Agent Link
 */
async function createAgentLink(
  token: string,
  alias: string,
  email: string
): Promise<ExnessAgentLinkResponse> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');

  console.log('🔗 Creating agent link for:', email);

  const response = await fetch(`${apiBase}/api/v1/referral-agent-links/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ alias, email }),
  });

  const data = await response.json();

  // If alias already in use, continue anyway (as per instructions)
  if (!response.ok && !JSON.stringify(data).includes('already_in_use')) {
    throw new Error(`Failed to create agent link: ${response.status} - ${JSON.stringify(data)}`);
  }

  console.log('✅ Agent link created:', data.id);
  return data;
}

/**
 * Step 3a: Initialize TOTP Verification
 */
async function initTOTPVerification(token: string): Promise<{ verification_uid: string; session_uid: string }> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  const session_uid = crypto.randomUUID();

  console.log('🔒 Initializing TOTP verification...');

  const response = await fetch(`${apiBase}/v4/kyc_back/api/v3/verify/operation/init`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: JSON.stringify({
      operation_type: 'SET_AGENT_COMMISSION',
      additional_data: { share_perc: 50 },
      verification_method: 'TOTP',
      metadata: {
        browser: 'Chrome',
        os: 'Windows',
        domain: 'my.exnessaffiliates.com',
      },
      session_uid,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TOTP init failed: ${response.status} - ${error}`);
  }

  const data: TOTPVerificationResponse = await response.json();
  console.log('✅ TOTP verification initialized');
  return { verification_uid: data.verification_uid, session_uid };
}

/**
 * Step 3b: Complete TOTP Verification
 */
async function completeTOTPVerification(
  token: string,
  verification_uid: string,
  session_uid: string
): Promise<string> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  const totpSecret = Deno.env.get('EXNESS_TOTP_SECRET');

  if (!totpSecret) {
    throw new Error('EXNESS_TOTP_SECRET not configured');
  }

  console.log('🔐 Generating TOTP code...');
  const totpCode = await generateTOTP(totpSecret);
  console.log('🔐 TOTP code generated');

  const response = await fetch(`${apiBase}/v4/kyc_back/api/v2/verify/operation/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      verification_uid,
      code: totpCode,
      session_uid,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TOTP verification failed: ${response.status} - ${error}`);
  }

  const data: TOTPCompleteResponse = await response.json();
  console.log('✅ TOTP verification completed');
  return data.verification_token;
}

/**
 * Step 4: Assign Commission to Agent
 */
async function assignCommission(
  token: string,
  verificationToken: string,
  exnessId: string
): Promise<{ success: boolean; error?: string }> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');

  console.log('💰 Assigning commission to agent:', exnessId);

  const response = await fetch(`${apiBase}/api/v1/referral-agent-links/${exnessId}/agreements/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-temporary-token': verificationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ share_perc: 50 }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Commission assignment failed:', error);
    return { success: false, error: `${response.status}: ${error}` };
  }

  console.log('✅ Commission assigned successfully');
  return { success: true };
}

/**
 * Main Edge Function Handler
 */
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('👤 User authenticated:', user.email);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, language, exness_id, link_code')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if agent already exists
    if (profile.exness_id && profile.link_code) {
      console.log('ℹ️ Agent already exists, fetching existing data...');
      
      const { data: existingAgent } = await supabase
        .from('referral_agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingAgent) {
        return new Response(
          JSON.stringify({ success: true, agent: existingAgent }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    const userEmail = profile.email || user.email || '';
    const emailPrefix = userEmail.split('@')[0];
    const uniqueAlias = `${userName} ${emailPrefix} ${user.id.substring(0, 8)}`.trim();

    console.log('🚀 Starting agent creation flow...');

    // STEP 1: Get Exness token
    const token = await getExnessToken();

    // STEP 2: Create agent link
    const agentData = await createAgentLink(token, uniqueAlias, userEmail);

    // Save exness_id and link_code to profiles
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        exness_id: agentData.id,
        link_code: agentData.link_code,
      })
      .eq('user_id', user.id);

    if (updateProfileError) {
      console.error('⚠️ Failed to update profile:', updateProfileError);
    }

    // STEP 3: TOTP Verification (2-step process)
    const { verification_uid, session_uid } = await initTOTPVerification(token);
    const verificationToken = await completeTOTPVerification(token, verification_uid, session_uid);

    // STEP 4: Assign commission
    const commissionResult = await assignCommission(token, verificationToken, agentData.id);

    // STEP 5: Construct final referral link
    const language = profile.language || 'es';
    const finalLink = `https://one.exnessonelink.com/intl/${language}/a/${agentData.link_code}`;

    console.log('🔗 Final referral link:', finalLink);

    // Save final link to profiles
    const { error: linkUpdateError } = await supabase
      .from('profiles')
      .update({ exness_referral_link: finalLink })
      .eq('user_id', user.id);

    if (linkUpdateError) {
      console.error('⚠️ Failed to save referral link:', linkUpdateError);
    }

    // STEP 6: Save to referral_agents table
    const { data: newAgent, error: agentError } = await supabase
      .from('referral_agents')
      .insert({
        user_id: user.id,
        email: userEmail,
        name: userName,
        exness_agent_link_id: agentData.id,
        exness_referral_code: agentData.link_code,
        exness_referral_link: finalLink,
        commission_share_percentage: 50,
        cap_amount_usd: 0,
        status: commissionResult.success ? 'active' : 'pending_setup',
      })
      .select()
      .single();

    if (agentError) {
      console.error('❌ Failed to save agent:', agentError);
      throw agentError;
    }

    console.log('✅ Agent creation completed successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        agent: newAgent,
        commission_configured: commissionResult.success
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error creating referral agent:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
