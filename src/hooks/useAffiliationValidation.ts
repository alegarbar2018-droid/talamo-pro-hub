import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAffiliationValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { toast } = useToast();

  const validateAffiliation = async (
    email: string,
    onSuccess: (uid?: string) => void,
    onNotAffiliated: () => void,
    onDemo: () => void,
    onUserExists?: () => void
  ) => {
    setError("");
    setLoading(true);
    
    console.info(`🔍 Starting validation for email:`, email);
    
    try {
      console.info(`📡 Calling secure-affiliation-check function with email:`, email);
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke('secure-affiliation-check', {
        body: { email }
      });

      const endTime = performance.now();
      console.info('📋 Supabase response received in', Math.round(endTime - startTime), 'ms');
      console.info('📋 Response details:', { 
        hasData: !!data, 
        hasError: !!error,
        data: data ? JSON.stringify(data).substring(0, 300) : null,
        errorMessage: error?.message?.substring(0, 300),
        errorDetails: error
      });

      // Handle structured response from secure-affiliation-check
      if (error) {
        console.info(`❌ Error detected:`, error.message);

        // Handle rate limiting
        if (error.status === 429 || data?.rate_limited) {
          const retryAfter = data?.retry_after || 300;
          setError("Demasiadas solicitudes. Espera antes de intentar de nuevo.");
          setCooldownSeconds(retryAfter);
          const interval = setInterval(() => {
            setCooldownSeconds((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          return;
        }

        // Handle other HTTP errors based on standardized codes
        if (error.status === 503 || data?.code === 'UpstreamError') {
          setError("Servicio temporalmente no disponible. Intenta más tarde.");
          return;
        }

        if (error.status === 401 || data?.code === 'Unauthorized') {
          setError("Error de autenticación. Intenta más tarde o ve las opciones para afiliarte.");
          return;
        }

        if (data?.code === 'BadRequest') {
          setError("Solicitud inválida. Verifica el formato del email.");
          return;
        }

        // Fallback for other errors
        console.info(`🤷 Error or unexpected response, showing not affiliated options`);
        onNotAffiliated();
        return;
      }

      // Handle successful structured response with new format
      if (data?.ok) {
        if (data.data?.demo_mode) {
          console.info(`🧪 Demo mode validation successful`);
          onDemo();
          toast({
            title: "Modo Demo Activado",
            description: "Acceso de demostración confirmado",
          });
          return;
        }

        if (data.data?.user_exists) {
          console.info(`👤 User already exists, redirecting to login`);
          if (onUserExists) {
            onUserExists();
          }
          return;
        }

        if (data.data?.is_affiliated) {
          console.info(`✅ Affiliation validated successfully:`, data.data.uid);
          onSuccess(data.data.uid || "");
          toast({
            title: "Validación Exitosa",
            description: "Afiliación confirmada correctamente",
          });
        } else {
          console.info(`❌ Not affiliated based on response`);
          onNotAffiliated();
        }
      } else {
        // Handle error in response data with standardized codes
        if (data?.code && data?.message) {
          const errorMessages = {
            'Throttled': 'Demasiadas solicitudes. Espera antes de intentar de nuevo.',
            'BadRequest': 'Solicitud inválida. Verifica el formato del email.',
            'Unauthorized': 'Error de autenticación. Intenta más tarde.',
            'UpstreamError': 'Servicio temporalmente no disponible. Intenta más tarde.',
            'InternalError': 'Error interno del servidor. Intenta más tarde.'
          };
          
          setError(errorMessages[data.code as keyof typeof errorMessages] || data.message);
        } else {
          console.info(`❌ Validation failed, showing not affiliated options`);
          onNotAffiliated();
        }
      }

    } catch (err: any) {
      console.error(`💥 Caught exception:`, err.message);
      
      // Fallback: treat any exception as "not affiliated" to give user options
      console.info(`🔄 Fallback: showing not affiliated options`);
      onNotAffiliated();
    } finally {
      setLoading(false);
    }
  };

  const resetValidation = () => {
    setError("");
    setCooldownSeconds(0);
  };

  return {
    loading,
    error,
    cooldownSeconds,
    validateAffiliation,
    resetValidation
  };
};