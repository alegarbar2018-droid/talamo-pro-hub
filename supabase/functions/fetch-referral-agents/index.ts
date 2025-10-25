import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Authenticate with Exness Partner API
 */
async function getExnessToken(): Promise<string> {
  const apiBase = Deno.env.get('PARTNER_API_BASE');
  const login = Deno.env.get('PARTNER_API_USER');
  const password = Deno.env.get('PARTNER_API_PASSWORD');

  if (!apiBase || !login || !password) {
    throw new Error('Missing Exness API credentials');
  }

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
  return data.token;
}

/**
 * Fetch referral agents from Exness API
 */
async function fetchAgentsFromExness(token: string, limit = 10, offset = 0) {
  const apiBase = Deno.env.get('PARTNER_API_BASE');

  const response = await fetch(
    `${apiBase}/api/v1/referral-agent-links/?limit=${limit}&offset=${offset}&ordering=-created`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch agents: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data;
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

    console.log('👤 Admin user fetching agents:', user.email);

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get Exness token
    const token = await getExnessToken();

    // Fetch agents from Exness API
    const data = await fetchAgentsFromExness(token, limit, offset);

    console.log(`✅ Fetched ${data.results?.length || 0} agents from Exness API`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        agents: data.results || data,
        total: data.count || data.results?.length || 0
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching referral agents:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
