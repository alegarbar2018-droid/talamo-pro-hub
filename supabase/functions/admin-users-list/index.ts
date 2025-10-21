import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'method_not_allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { q = '', role = 'all', affiliation = 'all', page = 1, perPage = 20, sort = 'created_at', dir = 'desc' } = await req.json().catch(() => ({}));

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ ok: false, error: 'missing_env_vars' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Base query a la vista
    let query = supabase
      .from('v_admin_users')
      .select('*', { count: 'exact' });

    // Búsqueda (email, nombre)
    if (q && String(q).trim().length > 0) {
      const term = String(q).trim();
      query = query.or(`email.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%`);
    }

    // Filtro por rol (ignorar 'all')
    if (role && role !== 'all') {
      query = query.eq('admin_role', role);
    }

    // Filtro por afiliación (si luego agregas columnas reales en la vista)
    if (affiliation && affiliation !== 'all') {
      if (affiliation === 'affiliated') {
        query = query.eq('is_affiliated', true);
      }
      if (affiliation === 'unaffiliated') {
        query = query.or('is_affiliated.is.null,is_affiliated.eq.false');
      }
    }

    // Orden
    const orderCol = ['created_at', 'email', 'admin_role'].includes(String(sort)) ? String(sort) : 'created_at';
    const ascending = String(dir).toLowerCase() === 'asc';
    query = query.order(orderCol, { ascending, nullsFirst: false });

    // Paginación (1-based)
    const from = (Number(page) - 1) * Number(perPage);
    const to = from + Number(perPage) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('admin-users-list error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'query_failed', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mapear a la forma esperada por la UI
    const items = (data ?? []).map((r: any) => ({
      id: r.profile_id ?? r.user_id,
      user_id: r.user_id,
      email: r.email ?? null,
      first_name: r.first_name ?? null,
      last_name: r.last_name ?? null,
      avatar_url: r.avatar_url ?? null,
      phone: r.phone ?? null,
      created_at: r.created_at,
      admin_users: r.admin_role ? { role: r.admin_role } : null,
      affiliations: r.is_affiliated == null ? null : { is_affiliated: r.is_affiliated, partner_id: r.partner_id }
    }));

    return new Response(
      JSON.stringify({ ok: true, items, page, perPage, total: count ?? 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('admin-users-list catch error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: 'internal_error',
        message: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
