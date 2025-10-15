import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AffiliationStatus } from '@/modules/copy/types';

/**
 * Hook para verificar estado de afiliación del usuario
 * Fase 6: Gating de acceso a features de copy trading
 */
export function useAffiliationGate() {
  const { data: status, isLoading, error, refetch } = useQuery({
    queryKey: ['affiliation-status'],
    queryFn: async () => {
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          status: 'blocked',
          message: 'Debes iniciar sesión para acceder'
        } as AffiliationStatus;
      }
      
      // Verificar afiliación
      const { data: affiliation, error: affiliationError } = await supabase
        .from('affiliations')
        .select('is_affiliated, partner_id, verified_at')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (affiliationError) {
        console.error('Error checking affiliation:', affiliationError);
        return {
          status: 'blocked',
          message: 'Error al verificar afiliación'
        } as AffiliationStatus;
      }
      
      // No existe registro de afiliación
      if (!affiliation) {
        return {
          status: 'blocked',
          message: 'No tienes una cuenta afiliada'
        } as AffiliationStatus;
      }
      
      // Verificar si está afiliado
      if (!affiliation.is_affiliated) {
        return {
          status: 'blocked',
          partner_id: affiliation.partner_id || undefined,
          message: 'Tu cuenta no está afiliada o no ha sido verificada'
        } as AffiliationStatus;
      }
      
      // Verificado y elegible
      return {
        status: 'eligible',
        partner_id: affiliation.partner_id || undefined,
        message: 'Cuenta verificada y elegible'
      } as AffiliationStatus;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  return {
    status,
    isLoading,
    error,
    refetch,
    isEligible: status?.status === 'eligible',
    isBlocked: status?.status === 'blocked'
  };
}
