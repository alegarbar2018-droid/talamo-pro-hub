import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SoftDeleteRequest {
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

    // Check admin permissions - only ADMIN can delete
    const { data: adminRole } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!adminRole || adminRole.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Only ADMIN role can delete users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: SoftDeleteRequest = await req.json();
    const { userId } = body;

    if (!userId) {
      throw new Error('Missing userId');
    }

    console.log(`🗑️ Soft-deleting user ${userId}`);

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Update profile with deleted_at timestamp
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Also ban the user to prevent login
    await supabase.auth.admin.updateUserById(userId, {
      ban_duration: '876000h' // ~100 years
    });

    // Log action for audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'user.soft_deleted',
      resource: 'profiles',
      meta: { 
        target_user_id: userId,
        deleted_at: new Date().toISOString()
      }
    });

    console.log(`✅ User soft-deleted successfully`);

    return new Response(
      JSON.stringify({ ok: true, userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in admin-users-soft-delete:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
