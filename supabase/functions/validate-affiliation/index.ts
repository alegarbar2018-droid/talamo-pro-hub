// Edge function for Exness affiliation validation - ultra minimal with timeout
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// JWT token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Timeout for all external API calls
const API_TIMEOUT = 8000; // 8 seconds

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
  
  return cachedToken;
}

// Check affiliation with Exness API with timeout
async function checkExnessAffiliation(email: string, retryCount = 0): Promise<any> {
  const apiBase = Deno.env.get("PARTNER_API_BASE");
  
  if (!apiBase) {
    throw new Error("PARTNER_API_BASE not configured");
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
      // Map specific error codes
      if (response.status === 401) {
        throw new Error("unauthorized_broker");
      } else if (response.status === 429) {
        throw new Error("rate_limited");
      } else if (response.status >= 500) {
        throw new Error("broker_down");
      } else {
        throw new Error("bad_broker_response");
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON response:", responseText);
      throw new Error("bad_broker_response");
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error("Request timed out");
      throw new Error("timeout");
    }
    
    console.error("Error in checkExnessAffiliation:", error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("=== Validate Affiliation Function ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  try {      
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
    console.log("Processing email:", email);

    // Environment variables check
    const usePartnerAPI = Deno.env.get("USE_PARTNER_API");
    const partnerId = Deno.env.get("EXNESS_PARTNER_ID");
    
    console.log("Environment check:", {
      USE_PARTNER_API: usePartnerAPI,
      HAS_PARTNER_API_BASE: !!Deno.env.get("PARTNER_API_BASE"),
      HAS_PARTNER_API_USER: !!Deno.env.get("PARTNER_API_USER"),
      HAS_PARTNER_API_PASSWORD: !!Deno.env.get("PARTNER_API_PASSWORD"),
      EXNESS_PARTNER_ID: partnerId
    });

    // Demo bypass check (case-insensitive)
    const isDemo = /demo|exness/i.test(email);
    console.log("Demo bypass check:", { email, isDemo });

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
          code: "NotAffiliated", 
          affiliation: false,
          message: "API de validación deshabilitada - contacta soporte" 
        }),
        { 
          status: 403, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Call real Exness API
    try {
      console.log("Calling real Exness API for:", email);
      const affiliationData = await checkExnessAffiliation(email);
      
      console.log("Affiliation data received:", affiliationData);

      if (affiliationData.affiliation === true) {
        const result = {
          affiliation: true,
          accounts: affiliationData.accounts || [],
          client_uid: affiliationData.client_uid || null,
          partnerId: partnerId,
          source: "exness-api",
        };
        console.log("Affiliation successful:", result);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } else {
        console.log("User not affiliated");
        return new Response(
          JSON.stringify({ 
            code: "NotAffiliated", 
            affiliation: false,
            message: "Email no afiliado al partner Tálamo" 
          }),
          { 
            status: 403, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
    } catch (apiError: any) {
      console.error("API Error:", apiError.message);
      
      // Map error codes to user-friendly messages
      const errorMap: Record<string, { status: number; message: string }> = {
        timeout: { 
          status: 504, 
          message: "El bróker tardó demasiado. Intenta de nuevo." 
        },
        rate_limited: { 
          status: 429, 
          message: "Demasiadas solicitudes. Espera un momento e intenta de nuevo." 
        },
        broker_down: { 
          status: 502, 
          message: "Servicio del bróker con incidencias. Intenta más tarde." 
        },
        unauthorized_broker: { 
          status: 401, 
          message: "No autenticado con el bróker. Reintenta en unos minutos." 
        },
        bad_broker_response: { 
          status: 500, 
          message: "Respuesta inválida del bróker. Contacta soporte." 
        }
      };

      const errorInfo = errorMap[apiError.message] || {
        status: 500,
        message: "Error interno del servidor"
      };

      return new Response(
        JSON.stringify({ 
          code: apiError.message,
          message: errorInfo.message
        }),
        { 
          status: errorInfo.status, 
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