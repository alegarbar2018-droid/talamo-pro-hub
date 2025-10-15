import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { login, investorPassword, server, platform } = await req.json();

    if (!login || !investorPassword || !server) {
      throw new Error('Missing required fields: login, investorPassword, server');
    }

    console.log(`📡 Connecting account: ${login}@${server}`);

    // Aquí se conectaría a MetaApi - por ahora simulamos la conexión
    const metaApiAccountId = `meta_${login}_${Date.now()}`;
    const detectedPlatform = platform || 'mt5';

    // Guardar en DB (credentials se guardan como texto por ahora - en producción usar encriptación)
    const { data: account, error: dbError } = await supabase
      .from('audit_accounts')
      .upsert({
        user_id: user.id,
        broker: 'exness',
        login: login,
        server: server,
        platform: detectedPlatform,
        status: 'connected',
        enc_credentials: investorPassword, // En producción: encriptar
        metaapi_account_id: metaApiAccountId,
        last_sync_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,login,server'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    console.log(`💾 Account saved to DB: ${account.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        account: {
          id: account.id,
          login: account.login,
          server: account.server,
          platform: account.platform,
          status: account.status,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
