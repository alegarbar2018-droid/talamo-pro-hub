// Edge function for Exness affiliation validation
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simplified validation for testing
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("=== Function Called ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  try {
    let email: string;

    // Handle both POST and GET requests
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      email = body?.email;
      console.log("POST body:", body);
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      email = url.searchParams.get("email") || "";
      console.log("GET email param:", email);
    } else {
      return new Response(
        JSON.stringify({ code: "BadRequest", message: "Method not allowed" }),
        { 
          status: 405, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Validate email parameter
    if (!email || typeof email !== "string") {
      console.log("Missing or invalid email:", email);
      return new Response(
        JSON.stringify({ code: "BadRequest", message: "email requerido" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    console.log("Processing email:", email);

    // Check environment variables
    const envCheck = {
      USE_PARTNER_API: Deno.env.get("USE_PARTNER_API"),
      PARTNER_API_BASE: !!Deno.env.get("PARTNER_API_BASE"),
      PARTNER_API_USER: !!Deno.env.get("PARTNER_API_USER"),
      PARTNER_API_PASSWORD: !!Deno.env.get("PARTNER_API_PASSWORD"),
      EXNESS_PARTNER_ID: Deno.env.get("EXNESS_PARTNER_ID")
    };
    console.log("Environment variables:", envCheck);

    // Demo bypass check
    const isDemo = /demo|exness/i.test(email);
    console.log("Is demo email:", isDemo);

    if (isDemo) {
      const result = {
        affiliation: true,
        accounts: ["DEMO-ACC-001"],
        client_uid: "demo-user",
        partnerId: envCheck.EXNESS_PARTNER_ID,
        source: "demo-bypass",
      };
      console.log("Demo bypass result:", result);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // For now, return a simple "not implemented" for real API
    console.log("Real API not implemented in test version");
    return new Response(
      JSON.stringify({ 
        code: "NotAffiliated", 
        affiliation: false,
        message: "API real en desarrollo - usa email con 'demo' o 'exness'" 
      }),
      { 
        status: 403, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("=== ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Error object:", error);
    
    return new Response(
      JSON.stringify({ 
        code: "ServerError", 
        message: error.message || "Internal server error",
        debug: error.stack
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);