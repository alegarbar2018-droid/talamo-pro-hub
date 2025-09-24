// Business Metrics & Observability Edge Function  
// Tracks NSM, ARPT, R30/R90, CAC/LTV and affiliation funnel metrics
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface MetricsRequest {
  action: 'track' | 'get_dashboard' | 'get_funnel';
  event?: {
    type: 'affiliation_check' | 'access_completed' | 'user_signup' | 'login' | 'course_started' | 'signal_viewed';
    user_id?: string;
    properties?: Record<string, any>;
  };
  filters?: {
    start_date?: string;
    end_date?: string;
    cohort?: string;
    channel?: string;
  };
}

interface MetricsResponse {
  ok: boolean;
  data?: {
    // NSM (North Star Metric)
    active_traders_30d?: number;
    
    // Business metrics
    arpt?: number; // Average Revenue Per Trader
    r30?: number;  // 30-day retention
    r90?: number;  // 90-day retention
    ltv_cac_ratio?: number;
    
    // Affiliation funnel
    funnel?: {
      total_checks: number;
      successful_validations: number;
      conversion_rate: number;
      avg_latency_ms: number;
      error_rate: number;
      p95_latency: number;
    };
    
    // Real-time alerts
    alerts?: Array<{
      type: 'high_error_rate' | 'high_latency' | 'low_conversion';
      severity: 'warning' | 'critical';
      message: string;
      value: number;
      threshold: number;
    }>;
  };
  error?: string;
}

// Business metrics calculations
async function calculateActiveTraders(supabase: any, days: number = 30): Promise<number> {
  const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
  
  // Count users who had any activity in the last N days
  const { count } = await supabase
    .from('audit_logs')
    .select('actor_id', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())
    .in('action', ['login', 'signal_viewed', 'course_completed', 'affiliation_validated']);
  
  return count || 0;
}

async function calculateRetentionRate(supabase: any, days: number): Promise<number> {
  const cohortStart = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
  const cohortEnd = new Date(Date.now() - ((days - 7) * 24 * 60 * 60 * 1000)); // 7-day cohort window
  
  // Get users who signed up in the cohort period
  const { data: cohortUsers } = await supabase
    .from('profiles')
    .select('user_id')
    .gte('created_at', cohortStart.toISOString())
    .lt('created_at', cohortEnd.toISOString());
  
  if (!cohortUsers?.length) return 0;
  
  // Count how many are still active
  const activeUserIds = new Set();
  const { data: activeUsers } = await supabase
    .from('audit_logs')
    .select('actor_id')
    .in('actor_id', cohortUsers.map(u => u.user_id))
    .gte('created_at', new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString());
  
  activeUsers?.forEach(u => activeUserIds.add(u.actor_id));
  
  return (activeUserIds.size / cohortUsers.length) * 100;
}

async function calculateAffiliationFunnel(supabase: any): Promise<any> {
  const last24h = new Date(Date.now() - (24 * 60 * 60 * 1000));
  
  // Get affiliation check metrics from last 24h
  const { data: checkEvents } = await supabase
    .from('audit_logs')
    .select('action, meta, created_at')
    .eq('resource', 'affiliation_validation')
    .gte('created_at', last24h.toISOString());
  
  if (!checkEvents?.length) {
    return {
      total_checks: 0,
      successful_validations: 0,
      conversion_rate: 0,
      avg_latency_ms: 0,
      error_rate: 0,
      p95_latency: 0
    };
  }
  
  const totalChecks = checkEvents.length;
  const successful = checkEvents.filter(e => e.action === 'affiliation_validated').length;
  const errors = checkEvents.filter(e => e.action === 'api_error').length;
  
  // Calculate latency metrics
  const latencies = checkEvents
    .filter(e => e.meta?.latency_ms)
    .map(e => e.meta.latency_ms)
    .sort((a, b) => a - b);
  
  const avgLatency = latencies.length > 0 
    ? latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length 
    : 0;
    
  const p95Index = Math.floor(latencies.length * 0.95);
  const p95Latency = latencies.length > 0 ? latencies[p95Index] || 0 : 0;
  
  return {
    total_checks: totalChecks,
    successful_validations: successful,
    conversion_rate: totalChecks > 0 ? (successful / totalChecks) * 100 : 0,
    avg_latency_ms: Math.round(avgLatency),
    error_rate: totalChecks > 0 ? (errors / totalChecks) * 100 : 0,
    p95_latency: p95Latency
  };
}

