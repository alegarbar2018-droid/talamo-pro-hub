import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ ok: false, error: "user_id_required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify caller is ADMIN
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !caller) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ ok: false, error: "invalid_token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify ADMIN role
    const { data: adminUser, error: roleError } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", caller.id)
      .single();

    if (roleError || !adminUser || adminUser.role !== "ADMIN") {
      console.error("Role check failed:", roleError);
      return new Response(JSON.stringify({ ok: false, error: "insufficient_permissions" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get target user email
    const { data: targetUser, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !targetUser?.user?.email) {
      console.error("Error fetching user:", userError);
      return new Response(JSON.stringify({ ok: false, error: "user_not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Generate password reset link
    const { data: linkData, error: resetError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: targetUser.user.email,
    });

    if (resetError || !linkData?.properties?.action_link) {
      console.error("Error generating reset link:", resetError);
      return new Response(JSON.stringify({ ok: false, error: "reset_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Send email using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ ok: false, error: "email_config_missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const resend = new Resend(resendApiKey);
    const resetLink = linkData.properties.action_link;

    try {
      await resend.emails.send({
        from: "Tálamo <noreply@talamo.app>",
        to: [targetUser.user.email],
        subject: "Restablece tu contraseña - Tálamo",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Restablece tu contraseña</h2>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Tálamo.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #0EA5E9; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
              Este enlace expirará en 1 hora.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        `,
      });

      console.log(`Password reset email sent to ${targetUser.user.email} by admin ${caller.id}`);
    } catch (emailError) {
      console.error("Error sending email via Resend:", emailError);
      return new Response(JSON.stringify({ ok: false, error: "email_send_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Log action to audit_logs
    await supabase.from("audit_logs").insert({
      actor_id: caller.id,
      action: "admin.password_reset",
      resource: "user",
      meta: {
        target_user_id: userId,
        target_email: targetUser.user.email,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Password reset email sent",
      email: targetUser.user.email 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("admin-users-reset-password error:", error);
    return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
