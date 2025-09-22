/**
 * Health Check Endpoint - API v1
 * 
 * Simple health check for monitoring and load balancer health checks.
 * Returns system status and basic metrics.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'up' | 'down' | 'unknown';
    auth: 'up' | 'down' | 'unknown';
  };
  flags?: string[];
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const startTime = Date.now();

    // Basic health response
    const health: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: 'v1.0.0',
      uptime: Date.now(), // In production, this would be actual uptime
      services: {
        database: 'up', // In production, test actual DB connection
        auth: 'up',     // In production, test auth service
      },
    };

    // Include active flags if any
    const flagsEnv = Deno.env.get('VITE_TALAMO_FLAGS');
    if (flagsEnv) {
      health.flags = flagsEnv.split(',').map(f => f.trim()).filter(Boolean);
    }

    const responseTime = Date.now() - startTime;
    
    // Log health check (minimal logging)
    console.log(`Health check completed in ${responseTime}ms`);

    return new Response(
      JSON.stringify(health),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );

  } catch (error) {
    console.error('Health check failed:', error);

    const errorResponse: HealthResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: 'v1.0.0',
      uptime: 0,
      services: {
        database: 'unknown',
        auth: 'unknown',
      },
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});