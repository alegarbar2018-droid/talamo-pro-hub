import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalUpdateRequest {
  signal_id: string;
  status?: 'draft' | 'published' | 'archived';
  result?: 'win' | 'loss' | 'pending';
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
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

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check permission
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

    const updateData: SignalUpdateRequest = await req.json();

    if (!updateData.signal_id) {
      return new Response(
        JSON.stringify({ error: 'Missing signal_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updateData.status) updates.status = updateData.status;
    if (updateData.result) updates.result = updateData.result;
    if (updateData.entry_price !== undefined) updates.entry_price = updateData.entry_price;
    if (updateData.stop_loss !== undefined) updates.stop_loss = updateData.stop_loss;
    if (updateData.take_profit !== undefined) updates.take_profit = updateData.take_profit;

    // Update signal
    const { data: signal, error } = await supabaseClient
      .from('signals')
      .update(updates)
      .eq('id', updateData.signal_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating signal:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signal updated successfully:', signal.id);

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
