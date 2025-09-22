import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockValidateAffiliation } from '@/lib/mockApi';

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
      // Usar Mock API como método principal ya que las APIs de Exness no funcionan
      console.info(`🎭 Using Mock API for validation (Exness APIs unavailable)`);
      
      const mockResult = await mockValidateAffiliation(email);
      
      if (mockResult.isAffiliated) {
        console.info(`✅ Mock validation successful for:`, email);
        onSuccess(mockResult.clientUid || "");
        toast({
          title: "Validación Exitosa",
          description: "Email validado correctamente",
        });
      } else {
        console.info(`❌ Mock validation - not affiliated:`, email);
        onNotAffiliated();
      }

    } catch (err: any) {
      console.error(`💥 Mock validation failed:`, err.message);
      
      // Si el mock falla, mostrar opciones de no afiliado
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