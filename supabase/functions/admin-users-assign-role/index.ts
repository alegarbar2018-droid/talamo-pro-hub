import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssignRoleRequest {
  userId: string;
  role: string;
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

    // Check admin permissions
    const { data: hasPermission } = await supabase.rpc('has_admin_permission', {
      _resource: 'users',
      _action: 'manage'
    });

    if (!hasPermission) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: AssignRoleRequest = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      throw new Error('Missing userId or role');
    }

    console.log(`👤 Assigning role ${role} to user ${userId}`);

    // Check if admin_users record exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existingAdmin) {
      // Update existing record
      const { data, error } = await supabase
        .from('admin_users')
        .update({ role })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('admin_users')
        .insert({ user_id: userId, role })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    // Log action for audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'user.role_assigned',
      resource: 'admin_users',
      meta: { target_user_id: userId, new_role: role }
    });

    console.log(`✅ Role ${role} assigned successfully`);

    return new Response(
      JSON.stringify({ ok: true, user: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in admin-users-assign-role:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
