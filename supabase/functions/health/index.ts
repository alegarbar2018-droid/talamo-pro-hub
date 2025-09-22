import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    auth: 'healthy' | 'unhealthy';
  };
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

    // Test database connection
    let dbHealth: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      await supabase.from('profiles').select('count').limit(1);
      dbHealth = 'healthy';
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Test auth service
    let authHealth: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      await supabase.auth.getUser();
      authHealth = 'healthy';
    } catch (error) {
      console.error('Auth health check failed:', error);
    }

    const response: HealthResponse = {
      status: dbHealth === 'healthy' && authHealth === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealth,
        auth: authHealth
      }
    };

    const statusCode = response.status === 'healthy' ? 200 : 503;

    return new Response(
      JSON.stringify(response),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Health check error:', error);
    
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});