import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, idempotency-key, x-mt5-token",
};

// Validation schema for incoming signal
const signalIngestSchema = z.object({
  pattern: z.string().min(1).max(64),
  action: z.enum(["BUY", "SELL"]),
  symbol: z
    .string()
    .regex(/^[A-Z0-9_\/-]+$/)
    .min(1)
    .max(20),
  entry: z.number().finite(),
  tp_pips: z.number().finite(),
  sl_pips: z.number().finite(),
  timeframe: z.string().min(1).max(8),
  bar_time: z.string().datetime(),
  win_prob: z.string().max(20),
  explanation: z.string().max(500),
});

type SignalIngestPayload = z.infer<typeof signalIngestSchema>;

// System UUID for MT5 EA authored signals
const SYSTEM_AUTHOR_ID = "00000000-0000-0000-0000-000000000000";

// Calculate pip value based on symbol (simplified)
function getPipValue(symbol: string): number {
  // JPY pairs have different pip value
  if (symbol.includes("JPY")) {
    return 0.01;
  }
  return 0.0001;
}

// Calculate price levels from pips
function calculatePriceLevels(
  entry: number,
  direction: "long" | "short",
  tpPips: number,
  slPips: number,
  pipValue: number,
) {
  const tpDistance = tpPips * pipValue;
  const slDistance = slPips * pipValue;

  if (direction === "long") {
    return {
      takeProfit: entry + tpDistance,
      stopLoss: entry - slDistance,
    };
  } else {
    return {
      takeProfit: entry - tpDistance,
      stopLoss: entry + slDistance,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 🔐 NUEVO: valida TU token desde x-mt5-token (NO uses Authorization aquí)
    const mt5Token = req.headers.get("x-mt5-token") ?? "";
    const expectedToken = Deno.env.get("MT5_SECRET_TOKEN") ?? "";
    
    // 🐛 DEBUG: Logging temporal para diagnosticar el problema
    console.log("🔍 DEBUG - Token Comparison:");
    console.log("  Received token:", mt5Token.substring(0, 20) + "... (length: " + mt5Token.length + ")");
    console.log("  Expected token:", expectedToken.substring(0, 20) + "... (length: " + expectedToken.length + ")");
    console.log("  Tokens match:", mt5Token === expectedToken);
    console.log("  Headers present:", Array.from(req.headers.keys()));
    
    if (!expectedToken || mt5Token !== expectedToken) {
      console.error("❌ Authentication failed");
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log("✅ Authentication passed");

    // Idempotency: require Idempotency-Key header
    const idempotencyKey = req.headers.get("Idempotency-Key");
    if (!idempotencyKey) {
      return new Response(JSON.stringify({ ok: false, error: "missing_idempotency_key" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate UUID format for idempotency key
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(idempotencyKey)) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_idempotency_key_format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check body size (max 2KB)
    const contentLength = req.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength) > 2048) {
      return new Response(JSON.stringify({ ok: false, error: "payload_too_large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate payload
    const rawBody = await req.text();
    if (rawBody.length > 2048) {
      return new Response(JSON.stringify({ ok: false, error: "payload_too_large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: SignalIngestPayload;
    try {
      const jsonBody = JSON.parse(rawBody);
      payload = signalIngestSchema.parse(jsonBody);
    } catch (error) {
      console.error("Validation error:", error);
      return new Response(
        JSON.stringify({
          ok: false,
          error: "validation_error",
          details: error instanceof z.ZodError ? error.errors : "invalid_json",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for existing signal with same dedup_key (idempotency)
    const { data: existing, error: checkError } = await supabase
      .from("signals")
      .select("id")
      .eq("dedup_key", idempotencyKey)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing signal:", checkError);
      return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If signal already exists, return success with duplicated flag
    if (existing) {
      console.log(`Duplicate signal detected: ${idempotencyKey}`);
      return new Response(JSON.stringify({ ok: true, duplicated: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate price levels
    const direction = payload.action === "BUY" ? "long" : "short";
    const pipValue = getPipValue(payload.symbol);
    const { takeProfit, stopLoss } = calculatePriceLevels(
      payload.entry,
      direction,
      payload.tp_pips,
      payload.sl_pips,
      pipValue,
    );

    // Construct logic field
    const logic = `${payload.pattern}. ${payload.explanation} Win probability: ${payload.win_prob}. Bar time: ${payload.bar_time}. TP: ${payload.tp_pips} pips, SL: ${payload.sl_pips} pips.`;

    // Insert new signal
    const { error: insertError } = await supabase.from("signals").insert({
      author_id: SYSTEM_AUTHOR_ID,
      symbol: payload.symbol,
      timeframe: payload.timeframe,
      direction,
      entry_price: payload.entry,
      stop_loss: stopLoss,
      take_profit: takeProfit,
      logic,
      status: "published",
      result: "pending",
      source: "mt5_ea",
      dedup_key: idempotencyKey,
    });

    if (insertError) {
      // Check if it's a unique constraint violation (race condition)
      if (insertError.code === "23505" && insertError.message?.includes("dedup_key")) {
        console.log(`Race condition detected for: ${idempotencyKey}`);
        return new Response(JSON.stringify({ ok: true, duplicated: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.error("Error inserting signal:", insertError);
      return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Audit log (minimal, no PII)
    console.log("Signal inserted successfully", {
      dedup_key: idempotencyKey,
      symbol: payload.symbol,
      action: payload.action,
      received_at: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "unknown",
      ua: req.headers.get("user-agent")?.substring(0, 50) || "unknown",
    });

    return new Response(JSON.stringify({ ok: true, inserted: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
