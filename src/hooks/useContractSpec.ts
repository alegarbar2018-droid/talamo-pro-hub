import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContractSpec {
  id: string;
  symbol: string;
  name: string;
  asset_class: string;
  underlying_asset?: string;
  base_currency: string;
  quote_currency?: string;
  contract_size: number;
  pip_value: number;
  pip_position: number;
  min_lot: number;
  max_lot: number;
  lot_step: number;
  spread_typical: number | null;
  margin_percentage: number | null;
  leverage_max: number | null;
  swap_long: number | null;
  swap_short: number | null;
}

/**
 * Hook to fetch contract specifications from Supabase
 */
export function useContractSpecs() {
  return useQuery({
    queryKey: ['contract-specifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_specifications')
        .select('*')
        .eq('status', 'active')
        .order('asset_class', { ascending: true })
        .order('symbol', { ascending: true });

      if (error) throw error;
      return data as ContractSpec[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single contract specification by symbol
 */
export function useContractSpec(symbol: string | null) {
  return useQuery({
    queryKey: ['contract-specification', symbol],
    queryFn: async () => {
      if (!symbol) return null;

      const { data, error } = await supabase
        .from('contract_specifications')
        .select('*')
        .eq('symbol', symbol)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as ContractSpec;
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get pip size based on pip position
 */
export function getPipSize(pipPosition: number): number {
  return Math.pow(10, -pipPosition);
}

/**
 * Calculate pip value in account currency
 * Simplified - in real scenario would need exchange rates
 */
export function calculatePipValue(
  lots: number,
  contractSize: number,
  pipSize: number
): number {
  return lots * contractSize * pipSize;
}
