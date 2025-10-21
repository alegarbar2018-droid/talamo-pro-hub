import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
};

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  invite: z.boolean().default(false),
  email_confirm: z.boolean().default(false),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'ANALYST', 'CONTENT', 'SUPPORT', 'USER']).default('USER'),
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

    // Check admin permission
    const { data: hasPermission, error: permError } = await supabase.rpc('has_admin_permission', {
      _resource: 'users',
      _action: 'create'
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
    const validated = CreateUserSchema.parse(body);

    console.log(`[${requestId}] Creating user: ${validated.email}, invite=${validated.invite}`);

    let authUser;

    // Create user in auth
    if (validated.invite) {
      // Invite flow
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(validated.email, {
        data: {
          first_name: validated.first_name,
          last_name: validated.last_name,
        }
      });

      if (error) {
        if (error.message?.includes('already registered')) {
          return new Response(
            JSON.stringify({ error: 'Email already exists', code: 'user_exists' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw error;
      }

      authUser = data.user;
    } else {
      // Direct creation with password
      if (!validated.password) {
        return new Response(
          JSON.stringify({ error: 'Password required when invite=false' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: validated.email,
        password: validated.password,
        email_confirm: validated.email_confirm,
        user_metadata: {
          first_name: validated.first_name,
          last_name: validated.last_name,
        }
      });

      if (error) {
        if (error.message?.includes('already registered') || error.message?.includes('duplicate')) {
          return new Response(
            JSON.stringify({ error: 'Email already exists', code: 'user_exists' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw error;
      }

      authUser = data.user;
    }

    if (!authUser) {
      throw new Error('Failed to create user');
    }

    console.log(`[${requestId}] Auth user created: ${authUser.id}`);

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: authUser.id,
        email: validated.email,
        first_name: validated.first_name,
        last_name: validated.last_name,
        phone: validated.phone,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (profileError) {
      console.error(`[${requestId}] Profile creation error:`, profileError);
    }

    // Assign admin role
    const { data: adminRole, error: roleError } = await supabase
      .from('admin_users')
      .upsert({
        user_id: authUser.id,
        role: validated.role,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (roleError) {
      console.error(`[${requestId}] Role assignment error:`, roleError);
    }

    // Handle affiliation if provided
    if (validated.affiliation) {
      const { error: affError } = await supabase
        .from('affiliations')
        .upsert({
          user_id: authUser.id,
          email: validated.email,
          partner_id: validated.affiliation,
          is_affiliated: true,
        }, {
          onConflict: 'user_id'
        });

      if (affError) {
        console.error(`[${requestId}] Affiliation error:`, affError);
      }
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      actor_id: caller.id,
      action: 'user.created',
      resource: 'user',
      meta: {
        target_user_id: authUser.id,
        email: validated.email,
        role: validated.role,
        invite: validated.invite,
        request_id: requestId,
      }
    });

    console.log(`[${requestId}] User created successfully`);

    return new Response(
      JSON.stringify({
        ok: true,
        user: authUser,
        profile: profile || null,
        role: validated.role,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
