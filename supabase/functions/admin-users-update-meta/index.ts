import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateMetaRequest {
  userId: string;
  name?: string;
  affiliation?: string;
  email?: string;
  phone?: string;
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

    const body: UpdateMetaRequest = await req.json();
    const { userId, name, affiliation, email, phone } = body;

    if (!userId) {
      throw new Error('Missing userId');
    }

    console.log(`📝 Updating metadata for user ${userId}`);

    // Build update object
    const updates: any = {};
    if (name) {
      const [firstName, ...lastNameParts] = name.split(' ');
      updates.first_name = firstName;
      updates.last_name = lastNameParts.join(' ');
    }
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    // Update profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (profileError) throw profileError;

    // Update affiliation if provided
    if (affiliation !== undefined) {
      const { error: affError } = await supabase
        .from('affiliations')
        .upsert({
          user_id: userId,
          partner_id: affiliation,
          is_affiliated: !!affiliation
        }, {
          onConflict: 'user_id'
        });

      if (affError) console.error('Warning: Could not update affiliation:', affError);
    }

    // Log action for audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'user.meta_updated',
      resource: 'profiles',
      meta: { 
        target_user_id: userId,
        updated_fields: Object.keys(updates)
      }
    });

    console.log(`✅ Metadata updated successfully`);

    return new Response(
      JSON.stringify({ ok: true, user: profile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in admin-users-update-meta:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
