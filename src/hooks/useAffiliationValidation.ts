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
    onDemo: () => void
  ) => {
    setError("");
    setLoading(true);
    
    console.info(`exness_validate_attempt`, { email });
    
    try {
      // Check for demo mode
      if (email.toLowerCase().includes("demo") || email.toLowerCase().includes("exness")) {
        onDemo();
        console.info(`demo_access`, { email });
        toast({
          title: "Modo Demo Activado",
          description: "Acceso temporal sin validación por API",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('validate-affiliation', {
        body: { email }
      });

      console.log('Supabase response:', { data, error, hasError: !!error });

      // Check for 403 responses specifically for "NotAffiliated" users
      if (error) {
        // Handle different ways Supabase wraps 403 responses
        const is403Response = 
          error.message?.includes('FunctionsHttpError: 403') ||
          error.message?.includes('FunctionsRelayError: 403') ||
          error.message?.includes('NotAffiliated') ||
          error.context?.status === 403 ||
          error.status === 403;

        if (is403Response) {
          console.info(`User not affiliated (403 response)`, { email, errorMessage: error.message });
          onNotAffiliated();
          return;
        }
        
        // If it's any other error, throw it
        throw error;
      }

      // Handle successful response
      if (data?.affiliation === true) {
        onSuccess(data.client_uid || "");
        console.info(`exness_validate_success`, { email, uid: data.client_uid });
      } else if (data?.affiliation === false) {
        // This shouldn't happen if edge function returns 403 for non-affiliated, but just in case
        console.info(`User not affiliated (data response)`, { email });
        onNotAffiliated();
      } else {
        console.info(`Unexpected response format`, { data });
        onNotAffiliated();
      }
    } catch (err: any) {
      // Handle 403 specifically for non-affiliated users (backup)
      if (err?.message?.includes('403') || err?.status === 403) {
        console.info(`User not affiliated (caught 403)`, { email });
        onNotAffiliated();
        return;
      }
      
      if (err?.status === 401) {
        setError("No pudimos autenticarnos con el bróker. Intenta nuevamente en unos minutos.");
      } else if (err?.status === 429) {
        setError("Demasiadas solicitudes. Espera y vuelve a intentar.");
        // Start 60 second cooldown
        setCooldownSeconds(60);
        const interval = setInterval(() => {
          setCooldownSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (err?.status === 400) {
        setError("Solicitud inválida. Revisa tu correo e inténtalo de nuevo.");
      } else if (err?.status >= 500) {
        setError("Servicio del bróker con incidencias. Intentaremos de nuevo pronto.");
      } else {
        setError("No pudimos validar tu afiliación.");
      }
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