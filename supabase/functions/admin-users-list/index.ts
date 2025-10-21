import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('🚀 admin-users-list START');
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS/CORS');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📦 Init supabase client');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 ENV check:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    });

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    console.log('🔑 Has auth:', !!authHeader);

    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse body
    const body = await req.json();
    console.log('📥 Body:', body);

    const { q = '', role = 'all', affiliation = 'all', page = 1, perPage = 20 } = body;

    // Query profiles with joins
    console.log('🔍 Querying profiles...');
    
    const { data, error, count } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        avatar_url,
        email,
        phone,
        created_at,
        admin_users!left(role),
        affiliations!left(is_affiliated, partner_id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    console.log('📊 Query result:', { 
      hasData: !!data, 
      count: data?.length,
      total: count,
      error: error?.message 
    });

    if (error) {
      console.error('❌ Query error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Success, returning data');

    return new Response(
      JSON.stringify({
        ok: true,
        items: data || [],
        page,
        perPage,
        total: count || 0
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 CATCH ERROR:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error?.message || 'Unknown error',
        stack: error?.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
