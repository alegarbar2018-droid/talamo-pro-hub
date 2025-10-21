import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
};

const UpdateProfileSchema = z.object({
  userId: z.string().uuid(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
  language: z.string().optional(),
  affiliation: z.string().optional().nullable(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin permission - ADMIN role always has access
    const { data: currentRole } = await supabase.rpc('get_current_admin_role');
    
    if (currentRole !== 'ADMIN') {
      const { data: hasPermission, error: permError } = await supabase.rpc('has_admin_permission', {
        _resource: 'users',
        _action: 'update_profile'
      });

      if (permError || !hasPermission) {
        console.error(`[${requestId}] Permission denied for user ${caller.id}:`, permError);
        return new Response(
          JSON.stringify({ error: 'Forbidden: Admin privileges required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`[${requestId}] Permission check passed for role: ${currentRole}`);

    // Parse and validate body
    const body = await req.json();
    const validated = UpdateProfileSchema.parse(body);

    console.log(`[${requestId}] Updating profile for user: ${validated.userId}`);

    // Build update object (only include fields that were sent)
    const updateData: any = {};
    if (validated.first_name !== undefined) updateData.first_name = validated.first_name;
    if (validated.last_name !== undefined) updateData.last_name = validated.last_name;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.avatar_url !== undefined) updateData.avatar_url = validated.avatar_url;
    if (validated.bio !== undefined) updateData.bio = validated.bio;
    if (validated.language !== undefined) updateData.language = validated.language;

    // Update profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', validated.userId)
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // Handle affiliation if provided
    if (validated.affiliation !== undefined) {
      if (validated.affiliation) {
        await supabase
          .from('affiliations')
          .upsert({
            user_id: validated.userId,
            partner_id: validated.affiliation,
            is_affiliated: true,
          }, {
            onConflict: 'user_id'
          });
      } else {
        // Remove affiliation
        await supabase
          .from('affiliations')
          .update({ is_affiliated: false })
          .eq('user_id', validated.userId);
      }
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      actor_id: caller.id,
      action: 'user.profile_updated',
      resource: 'user',
      meta: {
        target_user_id: validated.userId,
        changes: updateData,
        request_id: requestId,
      }
    });

    console.log(`[${requestId}] Profile updated successfully`);

    return new Response(
      JSON.stringify({
        ok: true,
        profile,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
