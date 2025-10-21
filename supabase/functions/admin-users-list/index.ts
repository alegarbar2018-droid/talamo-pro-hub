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

    const { q = '', role = 'all', affiliation = 'all', page = 1, perPage = 50 } = body;

    // Usar Admin API para listar usuarios
    console.log('🔍 Listing auth users...');
    
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    console.log('📊 Auth users result:', { 
      hasData: !!authData, 
      count: authData?.users?.length,
      error: authError?.message 
    });

    if (authError) {
      console.error('❌ Auth list error:', authError);
      return new Response(
        JSON.stringify({ ok: false, error: authError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const users = authData.users || [];
    console.log(`✅ Got ${users.length} users from auth`);

    // Enriquecer con datos de admin_users y affiliations
    const userIds = users.map(u => u.id);
    
    const [adminRoles, affiliations] = await Promise.all([
      supabase.from('admin_users').select('user_id, role').in('user_id', userIds),
      supabase.from('affiliations').select('user_id, is_affiliated, partner_id').in('user_id', userIds)
    ]);

    console.log('📊 Enrichment:', { 
      adminRoles: adminRoles.data?.length, 
      affiliations: affiliations.data?.length 
    });

    // Mapear roles y affiliations
    const rolesMap = new Map(adminRoles.data?.map(r => [r.user_id, r.role]) || []);
    const affiliationsMap = new Map(affiliations.data?.map(a => [a.user_id, a]) || []);

    // Formatear respuesta
    let items = users.map(user => {
      const userRole = rolesMap.get(user.id) || 'USER';
      const userAffiliation = affiliationsMap.get(user.id);
      
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        role: userRole,
        affiliation: userAffiliation?.partner_id || null,
        is_affiliated: userAffiliation?.is_affiliated || false,
        banned_until: user.banned_until,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        user_metadata: user.user_metadata,
      };
    });

    // Aplicar filtros
    if (q) {
      const lowerQ = q.toLowerCase();
      items = items.filter(u => 
        u.email?.toLowerCase().includes(lowerQ) ||
        u.user_metadata?.first_name?.toLowerCase().includes(lowerQ) ||
        u.user_metadata?.last_name?.toLowerCase().includes(lowerQ)
      );
    }

    if (role !== 'all') {
      items = items.filter(u => u.role === role);
    }

    if (affiliation !== 'all') {
      items = items.filter(u => u.affiliation === affiliation);
    }

    console.log(`✅ Returning ${items.length} filtered items`);

    return new Response(
      JSON.stringify({
        ok: true,
        items,
        page,
        perPage,
        total: items.length
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