async function generateAlerts(funnelMetrics: any): Promise<Array<any>> {
  const alerts = [];
  
  // High error rate alert (>5%)
  if (funnelMetrics.error_rate > 5) {
    alerts.push({
      type: 'high_error_rate',
      severity: funnelMetrics.error_rate > 10 ? 'critical' : 'warning',
      message: `Affiliation API error rate is ${funnelMetrics.error_rate.toFixed(1)}%`,
      value: funnelMetrics.error_rate,
      threshold: 5
    });
  }
  
  // High latency alert (>2.5s p95)
  if (funnelMetrics.p95_latency > 2500) {
    alerts.push({
      type: 'high_latency',
      severity: funnelMetrics.p95_latency > 5000 ? 'critical' : 'warning',
      message: `Affiliation API p95 latency is ${funnelMetrics.p95_latency}ms`,
      value: funnelMetrics.p95_latency,
      threshold: 2500
    });
  }
  
  // Low conversion rate alert (<70%)
  if (funnelMetrics.conversion_rate < 70 && funnelMetrics.total_checks > 10) {
    alerts.push({
      type: 'low_conversion',
      severity: funnelMetrics.conversion_rate < 50 ? 'critical' : 'warning',
      message: `Affiliation conversion rate is ${funnelMetrics.conversion_rate.toFixed(1)}%`,
      value: funnelMetrics.conversion_rate,
      threshold: 70
    });
  }
  
  return alerts;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('📊 Business Metrics function started');

  try {
    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'GET') {
      // Return dashboard metrics (public endpoint for monitoring)
      const [activeTraders, r30, r90, funnelMetrics] = await Promise.all([
        calculateActiveTraders(supabase, 30),
        calculateRetentionRate(supabase, 30),
        calculateRetentionRate(supabase, 90),
        calculateAffiliationFunnel(supabase)
      ]);
      
      const alerts = await generateAlerts(funnelMetrics);
      
      return new Response(
        JSON.stringify({
          ok: true,
          data: {
            active_traders_30d: activeTraders,
            arpt: 0, // Placeholder until revenue integration
            r30: Math.round(r30 * 100) / 100,
            r90: Math.round(r90 * 100) / 100,
            ltv_cac_ratio: 0, // Placeholder 
            funnel: funnelMetrics,
            alerts
          }
        } as MetricsResponse),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Method not allowed'
        } as MetricsResponse),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request for event tracking
    let requestData: MetricsRequest;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Invalid JSON body'
        } as MetricsResponse),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, event, filters } = requestData;

    switch (action) {
      case 'track': {
        if (!event) {
          return new Response(
            JSON.stringify({
              ok: false,
              error: 'Event data required for tracking'
            } as MetricsResponse),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Track business event
        const eventData = {
          action: `business.${event.type}`,
          actor_id: event.user_id,
          resource: 'business_metrics',
          meta: {
            event_type: event.type,
            properties: event.properties,
            timestamp: new Date().toISOString(),
            session_id: event.properties?.session_id,
            utm_source: event.properties?.utm_source,
            utm_campaign: event.properties?.utm_campaign
          }
        };

        await supabase.from('audit_logs').insert(eventData);

        return new Response(
          JSON.stringify({
            ok: true,
            data: { tracked: true }
          } as MetricsResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'get_dashboard': {
        // Get comprehensive dashboard data with filters
        const startDate = filters?.start_date ? new Date(filters.start_date) : new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
        const endDate = filters?.end_date ? new Date(filters.end_date) : new Date();

        const [activeTraders, r30, r90, funnelMetrics] = await Promise.all([
          calculateActiveTraders(supabase, 30),
          calculateRetentionRate(supabase, 30),
          calculateRetentionRate(supabase, 90),
          calculateAffiliationFunnel(supabase)
        ]);
        
        const alerts = await generateAlerts(funnelMetrics);
        
        return new Response(
          JSON.stringify({
            ok: true,
            data: {
              active_traders_30d: activeTraders,
              arpt: 0, // Placeholder
              r30,
              r90,
              ltv_cac_ratio: 0, // Placeholder
              funnel: funnelMetrics,
              alerts,
              period: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
              }
            }
          } as MetricsResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'get_funnel': {
        // Get detailed funnel analysis
        const funnelMetrics = await calculateAffiliationFunnel(supabase);
        
        return new Response(
          JSON.stringify({
            ok: true,
            data: { funnel: funnelMetrics }
          } as MetricsResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      default: {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'Invalid action'
          } as MetricsResponse),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

  } catch (error: any) {
    console.error('📊 Business Metrics Error:', error);
    
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Internal server error'
      } as MetricsResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});