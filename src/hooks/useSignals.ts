import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { es, pt, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type SignalRow = Database['public']['Tables']['signals']['Row'];

export interface Signal {
  id: string;
  instrument: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  sl: number;
  tp: number;
  rr: number;
  timeframe: string;
  publishedAt: string;
  confidence: number;
  status: 'active' | 'tp_reached' | 'sl_reached';
  logic: string;
  invalidation: string;
  author: string;
}

const getLocale = (lang: string) => {
  switch (lang) {
    case 'es': return es;
    case 'pt': return pt;
    default: return enUS;
  }
};

const adaptSignal = (row: SignalRow, lang: string): Signal => {
  const locale = getLocale(lang);
  const type: 'LONG' | 'SHORT' = (row.entry_price || 0) < (row.take_profit || 0) ? 'LONG' : 'SHORT';
  
  return {
    id: row.id,
    instrument: row.instrument,
    type,
    entry: row.entry_price || 0,
    sl: row.stop_loss || 0,
    tp: row.take_profit || 0,
    rr: row.rr,
    timeframe: row.timeframe,
    publishedAt: row.published_at 
      ? formatDistanceToNow(new Date(row.published_at), { addSuffix: true, locale })
      : '',
    confidence: 85,
    status: (row.result === 'tp_hit' ? 'tp_reached' : row.result === 'sl_hit' ? 'sl_reached' : 'active') as Signal['status'],
    logic: row.logic,
    invalidation: row.invalidation,
    author: 'Sistema'
  };
};

export const useSignals = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const { data, error } = await supabase
          .from('signals')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;

        setSignals((data || []).map(row => adaptSignal(row, i18n.language)));
      } catch (err) {
        console.error('Error fetching signals:', err);
        setError(err instanceof Error ? err.message : 'Error loading signals');
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();

    const channel = supabase
      .channel('signals-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'signals' },
        (payload) => {
          const newRow = payload.new as SignalRow;
          if (newRow.status === 'published') {
            setSignals(prev => [adaptSignal(newRow, i18n.language), ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'signals' },
        (payload) => {
          const updatedRow = payload.new as SignalRow;
          setSignals(prev => 
            prev.map(signal => 
              signal.id === updatedRow.id 
                ? adaptSignal(updatedRow, i18n.language)
                : signal
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return { signals, loading, error };
};

// Hook for signals performance (historical metrics)
export const useSignalsPerformance = () => {
  const [performance, setPerformance] = useState<{
    winRate: number;
    avgRr: number;
    totalSignals: number;
    simulatedReturn: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { data, error } = await supabase
          .rpc('calculate_signals_performance');

        if (error) throw error;

        if (data && data.length > 0) {
          const row = data[0];
          setPerformance({
            winRate: row.win_rate || 0,
            avgRr: row.avg_rr || 0,
            totalSignals: row.total_signals || 0,
            simulatedReturn: row.simulated_return || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching performance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  return { performance, loading };
};
