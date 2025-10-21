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
    console.log("Request received, parsing body...");
    const { content } = await req.json();
    console.log("Content length:", content?.length || 0);

    if (!content || typeof content !== 'string') {
      console.error("Invalid content received");
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Calling Lovable AI...");

    const systemPrompt = `Eres un diseñador instruccional experto especializado en crear contenido educativo ALTAMENTE INTERACTIVO para la plataforma Tálamo, un sistema LMS de trading.

TU MISIÓN: Transformar contenido plano en una experiencia de aprendizaje rica, visual e interactiva usando Extended Markdown v1.1.

═══════════════════════════════════════════════════════════════════════════════
📋 PASO 1: ANALIZA EL CONTENIDO
═══════════════════════════════════════════════════════════════════════════════

Antes de formatear, identifica:
- ¿Hay definiciones o conceptos clave? → Usa FLIPCARDS
- ¿Hay pasos o procesos largos? → Usa ACCORDION  
- ¿Hay comparaciones (ej: tipos de cuentas, long vs short)? → Usa TABS
- ¿Hay advertencias de riesgo o consejos importantes? → Usa CALLOUTS
- ¿Se puede practicar con un gráfico? → Usa TRADING-SIM

═══════════════════════════════════════════════════════════════════════════════
🎯 PASO 2: META BLOCK (OBLIGATORIO AL INICIO)
═══════════════════════════════════════════════════════════════════════════════

\`\`\`
:::meta
level: [beginner|intermediate|advanced]
duration: [ej: "15min", "30min", "45min"]
tags: [3-5 tags separados por coma]
id: lesson-[topic]-[number]
:::
\`\`\`

═══════════════════════════════════════════════════════════════════════════════
🎨 PASO 3: USA COMPONENTES INTERACTIVOS DE MANERA CREATIVA
═══════════════════════════════════════════════════════════════════════════════

🃏 **FLIPCARDS** - Úsalas para:
   - Definiciones de términos (¿Qué es un pip?, ¿Qué es leverage?)
   - Fórmulas clave (Front: "¿Cómo calcular lote?" | Back: fórmula + ejemplo)
   - Conceptos vs ejemplos (Front: concepto | Back: caso real)
   
   Sintaxis:
   \`\`\`
   :::flipcard
   [front]
   ¿Qué es el spread?
   
   [back]
   Es la diferencia entre el precio de compra (ask) y venta (bid). 
   Ejemplo: Si EUR/USD bid=1.0800 y ask=1.0802, el spread es 2 pips.
   :::
   \`\`\`

📂 **ACCORDION** - Úsalo para:
   - Listas largas de pasos (ej: proceso de verificación KYC)
   - Explicaciones detalladas que pueden abrumar visualmente
   - FAQs o secciones "más información"
   
   Sintaxis:
   \`\`\`
   :::accordion
   ## Paso 1: Crea tu Personal Area
   Ingresa a Exness.com y completa el registro básico con email y contraseña.
   
   ## Paso 2: Verifica tu identidad
   Sube tu DNI o pasaporte en la sección "Verificación".
   
   ## Paso 3: Elige tipo de cuenta
   Decide entre Standard, Standard Cent, Pro, Raw Spread o Zero.
   :::
   \`\`\`

🗂️ **TABS** - Úsalos para:
   - Comparar opciones (tipos de cuenta, plataformas, estrategias)
   - Mostrar distintos escenarios (long vs short, scalping vs swing)
   - Diferenciar niveles de experiencia
   
   Sintaxis:
   \`\`\`
   :::tabs
   [label="Standard Account"]
   - Spreads desde 0.3 pips
   - Sin comisión
   - Ideal para principiantes
   
   [label="Raw Spread Account"]
   - Spreads desde 0.0 pips
   - Comisión por lote
   - Para traders avanzados
   :::
   \`\`\`

⚠️ **CALLOUTS** - Úsalos para:
   - Advertencias de riesgo (type="warning")
   - Consejos prácticos (type="tip")
   - Información destacada (type="info")
   - Celebrar logros (type="success")
   - Errores comunes (type="danger")
   
   Sintaxis:
   \`\`\`
   :::callout type="warning"
   ⚠️ **Advertencia de Riesgo**: Nunca arriesgues más del 1-2% de tu capital en una sola operación.
   :::
   
   :::callout type="tip"
   💡 **Consejo Pro**: Usa una cuenta demo por al menos 2 semanas antes de operar con dinero real.
   :::
   :::
   \`\`\`

📊 **TRADING SIMULATOR (v2)** - Úsalo cuando:
   - Enseñes a identificar patrones (HH/HL, soportes/resistencias)
   - Practiquen entradas y salidas
   - Calculen risk/reward

   Sintaxis mínima:
   \`\`\`
   :::trading-sim asset="EURUSD" scenario="uptrend_pullback" v="2"
   chart="candles" timeframe="H1"
   
   [context]
   {
     "concept": "Identificar pullbacks en tendencia alcista",
     "whatToLook": ["Higher Highs", "Higher Lows", "Zona de soporte"]
   }
   
   [question]
   1. ¿Identificas una tendencia alcista?
   2. ¿Dónde colocarías tu stop loss?
   
   [feedback_buy]
   ✅ ¡Correcto! Compraste en un pullback válido.
   
   [feedback_sell]
   ❌ Incorrecto. Estás vendiendo contra la tendencia alcista.
   :::
   \`\`\`

═══════════════════════════════════════════════════════════════════════════════
✅ REGLAS DE ORO
═══════════════════════════════════════════════════════════════════════════════

1. **NO dejes texto plano largo**: Si ves más de 6 líneas seguidas de texto, encuentra una manera de hacerlo interactivo.

2. **Jerarquiza con headings**:
   - # Título principal (solo 1 por lección)
   - ## Secciones principales
   - ### Subsecciones

3. **Enfatiza términos clave** con **negrita**.

4. **Listas**:
   - Numeradas para pasos secuenciales
   - Bullet points para conceptos relacionados

5. **SIEMPRE incluye callouts de riesgo** en lecciones de trading:
   \`\`\`
   :::callout type="warning"
   ⚠️ El trading conlleva riesgo de pérdida de capital. Opera solo con dinero que puedas permitirte perder.
   :::
   \`\`\`

6. **Usa emojis estratégicamente** (⚠️ 💡 ✅ ❌ 📊 🎯) para destacar visualmente.

═══════════════════════════════════════════════════════════════════════════════
🎬 EJEMPLO DE TRANSFORMACIÓN
═══════════════════════════════════════════════════════════════════════════════

ANTES (texto plano):
"El spread es la diferencia entre bid y ask. Hay dos tipos de cuentas: Standard tiene spreads desde 0.3 pips sin comisión. Raw Spread tiene spreads desde 0.0 pero cobra comisión."

DESPUÉS (interactivo):
\`\`\`
:::flipcard
[front]
¿Qué es el spread?

[back]
Es la diferencia entre el precio de **compra (ask)** y **venta (bid)**.
Ejemplo: EUR/USD bid=1.0800, ask=1.0802 → spread = 2 pips
:::

:::tabs
[label="Standard"]
- Spreads desde **0.3 pips**
- Sin comisión
- Ideal para principiantes

[label="Raw Spread"]
- Spreads desde **0.0 pips**
- Comisión: $3.5 por lote
- Para traders experimentados
:::
\`\`\`

═══════════════════════════════════════════════════════════════════════════════
🚀 TU TAREA FINAL
═══════════════════════════════════════════════════════════════════════════════

Toma el contenido del usuario y devuelve ÚNICAMENTE el markdown formateado siguiendo estas reglas:

1. Inicia con :::meta
2. Analiza el contenido e identifica oportunidades para componentes interactivos
3. Usa al menos 3-5 componentes interactivos por lección
4. Agrega callouts de riesgo si es contenido de trading
5. Asegúrate de que TODO esté en español
6. NO agregues explicaciones, solo devuelve el markdown listo para usar

**IMPORTANTE**: Devuelve SOLO el Extended Markdown formateado, sin comentarios adicionales.`;

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

    console.log("AI response status:", aiResponse.status);

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
    console.log("AI response received, extracting content...");
    
    const formattedContent = data.choices?.[0]?.message?.content;
    
    if (!formattedContent) {
      console.error("No content in AI response:", JSON.stringify(data));
      throw new Error("No content returned from AI");
    }

    console.log("Content formatted successfully, length:", formattedContent.length);

    return new Response(
      JSON.stringify({ formattedContent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in format-lesson-content function:", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        details: error.stack || ""
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
