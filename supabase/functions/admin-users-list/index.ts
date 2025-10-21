import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ListUsersRequest {
  q?: string;
  role?: string;
  affiliation?: string;
  status?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  dir?: 'asc' | 'desc';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify authentication and permissions
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check admin permissions
    const { data: hasPermission, error: permError } = await supabase.rpc('has_admin_permission', {
      _resource: 'users',
      _action: 'read'
    });

    if (permError || !hasPermission) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ListUsersRequest = await req.json();
    const {
      q = '',
      role = 'all',
      affiliation = 'all',
      status = 'all',
      page = 1,
      perPage = 20,
      sort = 'created_at',
      dir = 'desc'
    } = body;

    console.log('📊 Listing users with filters:', { q, role, affiliation, status, page, perPage });

    // Build query
    let query = supabase
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
      `, { count: 'exact' });

    // Apply search filter
    if (q) {
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    // Apply sorting
    query = query.order(sort, { ascending: dir === 'asc' });

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: profiles, error: queryError, count } = await query;

    if (queryError) {
      console.error('❌ Error fetching users:', queryError);
      throw queryError;
    }

    // Apply role filter (post-query since it's in joined table)
    let items = profiles || [];
    if (role !== 'all') {
      items = items.filter((user: any) => {
        const userRole = user.admin_users?.role || 'USER';
        return userRole === role;
      });
    }

    // Apply affiliation filter
    if (affiliation !== 'all') {
      items = items.filter((user: any) => {
        const isAffiliated = user.affiliations?.is_affiliated || false;
        return affiliation === 'affiliated' ? isAffiliated : !isAffiliated;
      });
    }

    // Log access for audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'users.list_accessed',
      resource: 'admin_users',
      meta: { filters: { q, role, affiliation, status }, page, perPage }
    });

    console.log(`✅ Found ${items.length} users (total: ${count})`);

    return new Response(
      JSON.stringify({
        ok: true,
        items,
        page,
        perPage,
        total: count || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in admin-users-list:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
