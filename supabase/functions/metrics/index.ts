import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

interface MetricsResponse {
  timestamp: string;
  counters: {
    total_users: number;
    active_sessions: number;
    affiliation_checks_24h: number;
    failed_logins_24h: number;
  };
  uptime_seconds: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get basic metrics (without PII)
    const [usersResult, affiliationResult, auditResult] = await Promise.allSettled([
      supabase.from('profiles').select('id').limit(1000), // Get sample for count
      supabase
        .from('audit_logs')
        .select('id')
        .eq('resource', 'affiliation_validation')
        .gte('created_at', yesterday.toISOString()),
      supabase
        .from('audit_logs')
        .select('id')
        .ilike('action', '%login%failed%')
        .gte('created_at', yesterday.toISOString())
    ]);

    const totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value.data?.length || 0) : 0;
    const affiliationChecks = affiliationResult.status === 'fulfilled' ? (affiliationResult.value.data?.length || 0) : 0;
    const failedLogins = auditResult.status === 'fulfilled' ? (auditResult.value.data?.length || 0) : 0;

    const response: MetricsResponse = {
      timestamp: now.toISOString(),
      counters: {
        total_users: totalUsers,
        active_sessions: 0, // Would require session tracking
        affiliation_checks_24h: affiliationChecks,
        failed_logins_24h: failedLogins
      },
      uptime_seconds: Math.floor(process.uptime?.() || 0)
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Metrics error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});