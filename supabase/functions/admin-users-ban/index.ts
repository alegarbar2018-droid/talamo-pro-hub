import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BanUserRequest {
  userId: string;
  until?: string; // ISO8601 timestamp
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

    // Check admin permissions - only ADMIN can ban
    const { data: adminRole } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!adminRole || adminRole.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Only ADMIN role can ban users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: BanUserRequest = await req.json();
    const { userId, until } = body;

    if (!userId) {
      throw new Error('Missing userId');
    }

    console.log(`🚫 Banning user ${userId}${until ? ` until ${until}` : ' indefinitely'}`);

    // Calculate ban duration
    let banDuration: string;
    if (until) {
      const now = new Date();
      const untilDate = new Date(until);
      const durationMs = untilDate.getTime() - now.getTime();
      const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
      banDuration = `${durationHours}h`;
    } else {
      banDuration = '876000h'; // ~100 years = indefinite
    }

    // Ban user using Supabase Admin API
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: banDuration
    });

    if (error) throw error;

    // Log action for audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'user.banned',
      resource: 'auth_users',
      meta: { 
        target_user_id: userId, 
        ban_until: until || 'indefinite',
        ban_duration: banDuration
      }
    });

    console.log(`✅ User banned successfully`);

    return new Response(
      JSON.stringify({ ok: true, user: data.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in admin-users-ban:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
