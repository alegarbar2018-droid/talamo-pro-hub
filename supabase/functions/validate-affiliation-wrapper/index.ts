// Wrapper function that redirects to secure-affiliation-check
// This ensures backward compatibility while centralizing validation logic

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simply forward the request to secure-affiliation-check
    const body = await req.text();
    
    const secureCheckUrl = new URL('/functions/v1/secure-affiliation-check', Deno.env.get('SUPABASE_URL') || '');
    
    const response = await fetch(secureCheckUrl.toString(), {
      method: req.method,
      headers: {
        'authorization': req.headers.get('authorization') || '',
        'content-type': 'application/json',
        'x-client-info': req.headers.get('x-client-info') || '',
        'apikey': req.headers.get('apikey') || ''
      },
      body: body
    });

    const responseData = await response.text();
    
    return new Response(responseData, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Validation wrapper error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Service temporarily unavailable'
      }),
      { 
        status: 503, 
        headers: {
          ...corsHeaders,
          'content-type': 'application/json'
        }
      }
    );
  }
});