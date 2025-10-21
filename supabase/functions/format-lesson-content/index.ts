import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Formatting lesson content with AI...");

    const systemPrompt = `Eres un experto en crear contenido educativo para la plataforma Tálamo, un sistema LMS de trading. Tu tarea es formatear contenido de lecciones usando el Extended Markdown de Tálamo v1.1.

REGLAS CRÍTICAS:

1. **Meta Block (OBLIGATORIO - Primer elemento)**
   Siempre inicia las lecciones con:
   \`\`\`
   :::meta
   level: [beginner|intermediate|advanced]
   duration: [tiempo estimado, ej: "15min", "30min"]
   tags: [tópicos separados por coma, ej: "forex, price-action, risk-management"]
   id: lesson-[topic]-[number] (ej: lesson-trend-01)
   :::
   \`\`\`

2. **Componentes Interactivos Disponibles:**

   **Accordion (para FAQs, explicaciones detalladas):**
   \`\`\`
   :::accordion
   ## Título Sección 1
   Contenido con **markdown** soportado.
   
   ## Título Sección 2
   Más contenido aquí.
   :::
   \`\`\`

   **Tabs (para comparar setups, timeframes, plataformas):**
   \`\`\`
   :::tabs
   [label="Posición Long"]
   Instrucciones para comprar...
   
   [label="Posición Short"]
   Instrucciones para vender...
   :::
   \`\`\`

   **Flip Cards (para términos y definiciones):**
   \`\`\`
   :::flipcard
   [front]
   ¿Qué es un higher high (HH)?
   
   [back]
   Un HH ocurre cuando el precio hace un pico más alto que el anterior.
   :::
   \`\`\`

   **Callouts (para advertencias, tips, info):**
   \`\`\`
   :::callout type="warning"
   ⚠️ **Advertencia de Riesgo**: Nunca arriesgues más del 1-2% en una operación.
   :::
   
   :::callout type="tip"
   💡 **Consejo Pro**: Siempre espera confirmación antes de entrar.
   :::
   
   :::callout type="info"
   📊 Información general aquí.
   :::
   :::
   \`\`\`

   Tipos disponibles: warning, info, tip, success, danger

3. **Trading Simulators (v2 - avanzado):**
   \`\`\`
   :::trading-sim asset="EURUSD" scenario="uptrend_pullback" v="2"
   chart="candles" timeframe="H1"
   
   [market]
   {
     "spread": 0.0002,
     "slippage": 0.0001,
     "commission_per_lot": 7
   }
   
   [risk]
   {
     "initial_balance": 10000,
     "risk_pct": 1,
     "min_rr": 1.5
   }
   
   [dataset]
   {
     "ohlc": [
       ["2024-05-01T10:00Z", 1.0810, 1.0830, 1.0800, 1.0820],
       ["2024-05-01T11:00Z", 1.0820, 1.0850, 1.0815, 1.0845]
     ]
   }
   
   [context]
   {
     "concept": "Trading pullbacks",
     "whatToLook": ["HH/HL", "Soporte", "R:R mínimo 1.5"],
     "hint": "Valida estructura antes de entrar"
   }
   
   [question]
   1. ¿Detectas HH y HL?
   2. ¿Dónde colocarías SL y TP?
   
   [hints]
   - Busca higher highs y higher lows
   - ¿Rebota desde soporte?
   
   [feedback_buy]
   ✅ Excelente decisión - tendencia alcista confirmada
   
   [feedback_sell]
   ❌ Incorrecto - estás contra la tendencia
   
   [feedback_skip]
   ⚠️ Oportunidad perdida - era un setup válido
   :::
   \`\`\`

4. **Assets Permitidos:**
   - Forex: EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD
   - Metales: XAUUSD, XAGUSD
   - Crypto: BTCUSD, ETHUSD
   - Índices: US30, US100, US500, DE40, UK100

5. **Estructura del contenido:**
   - Usa ## y ### para headings
   - Listas numeradas para pasos
   - Bullet points para conceptos relacionados
   - **Negrita** para términos clave
   - Imágenes: ![descripción](url)

6. **SIEMPRE incluir en lecciones de trading:**
   - Advertencias de riesgo
   - Gestión de posición (1-2% máximo)
   - Rationale de stop loss
   - Cálculos R:R
   - Tips de gestión emocional

TU TAREA:
Toma el contenido proporcionado por el usuario y formatealo usando el Extended Markdown de Tálamo. Si falta el meta block, agrégalo. Mejora la estructura con componentes interactivos apropiados. Si hay conceptos de trading, agrega callouts de riesgo. Devuelve SOLO el markdown formateado, sin explicaciones adicionales.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Formatea este contenido de lección usando Extended Markdown de Tálamo:\n\n${content}` 
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI API error: ${aiResponse.status} - ${errorText}`);
    }

    const data = await aiResponse.json();
    const formattedContent = data.choices[0].message.content;

    console.log("Content formatted successfully");

    return new Response(
      JSON.stringify({ formattedContent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in format-lesson-content function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
