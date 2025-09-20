// Edge function for CSV import and affiliation management
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get JWT token from request
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: user, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    // Check if user has admin role
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.user.id)
      .eq('role', 'admin');

    if (roleError || !roles || roles.length === 0) {
      return new Response("Forbidden - Admin role required", { status: 403, headers: corsHeaders });
    }

    const formData = await req.formData();
    const file = formData.get("csv_file") as File;

    if (!file) {
      return new Response("No CSV file provided", { status: 400, headers: corsHeaders });
    }

    const csvText = await file.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Expected headers: email, uid, partner_id, status, created_at
    const emailIndex = headers.indexOf('email');
    const uidIndex = headers.indexOf('uid');
    const partnerIdIndex = headers.indexOf('partner_id');
    const statusIndex = headers.indexOf('status');

    if (emailIndex === -1) {
      return new Response("CSV must contain 'email' column", { status: 400, headers: corsHeaders });
    }

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length >= headers.length) {
        records.push({
          email: values[emailIndex] || null,
          uid: uidIndex >= 0 ? values[uidIndex] || null : null,
          partner_id: partnerIdIndex >= 0 ? values[partnerIdIndex] || null : null,
          status: statusIndex >= 0 ? values[statusIndex] || 'unknown' : 'unknown',
        });
      }
    }

    if (records.length === 0) {
      return new Response("No valid records found in CSV", { status: 400, headers: corsHeaders });
    }

    // Insert records into database
    const { data, error } = await supabase
      .from('affiliation_reports')
      .insert(records);

    if (error) {
      console.error('Database insert error:', error);
      return new Response("Failed to import CSV data", { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ 
      message: `Successfully imported ${records.length} records`,
      imported_count: records.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("CSV import error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);