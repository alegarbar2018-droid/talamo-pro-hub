// Edge function for Exness affiliation validation
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidationRequest {
  email?: string;
  uid?: string;
}

interface ValidationResult {
  affiliation: boolean;
  accounts?: string[];
  client_uid?: string | null;
  partnerId?: string | null;
  source: "exness" | "demo-bypass";
}

// JWT Token cache
let tokenCache: { token: string; expires: number } | null = null;
const TOKEN_TTL = 10 * 60 * 1000; // 10 minutes

// Demo bypass check
function isDemo(email: string): boolean {
  return /demo|exness/i.test(email);
}

// Get cached JWT or login to get new one
async function getJWT(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if valid
  if (tokenCache && now < tokenCache.expires) {
    return tokenCache.token;
  }

  const apiBase = Deno.env.get("PARTNER_API_BASE");
  const apiUser = Deno.env.get("PARTNER_API_USER");
  const apiPassword = Deno.env.get("PARTNER_API_PASSWORD");

  if (!apiBase || !apiUser || !apiPassword) {
    throw new Error("AUTH_CREDENTIALS_MISSING");
  }

  const response = await fetch(`${apiBase}/auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: apiUser,
      password: apiPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(`AUTH_${response.status}`);
  }

  const data = await response.json().catch(() => ({}));
  const token = data?.token || data?.access;
  
  if (!token) {
    throw new Error("AUTH_NO_TOKEN");
  }

  // Cache token
  tokenCache = {
    token,
    expires: now + TOKEN_TTL,
  };

  return token;
}

// Call Exness affiliation API
async function callAffiliationAPI(email: string, jwt: string): Promise<Response> {
  const apiBase = Deno.env.get("PARTNER_API_BASE");
  
  return await fetch(`${apiBase}/partner/affiliation/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `JWT ${jwt}`,
    },
    body: JSON.stringify({ email }),
  });
}

// Main validation handler
async function handleValidation(email: string, uid?: string): Promise<Response> {
  const partnerId = Deno.env.get("EXNESS_PARTNER_ID") || "1141465940423171000";

  // 1) DEMO BYPASS - always return success for demo emails
  if (isDemo(email)) {
    const result: ValidationResult = {
      affiliation: true,
      accounts: ["DEMO-ACC-001"],
      client_uid: uid || "demo-user",
      partnerId,
      source: "demo-bypass",
    };
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // 2) Check if Partner API is enabled
  const usePartnerApi = Deno.env.get("USE_PARTNER_API") === "true";
  
  if (!usePartnerApi) {
    return new Response(
      JSON.stringify({ code: "PartnerApiDisabled" }),
      { 
        status: 503, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    // Get JWT token
    let jwt = await getJWT();
    let response = await callAffiliationAPI(email, jwt);

    // Handle token expiration - retry once
    if (response.status === 401) {
      tokenCache = null; // Clear expired token
      jwt = await getJWT();
      response = await callAffiliationAPI(email, jwt);
    }

    // Handle different response codes
    switch (response.status) {
      case 429:
        return new Response(
          JSON.stringify({ code: "Throttled" }),
          { 
            status: 429, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );

      case 401:
        return new Response(
          JSON.stringify({ code: "Unauthorized" }),
          { 
            status: 401, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );

      case 400:
        return new Response(
          JSON.stringify({ code: "BadRequest" }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return new Response(
        JSON.stringify({ 
          code: "UpstreamError", 
          status: response.status, 
          body 
        }),
        { 
          status: response.status, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Parse successful response
    const data = await response.json().catch(() => ({}));
    
    if (!data?.affiliation) {
      return new Response(
        JSON.stringify({ 
          code: "NotAffiliated", 
          affiliation: false,
          client_uid: data?.client_uid || uid,
          accounts: data?.accounts || []
        }),
        { 
          status: 403, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Success response
    const result: ValidationResult = {
      affiliation: true,
      accounts: data.accounts || [],
      client_uid: data.client_uid || uid,
      partnerId,
      source: "exness",
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Exness API error:", error);
    
    return new Response(
      JSON.stringify({ 
        code: "ServerError", 
        message: error.message || "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
}

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Function called with method:", req.method);
  console.log("Environment variables check:", {
    USE_PARTNER_API: Deno.env.get("USE_PARTNER_API"),
    PARTNER_API_BASE: !!Deno.env.get("PARTNER_API_BASE"),
    PARTNER_API_USER: !!Deno.env.get("PARTNER_API_USER"),
    PARTNER_API_PASSWORD: !!Deno.env.get("PARTNER_API_PASSWORD"),
    EXNESS_PARTNER_ID: !!Deno.env.get("EXNESS_PARTNER_ID")
  });

  try {
    let email: string;
    let uid: string | undefined;

    // Handle both POST and GET requests
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      email = body?.email;
      uid = body?.uid;
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      email = url.searchParams.get("email") || "";
      uid = url.searchParams.get("uid") || undefined;
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
      return new Response(
        JSON.stringify({ code: "BadRequest", message: "email requerido" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Process validation
    return await handleValidation(email, uid);

  } catch (error: any) {
    console.error("Request handler error:", error);
    return new Response(
      JSON.stringify({ 
        code: "ServerError", 
        message: error.message || "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);