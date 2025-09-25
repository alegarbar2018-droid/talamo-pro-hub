// Edge function for Exness affiliation validation
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// JWT token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Get JWT token from Exness API
async function getExnessToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if still valid (10 minutes cache)
  if (cachedToken && now < tokenExpiry) {
    console.log("Using cached token");
    return cachedToken;
  }

  const apiBase = Deno.env.get("PARTNER_API_BASE");
  const apiUser = Deno.env.get("PARTNER_API_USER");
  const apiPassword = Deno.env.get("PARTNER_API_PASSWORD");

  if (!apiBase || !apiUser || !apiPassword) {
    throw new Error("Missing API credentials in environment variables");
  }

  console.log("Requesting new JWT token from:", `${apiBase}/auth/`);

  const response = await fetch(`${apiBase}/auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: apiUser,
      password: apiPassword,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token request failed:", response.status, errorText);
    throw new Error(`Authentication failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log("Token response:", { status: response.status, hasToken: !!data.token });

  if (!data.token) {
    throw new Error("No token received from authentication");
  }

  // Cache token for 10 minutes
  cachedToken = data.token;
  tokenExpiry = now + (10 * 60 * 1000);
  
  return cachedToken || '';
}

// Check affiliation with Exness API
async function checkExnessAffiliation(email: string, retryCount = 0): Promise<any> {
  const apiBase = Deno.env.get("PARTNER_API_BASE");
  
  if (!apiBase) {
    throw new Error("PARTNER_API_BASE not configured");
  }

  try {
    const token = await getExnessToken();
    
    console.log("Checking affiliation for:", email);
    
    const response = await fetch(`${apiBase}/partner/affiliation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    // Handle token expiry with retry
    if (response.status === 401 && retryCount === 0) {
      console.log("Token expired, clearing cache and retrying");
      cachedToken = null;
      tokenExpiry = 0;
      return await checkExnessAffiliation(email, 1);
    }

    const responseText = await response.text();
    console.log("Affiliation API response:", { 
      status: response.status, 
      body: responseText.substring(0, 200) 
    });

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        throw new Error("Unauthorized - Invalid credentials");
      } else if (response.status === 429) {
        throw new Error("Rate limited - Too many requests");
      } else if (response.status >= 500) {
        throw new Error(`Upstream error: ${response.status}`);
      } else {
        throw new Error(`API error: ${response.status} ${responseText}`);
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON response:", responseText);
      throw new Error("Invalid JSON response from API");
    }

    return data;
  } catch (error) {
    console.error("Error in checkExnessAffiliation:", error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("=== Validate Affiliation Function Started ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("Timestamp:", new Date().toISOString());

  try {
    // Initialize Supabase Client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    let email: string;

    // Handle both POST and GET requests
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      email = body?.email;
      console.log("POST body received:", { hasEmail: !!email });
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
    if (!email || typeof email !== "string" || !email.trim()) {
      console.log("Missing or invalid email:", email);
      return new Response(
        JSON.stringify({ code: "BadRequest", message: "email requerido" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    email = email.trim().toLowerCase();
    console.log("✅ Processing email:", email);
    console.log("Request processing time so far:", Date.now() - new Date().getTime(), "ms");

    // Skip user existence check for now to not block validation
    // TODO: Implement user existence check after fixing admin API pagination
    console.log("⏭️ Skipping user existence check to not block API validation");
    console.log("🔍 Proceeding directly to affiliation validation for:", email);

    // Environment variables check
    const usePartnerAPI = Deno.env.get("USE_PARTNER_API");
    const partnerId = Deno.env.get("EXNESS_PARTNER_ID");
    
    console.log("🔧 Environment variables check:", {
      USE_PARTNER_API: usePartnerAPI,
      HAS_PARTNER_API_BASE: !!Deno.env.get("PARTNER_API_BASE"),
      HAS_PARTNER_API_USER: !!Deno.env.get("PARTNER_API_USER"),
      HAS_PARTNER_API_PASSWORD: !!Deno.env.get("PARTNER_API_PASSWORD"),
      ALLOW_DEMO: Deno.env.get("ALLOW_DEMO"),
      EXNESS_PARTNER_ID: partnerId,
      PARTNER_API_BASE_VALUE: Deno.env.get("PARTNER_API_BASE")?.substring(0, 50) + "..."
    });

    // Demo bypass check (only if ALLOW_DEMO is enabled)
    const allowDemo = Deno.env.get("ALLOW_DEMO");
    const isDemo = allowDemo === "1" && /demo|exness/i.test(email);
    console.log("Demo bypass check:", { email, isDemo, allowDemo });

    if (isDemo) {
      const result = {
        affiliation: true,
        accounts: ["DEMO-ACC-001"],
        client_uid: "demo-user",
        partnerId: partnerId,
        source: "demo-bypass",
      };
      console.log("Demo bypass result:", result);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if real API is enabled
    if (usePartnerAPI !== "true") {
      console.log("Partner API disabled, returning not affiliated");
      return new Response(
        JSON.stringify({ 
          affiliation: false,
          message: "API de validación deshabilitada - contacta soporte" 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Call real Exness API
    try {
      console.log("🚀 Starting real Exness API call for:", email);
      console.log("API Base URL:", Deno.env.get("PARTNER_API_BASE"));
      const affiliationData = await checkExnessAffiliation(email);
      
      console.log("Raw affiliation data received:", JSON.stringify(affiliationData, null, 2));

      // Handle successful affiliation
      if (affiliationData && affiliationData.affiliation === true) {
        const result = {
          affiliation: true,
          accounts: affiliationData.accounts || [],
          client_uid: affiliationData.client_uid || affiliationData.clientUid || null,
          partnerId: partnerId,
          source: "exness-api",
        };
        console.log("✅ Affiliation validated successfully:", result);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } 
      
      // Handle explicit non-affiliation or any other response format
      console.log("❌ User not affiliated or unexpected response format");
      return new Response(
        JSON.stringify({ 
          affiliation: false,
          message: "Email no afiliado al partner Tálamo" 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );

    } catch (apiError: any) {
      console.error("🚨 CRITICAL API ERROR:", {
        message: apiError.message,
        stack: apiError.stack,
        name: apiError.name,
        timestamp: new Date().toISOString()
      });
      
      // Handle specific HTTP errors with consistent responses
      if (apiError.message.includes("401") || apiError.message.includes("Unauthorized")) {
        console.log("🔐 Authentication error with Exness API");
        return new Response(
          JSON.stringify({ 
            code: "Unauthorized", 
            message: "Error de autenticación con el bróker" 
          }),
          { 
            status: 401, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      } 
      
      if (apiError.message.includes("429") || apiError.message.includes("Rate limited")) {
        console.log("🚫 Rate limit hit");
        return new Response(
          JSON.stringify({ 
            code: "RateLimited", 
            message: "Demasiadas solicitudes, intenta más tarde" 
          }),
          { 
            status: 429, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      } 
      
      if (apiError.message.includes("500") || apiError.message.includes("502") || apiError.message.includes("Upstream error")) {
        console.log("🌐 Upstream server error");
        return new Response(
          JSON.stringify({ 
            code: "BrokerDown", 
            message: "Servicio temporalmente no disponible" 
          }),
          { 
            status: 502, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }

      // For any other error, return as not affiliated to show user options
      console.log("🔄 Generic error, returning not affiliated to show user options");
      return new Response(
        JSON.stringify({ 
          affiliation: false,
          message: "No se pudo validar la afiliación en este momento" 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

  } catch (error: any) {
    console.error("=== CRITICAL ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        code: "ServerError", 
        message: "Error crítico del servidor",
        debug: error.message
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);