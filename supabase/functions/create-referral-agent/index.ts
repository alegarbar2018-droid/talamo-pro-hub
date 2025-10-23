import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ExnessAgentLinkResponse {
  id: string;
  referral_link: string;
  alias: string;
  email: string;
}

// Get fresh JWT token from Exness
async function getExnessToken(): Promise<string> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  const email = Deno.env.get('PARTNER_API_USER');
  const password = Deno.env.get('PARTNER_API_PASSWORD');

  if (!apiBase || !email || !password) {
    throw new Error('Missing Exness API credentials');
  }

  console.log('🔑 Authenticating with Exness...');

  const response = await fetch(`${apiBase}/api/v2/auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Exness auth failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.token || data.access;
}

// STEP 1: Create agent link
async function createAgentLink(token: string, name: string, email: string): Promise<ExnessAgentLinkResponse> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  
  console.log(`📝 Creating agent link for ${email}...`);
  
  const response = await fetch(`${apiBase}/api/v1/referral-agent-links/`, {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ alias: name, email }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create agent link: ${response.status} - ${error}`);
  }

  return await response.json();
}

// STEP 2: Assign 50% commission
async function assignCommission(token: string, agentLinkId: string): Promise<void> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  
  console.log(`💰 Assigning 50% commission to agent ${agentLinkId}...`);
  
  const response = await fetch(`${apiBase}/api/v1/referral-agent-links/${agentLinkId}/agreements/`, {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      share_perc: 50,
      cap_amount_usd: 0,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to assign commission: ${response.status} - ${error}`);
  }
}

// STEP 3: Configure shared reports
async function configureSharedReports(token: string, agentLinkId: string): Promise<void> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  
  console.log(`📊 Configuring shared reports for agent ${agentLinkId}...`);
  
  const response = await fetch(`${apiBase}/api/v1/referral-agent-links/${agentLinkId}/shared-reports/`, {
    method: 'PUT',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shared_reports: ['reward_history', 'client_report'],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to configure reports: ${response.status} - ${error}`);
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting create-referral-agent function...');

    // Validate authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Unauthorized:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`👤 User authenticated: ${user.id}`);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('❌ Profile not found:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Agent';
    const userEmail = profile.email || user.email;

    console.log(`📧 User info: ${userName} (${userEmail})`);

    // Check if agent already exists
    const { data: existingAgent } = await supabase
      .from('referral_agents')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingAgent) {
      console.log('✅ Agent link already exists');
      return new Response(
        JSON.stringify({
          success: true,
          agent: existingAgent,
          message: 'Agent link already exists'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // FLOW: Create agent link with 3 API calls

    // Step 1: Get Exness token
    const token = await getExnessToken();
    console.log('✅ Exness token obtained');

    // Step 2: Create agent link
    const agentLink = await createAgentLink(token, userName, userEmail);
    console.log(`✅ Agent link created: ${agentLink.id}`);

    // Step 3: Assign commission
    await assignCommission(token, agentLink.id);
    console.log('✅ Commission assigned (50%)');

    // Step 4: Configure reports
    await configureSharedReports(token, agentLink.id);
    console.log('✅ Shared reports configured');

    // Step 5: Save to database
    const { data: newAgent, error: insertError } = await supabase
      .from('referral_agents')
      .insert({
        user_id: user.id,
        email: userEmail,
        name: userName,
        exness_agent_link_id: agentLink.id,
        exness_referral_code: agentLink.id,
        exness_referral_link: agentLink.referral_link,
        commission_share_percentage: 50,
        cap_amount_usd: 0,
        shared_reports: ['reward_history', 'client_report'],
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      throw insertError;
    }

    console.log('✅ Agent saved to database');

    return new Response(
      JSON.stringify({
        success: true,
        agent: newAgent,
        message: 'Agent link created successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
