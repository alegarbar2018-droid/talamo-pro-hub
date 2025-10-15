import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, idempotency-key, x-mt5-token",
};

// Validation schema for incoming signal with strict validation
const signalIngestSchema = z.object({
  pattern: z.string().min(1).max(64),
  action: z.enum(["BUY", "SELL"]),
  symbol: z
    .string()
    .regex(/^[A-Z0-9_\/-]+$/)
    .min(1)
    .max(20),
  entry: z.number().finite().positive(),
  tp_pips: z.number().int().positive(),
  sl_pips: z.number().int().positive(),
  timeframe: z.string().regex(/^(M1|M5|M15|M30|H1|H4|D1|W1|MN1)$/).max(8),
  bar_time: z.string().datetime(),
  win_prob: z.string().regex(/^\d+%$/).max(20),
  explanation: z.string().min(1).max(500),
});

type SignalIngestPayload = z.infer<typeof signalIngestSchema>;

// System UUID for MT5 EA authored signals (now handled by DB default)
// const SYSTEM_AUTHOR_ID = "00000000-0000-0000-0000-000000000000";

// Rate limiter: 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }); // 60 sec window
    return { allowed: true };
  }
  
  if (limit.count >= 10) {
    const retryAfter = Math.ceil((limit.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  limit.count++;
  return { allowed: true };
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimitMap.entries()) {
    if (now > limit.resetAt) rateLimitMap.delete(ip);
  }
}, 300000);

// Calculate pip value based on symbol
function getPipValue(symbol: string): number {
  // JPY pairs have different pip value (2 decimals)
  if (symbol.includes("JPY")) {
    return 0.01;
  }
  // Standard Forex pairs (5 decimals): EURUSD, GBPUSD, etc.
  return 0.0001;
}

// Calculate price levels from pips (agregué chequeo de finite)
function calculatePriceLevels(
  entry: number,
  direction: "long" | "short",
  tpPips: number,
  slPips: number,
  pipValue: number,
): { takeProfit: number; stopLoss: number } {
  if (!Number.isFinite(entry) || tpPips <= 0 || slPips <= 0) {
    throw new Error("Invalid price calculation inputs");
  }
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
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(JSON.stringify({ 
        ok: false, 
        error: "rate_limit_exceeded",
        message: "Too many requests. Please retry later." 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": rateCheck.retryAfter!.toString()
        },
      });
    }

    // 🔐 Auth: Soporta AMBOS headers para compatibilidad (x-mt5-token O Authorization Bearer)
    let mt5Token = req.headers.get("x-mt5-token") ?? "";
    if (!mt5Token) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        mt5Token = authHeader.substring(7); // Extrae token después de "Bearer "
      }
    }
    const expectedToken = Deno.env.get("MT5_SECRET_TOKEN") ?? "";

    // Log para debug (sin exponer token full)
    console.log("Auth attempt:", { hasMt5Token: !!mt5Token, expectedSet: !!expectedToken });

    if (!expectedToken || mt5Token !== expectedToken) {
      console.error("Auth failed: Token mismatch or missing env var");
      return new Response(JSON.stringify({ ok: false, error: "unauthorized", code: 401 }), {
        // Agregué code para match tu error
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    // Initialize Supabase client with service role (agregué chequeo early return)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response(JSON.stringify({ ok: false, error: "internal_error", code: 500 }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      // Agregué options para forzar service role, no auth
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    // Check for existing signal with same dedup_key (idempotency)
    const { data: existing, error: checkError } = await supabase
      .from("signals")
      .select("id")
      .eq("dedup_key", idempotencyKey)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing signal:", checkError);
      return new Response(JSON.stringify({ ok: false, error: "internal_error", code: 500 }), {
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

    // Validate action explicitly before converting to direction
    if (payload.action !== "BUY" && payload.action !== "SELL") {
      return new Response(JSON.stringify({ ok: false, error: "invalid_action" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate price levels (con try-catch para safety)
    const direction = payload.action === "BUY" ? "long" : "short";
    const pipValue = getPipValue(payload.symbol);
    let takeProfit: number, stopLoss: number;
    try {
      ({ takeProfit, stopLoss } = calculatePriceLevels(
        payload.entry,
        direction,
        payload.tp_pips,
        payload.sl_pips,
        pipValue,
      ));
    } catch (calcError) {
      console.error("Price calculation error:", calcError);
      return new Response(JSON.stringify({ ok: false, error: "invalid_price_calculation" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Construct logic field
    const logic = `${payload.pattern}. ${payload.explanation} Win probability: ${payload.win_prob}. Bar time: ${payload.bar_time}. TP: ${payload.tp_pips} pips, SL: ${payload.sl_pips} pips.`;

    // Auto-generate title
    const title = `${payload.symbol} ${payload.timeframe} ${payload.action}`;

    // Calculate R:R ratio
    const risk = Math.abs(payload.entry - stopLoss);
    const reward = Math.abs(takeProfit - payload.entry);
    const rr = risk > 0 ? reward / risk : 0;

    // Store raw MQL5 data in audit_trail
    const audit_trail = {
      pattern: payload.pattern,
      bar_time: payload.bar_time,
      win_prob: payload.win_prob,
      tp_pips: payload.tp_pips,
      sl_pips: payload.sl_pips,
      explanation: payload.explanation,
      received_at: new Date().toISOString(),
    };

    // Determine decimal precision for prices
    const _Digits = payload.symbol.includes("JPY") ? 3 : 5;

    // Insert new signal with correct field mapping
    const { error: insertError } = await supabase.from("signals").insert({
      // author_id uses DB default (00000000-0000-0000-0000-000000000000)
      instrument: payload.symbol,
      timeframe: payload.timeframe,
      title: title,
      direction,
      entry_price: payload.entry,
      stop_loss: stopLoss,
      take_profit: takeProfit,
      logic,
      rr: rr,
      invalidation: `Stop loss @ ${stopLoss.toFixed(_Digits)}`,
      audit_trail: audit_trail,
      status: "published",
      result: "pending",
      source: "automated",
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
      return new Response(JSON.stringify({ ok: false, error: "internal_error", code: 500 }), {
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
    return new Response(JSON.stringify({ ok: false, error: "internal_error", code: 500 }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
