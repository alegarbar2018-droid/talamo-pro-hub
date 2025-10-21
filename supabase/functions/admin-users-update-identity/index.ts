import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
};

const UpdateIdentitySchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  email_confirm: z.boolean().default(false),
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

    // Check admin permission
    const { data: hasPermission, error: permError } = await supabase.rpc('has_admin_permission', {
      _resource: 'users',
      _action: 'update_identity'
    });

    if (permError || !hasPermission) {
      console.error(`[${requestId}] Permission denied for user ${caller.id}:`, permError);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin privileges required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate body
    const body = await req.json();
    const validated = UpdateIdentitySchema.parse(body);

    console.log(`[${requestId}] Updating identity for user: ${validated.userId}`);

    // Build update object
    const updateData: any = {};
    if (validated.email) updateData.email = validated.email;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.email && validated.email_confirm) {
      updateData.email_confirm = true;
    }

    // Update auth.users
    const { data: user, error: updateError } = await supabase.auth.admin.updateUserById(
      validated.userId,
      updateData
    );

    if (updateError) {
      throw updateError;
    }

    // Update email in profiles if changed
    if (validated.email) {
      await supabase
        .from('profiles')
        .update({ email: validated.email })
        .eq('user_id', validated.userId);
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      actor_id: caller.id,
      action: 'user.identity_updated',
      resource: 'user',
      meta: {
        target_user_id: validated.userId,
        changes: updateData,
        request_id: requestId,
      }
    });

    console.log(`[${requestId}] Identity updated successfully`);

    return new Response(
      JSON.stringify({
        ok: true,
        user: user.user,
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
