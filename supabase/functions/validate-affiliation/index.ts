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
  isAffiliated: boolean;
  partnerId?: string | null;
  partnerIdMatch: boolean;
  clientUid?: string | null;
  accounts?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, uid }: ValidationRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const usePartnerApi = Deno.env.get("USE_PARTNER_API") === "true";
    const partnerId = Deno.env.get("EXNESS_PARTNER_ID") || "1141465940423171000";

    if (usePartnerApi) {
      // Use real Exness Partner API
      const apiBase = Deno.env.get("PARTNER_API_BASE");
      const apiUser = Deno.env.get("PARTNER_API_USER");
      const apiPassword = Deno.env.get("PARTNER_API_PASSWORD");

      if (!apiBase || !apiUser || !apiPassword) {
        throw new Error("Partner API credentials not configured");
      }

      // Login to get token
      const loginResponse = await fetch(`${apiBase}/auth/`, {
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

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.status}`);
      }

      const loginData = await loginResponse.json();
      const token = loginData.token || loginData.access;

      if (!token) {
        throw new Error("No token received from login");
      }

      // Check affiliation
      const affiliationResponse = await fetch(`${apiBase}/partner/affiliation/`, {
        method: "POST",
        headers: {
          "Authorization": `JWT ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!affiliationResponse.ok) {
        if (affiliationResponse.status === 429) {
          // Rate limited, wait and retry once
          await new Promise(resolve => setTimeout(resolve, 500));
          const retryResponse = await fetch(`${apiBase}/partner/affiliation/`, {
            method: "POST",
            headers: {
              "Authorization": `JWT ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          
          if (!retryResponse.ok) {
            throw new Error(`Affiliation check failed after retry: ${retryResponse.status}`);
          }
          
          const retryData = await retryResponse.json();
          const result: ValidationResult = {
            isAffiliated: retryData.affiliation || false,
            partnerId: retryData.affiliation ? partnerId : null,
            partnerIdMatch: retryData.affiliation || false,
            clientUid: retryData.client_uid || uid || null,
            accounts: retryData.accounts || [],
          };

          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
        
        throw new Error(`Affiliation check failed: ${affiliationResponse.status}`);
      }

      const affiliationData = await affiliationResponse.json();
      const result: ValidationResult = {
        isAffiliated: affiliationData.affiliation || false,
        partnerId: affiliationData.affiliation ? partnerId : null,
        partnerIdMatch: affiliationData.affiliation || false,
        clientUid: affiliationData.client_uid || uid || null,
        accounts: affiliationData.accounts || [],
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } else {
      // Fallback: check against CSV data in database
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Look for affiliation in the reports table
      const { data: reports, error } = await supabase
        .from('affiliation_reports')
        .select('*')
        .or(`email.eq.${email},uid.eq.${uid || ''}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Database error:', error);
        throw new Error('Database query failed');
      }

      const isAffiliated = reports && reports.length > 0 && 
        (reports[0].status === 'affiliated' || reports[0].partner_id === partnerId);

      const result: ValidationResult = {
        isAffiliated,
        partnerId: isAffiliated ? partnerId : null,
        partnerIdMatch: isAffiliated,
        clientUid: reports?.[0]?.uid || uid || null,
        accounts: isAffiliated ? ['demo_account'] : [],
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        isAffiliated: false,
        partnerId: null,
        partnerIdMatch: false,
        clientUid: null,
        accounts: []
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);