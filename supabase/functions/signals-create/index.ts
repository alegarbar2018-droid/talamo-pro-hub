import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalCreateRequest {
  title: string;
  instrument: string;
  timeframe: string;
  logic: string;
  invalidation: string;
  rr: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  media_urls?: string[];
  scheduled_at?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user has permission
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has signals permission
    const { data: hasPermission } = await supabaseClient.rpc('has_admin_permission', {
      _resource: 'signals',
      _action: 'manage'
    });

    if (!hasPermission) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const signalData: SignalCreateRequest = await req.json();

    // Validate required fields
    if (!signalData.title || !signalData.instrument || !signalData.timeframe || 
        !signalData.logic || !signalData.invalidation || !signalData.rr) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create signal
    const { data: signal, error } = await supabaseClient
      .from('signals')
      .insert({
        title: signalData.title,
        instrument: signalData.instrument,
        timeframe: signalData.timeframe,
        logic: signalData.logic,
        invalidation: signalData.invalidation,
        rr: signalData.rr,
        entry_price: signalData.entry_price,
        stop_loss: signalData.stop_loss,
        take_profit: signalData.take_profit,
        media_urls: signalData.media_urls || [],
        author_id: user.id,
        source: 'manual',
        status: signalData.scheduled_at ? 'draft' : 'published',
        scheduled_at: signalData.scheduled_at,
        published_at: signalData.scheduled_at ? null : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating signal:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signal created successfully:', signal.id);

    return new Response(
      JSON.stringify({ signal }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
