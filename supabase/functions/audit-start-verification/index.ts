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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    const { account_id } = await req.json();

    // Generar key único (6 caracteres alfanuméricos)
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Expira en 24 horas
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Guardar en DB
    await supabase
      .from('audit_verification')
      .insert({
        account_id,
        key,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      });

    // Actualizar status de la cuenta
    await supabase
      .from('audit_accounts')
      .update({ status: 'verification_pending' })
      .eq('id', account_id);

    console.log(`🔑 Verification started for account ${account_id}: ${key}`);

    return new Response(
      JSON.stringify({
        success: true,
        key,
        expiresAt,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
