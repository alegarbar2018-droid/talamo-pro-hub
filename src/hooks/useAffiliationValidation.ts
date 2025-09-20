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
      // Check for demo mode (only if ALLOW_DEMO is enabled)
      const emailLower = email.toLowerCase();
      const allowDemo = window.location.hostname.includes('localhost') || 
                       window.location.search.includes('demo=1');
      
      if (allowDemo && /demo|exness/i.test(emailLower)) {
        console.info(`🎭 Demo mode activated for:`, email);
        onDemo();
        toast({
          title: "Modo Demo Activado",
          description: "Acceso temporal sin validación por API",
        });
        return;
      }

      console.info(`📡 Calling validate-affiliation function with email:`, email);
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke('validate-affiliation', {
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

      // Handle error responses
      if (error) {
        console.info(`❌ Error detected:`, error.message);

        // Check for existing user (409)
        if (error.message?.includes('409') || error.message?.includes('UserExists')) {
          console.info(`👤 User already exists, redirecting to login`);
          if (onUserExists) {
            onUserExists();
          }
          return;
        }

        // Handle HTTP errors with proper user flow
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          setError("Error de autenticación con el bróker. Intenta más tarde o ve las opciones para afiliarte.");
          return;
        }
        
        if (error.message?.includes('429') || error.message?.includes('RateLimited')) {
          setError("Demasiadas solicitudes. Espera y vuelve a intentar.");
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
          return;
        }

        if (error.message?.includes('502') || error.message?.includes('BrokerDown')) {
          setError("Servicio temporalmente no disponible. Intenta más tarde.");
          return;
        }

        // Any other error - treat as not affiliated to show options
        console.info(`🤷 Error or unexpected response, showing not affiliated options`);
        onNotAffiliated();
        return;
      }

      // Handle successful response
      if (data?.affiliation === true) {
        console.info(`✅ Affiliation validated successfully:`, data.client_uid);
        onSuccess(data.client_uid || "");
      } else {
        console.info(`❌ Not affiliated based on data response`);
        onNotAffiliated();
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