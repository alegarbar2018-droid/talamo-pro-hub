import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("No user found");
    }

    // Get recent journal entries (last 20)
    const { data: entries, error: entriesError } = await supabaseClient
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("trade_date", { ascending: false })
      .limit(20);

    if (entriesError) {
      console.error("Error fetching entries:", entriesError);
      throw entriesError;
    }

    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({
          recommendation: "Aún no tienes operaciones registradas. Comienza a documentar tus trades para recibir análisis y recomendaciones personalizadas.",
          type: "general",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate statistics
    const closedTrades = entries.filter((e) => e.status === "closed");
    const winningTrades = closedTrades.filter((e) => e.result && e.result > 0);
    const losingTrades = closedTrades.filter((e) => e.result && e.result < 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    const totalProfit = closedTrades.reduce((sum, e) => sum + (e.result || 0), 0);
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, e) => sum + (e.result || 0), 0) / winningTrades.length 
      : 0;
    const avgLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, e) => sum + (e.result || 0), 0) / losingTrades.length)
      : 0;
    const profitFactor = avgLoss > 0 ? (avgWin * winningTrades.length) / (avgLoss * losingTrades.length) : 0;

    // Create analysis context for AI
    const analysisContext = `
Análisis del diario de trading del usuario:

ESTADÍSTICAS GENERALES:
- Total de operaciones: ${entries.length}
- Operaciones cerradas: ${closedTrades.length}
- Operaciones ganadoras: ${winningTrades.length}
- Operaciones perdedoras: ${losingTrades.length}
- Win Rate: ${winRate.toFixed(2)}%
- Ganancia/Pérdida total: $${totalProfit.toFixed(2)}
- Ganancia promedio: $${avgWin.toFixed(2)}
- Pérdida promedio: $${avgLoss.toFixed(2)}
- Factor de ganancia: ${profitFactor.toFixed(2)}

ÚLTIMAS 5 OPERACIONES:
${entries.slice(0, 5).map((e, i) => `
${i + 1}. ${e.direction} ${e.instrument} 
   - Fecha: ${new Date(e.trade_date).toLocaleDateString()}
   - Entrada: ${e.entry_price} | Salida: ${e.exit_price || 'Abierta'}
   - Resultado: ${e.result ? `$${e.result.toFixed(2)}` : 'Pendiente'}
   - Notas: ${e.notes || 'Sin notas'}
   - Emociones: ${e.emotions?.join(', ') || 'No registradas'}
`).join('\n')}

INSTRUMENTOS MÁS OPERADOS:
${Object.entries(
  entries.reduce((acc, e) => {
    acc[e.instrument] = (acc[e.instrument] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).slice(0, 5).map(([inst, count]) => `- ${inst}: ${count} operaciones`).join('\n')}

EMOCIONES FRECUENTES:
${entries
  .flatMap(e => e.emotions || [])
  .reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
  ? Object.entries(
      entries
        .flatMap(e => e.emotions || [])
        .reduce((acc, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    ).slice(0, 5).map(([emotion, count]) => `- ${emotion}: ${count} veces`).join('\n')
  : 'No hay emociones registradas'}
`;

    // Call Lovable AI for mentor recommendations
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Eres un mentor experto en trading con más de 15 años de experiencia. Tu rol es analizar el journal de trading del usuario y proporcionar recomendaciones específicas, prácticas y accionables. 

FORMATO DE RESPUESTA:
1. Análisis breve de la situación actual (2-3 líneas)
2. 3-4 puntos de mejora específicos con ejemplos concretos
3. Una recomendación principal para implementar inmediatamente

ESTILO:
- Directo pero empático
- Usa datos específicos del journal
- Proporciona ejemplos concretos
- Evita generalidades
- Enfócate en aspectos psicológicos y de gestión de riesgo
- Sé constructivo, nunca desalentador

CATEGORIZA tu respuesta en uno de estos tipos:
- pattern: Patrones de comportamiento detectados
- risk: Gestión de riesgo y money management
- psychology: Aspectos emocionales y psicológicos
- strategy: Mejoras estratégicas
- general: Comentarios generales

Al final, indica el tipo con: [TIPO: categoria]`,
          },
          {
            role: "user",
            content: analysisContext,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Límite de solicitudes excedido. Por favor, intenta más tarde.",
            recommendation: "Estamos experimentando alta demanda. Por favor, intenta nuevamente en unos minutos.",
            type: "general"
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Es necesario agregar créditos a la cuenta.",
            recommendation: "Por favor, agrega créditos en Settings -> Workspace -> Usage para continuar usando el mentor AI.",
            type: "general"
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const mentorResponse = aiData.choices[0].message.content;

    // Extract recommendation type from response
    const typeMatch = mentorResponse.match(/\[TIPO:\s*(\w+)\]/i);
    const recommendationType = typeMatch ? typeMatch[1].toLowerCase() : "general";
    const cleanedResponse = mentorResponse.replace(/\[TIPO:\s*\w+\]/gi, "").trim();

    // Store recommendation
    const { error: insertError } = await supabaseClient
      .from("journal_recommendations")
      .insert({
        user_id: user.id,
        recommendation_text: cleanedResponse,
        recommendation_type: recommendationType,
        based_on_entries: entries.slice(0, 5).map(e => e.id),
      });

    if (insertError) {
      console.error("Error storing recommendation:", insertError);
    }

    return new Response(
      JSON.stringify({
        recommendation: cleanedResponse,
        type: recommendationType,
        statistics: {
          totalTrades: entries.length,
          winRate: winRate.toFixed(2),
          totalProfit: totalProfit.toFixed(2),
          profitFactor: profitFactor.toFixed(2),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in journal-mentor:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        recommendation: "Hubo un error al generar las recomendaciones. Por favor, intenta nuevamente.",
        type: "general"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});