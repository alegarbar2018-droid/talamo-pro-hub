import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { signal_id } = await req.json();

    if (!signal_id) {
      return new Response(
        JSON.stringify({ error: 'signal_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get signal data
    const { data: signal, error: signalError } = await supabaseClient
      .from('signals')
      .select('logic, instrument, direction, timeframe')
      .eq('id', signal_id)
      .single();

    if (signalError || !signal) {
      console.error('Error fetching signal:', signalError);
      return new Response(
        JSON.stringify({ error: 'Signal not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Skip if logic is empty
    if (!signal.logic || signal.logic.trim() === '') {
      return new Response(
        JSON.stringify({ success: true, message: 'No logic to synthesize' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI to synthesize the logic
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en análisis técnico que explica señales de trading de manera clara y concisa para traders principiantes e intermedios. Tu trabajo es tomar análisis técnicos complejos y convertirlos en explicaciones fáciles de entender, sin perder la información importante.

REGLAS ESTRICTAS:
- Máximo 2-3 oraciones cortas
- Usa lenguaje simple y directo
- Evita jerga técnica innecesaria
- Si mencionas indicadores técnicos (RSI, MACD, etc), explica brevemente qué significan
- Enfócate en lo más importante: por qué se genera la señal y qué esperar
- Usa un tono profesional pero amigable
- NO inventes datos que no estén en el análisis original`
          },
          {
            role: 'user',
            content: `Sintetiza este análisis técnico para hacerlo más digerible para el usuario:

Instrumento: ${signal.instrument}
Dirección: ${signal.direction}
Temporalidad: ${signal.timeframe}
Análisis técnico original: ${signal.logic}

Genera una versión simplificada y clara del análisis.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      // Return original logic if AI fails
      await supabaseClient
        .from('signals')
        .update({ logic_summary: signal.logic })
        .eq('id', signal_id);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Used original logic due to AI error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const synthesizedLogic = aiData.choices[0]?.message?.content?.trim();

    if (!synthesizedLogic) {
      console.error('No content from AI');
      // Fallback to original
      await supabaseClient
        .from('signals')
        .update({ logic_summary: signal.logic })
        .eq('id', signal_id);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Used original logic - no AI response' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update signal with synthesized logic
    const { error: updateError } = await supabaseClient
      .from('signals')
      .update({ logic_summary: synthesizedLogic })
      .eq('id', signal_id);

    if (updateError) {
      console.error('Error updating signal:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update signal' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signal logic synthesized successfully:', signal_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synthesized_logic: synthesizedLogic 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
