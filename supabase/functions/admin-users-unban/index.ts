import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UnbanUserRequest {
  userId: string;
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

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check admin permissions - only ADMIN can unban
    const { data: adminRole } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!adminRole || adminRole.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Only ADMIN role can unban users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: UnbanUserRequest = await req.json();
    const { userId } = body;

    if (!userId) {
      throw new Error('Missing userId');
    }

    console.log(`✅ Unbanning user ${userId}`);

    // Unban user using Supabase Admin API
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: 'none'
    });

    if (error) throw error;

    // Log action for audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'user.unbanned',
      resource: 'auth_users',
      meta: { target_user_id: userId }
    });

    console.log(`✅ User unbanned successfully`);

    return new Response(
      JSON.stringify({ ok: true, user: data.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in admin-users-unban:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
