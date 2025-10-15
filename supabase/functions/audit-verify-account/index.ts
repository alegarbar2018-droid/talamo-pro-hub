import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { account_id } = await req.json();

    console.log(`🔍 Verifying account: ${account_id}`);

    // Obtener verification key
    const { data: verification, error: verifyError } = await supabase
      .from('audit_verification')
      .select('*')
      .eq('account_id', account_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (verifyError || !verification) {
      throw new Error('No pending verification found');
    }

    // Verificar expiración
    if (new Date(verification.expires_at) < new Date()) {
      await supabase
        .from('audit_verification')
        .update({ status: 'expired' })
        .eq('id', verification.id);
      
      throw new Error('Verification key expired');
    }

    // Simulación: 70% de probabilidad de encontrar la orden
    const foundOrder = Math.random() > 0.3;

    if (foundOrder) {
      console.log(`✅ Verification order found`);

      // Marcar como verificado
      await supabase
        .from('audit_verification')
        .update({
          status: 'found',
          found_at: new Date().toISOString(),
        })
        .eq('id', verification.id);

      await supabase
        .from('audit_accounts')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
        })
        .eq('id', account_id);

      return new Response(
        JSON.stringify({
          success: true,
          verified: true,
          message: 'Account verified successfully',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log(`⏳ Verification order not found yet`);
      
      return new Response(
        JSON.stringify({
          success: true,
          verified: false,
          message: 'Verification order not found. Please ensure you created the pending order with the correct comment.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('❌ Verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
