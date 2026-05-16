import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

export function useMonthlyTarget() {
  const [target, setTarget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }

    supabase.from('settings').select('monthly_profit_target').eq('id', 'store').maybeSingle()
      .then(({ data }) => {
        setTarget(data?.monthly_profit_target ?? 0);
        setLoading(false);
      });

    const channel = supabase.channel('settings:target')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' },
        (payload) => {
          const row = payload.new as { monthly_profit_target?: number };
          if (row?.monthly_profit_target !== undefined) setTarget(row.monthly_profit_target);
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const save = useCallback(async (value: number): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('settings')
      .update({ monthly_profit_target: value, updated_at: new Date().toISOString() })
      .eq('id', 'store');
    if (error) { console.error('target save failed:', error.message); return false; }
    setTarget(value);
    return true;
  }, []);

  return { target, loading, save };
}

// Keep generic useSetting for future use with the kv pattern
export function useSetting(_key: string) {
  return { value: null as string | null, loading: false, save: async (_v: string) => false };
}
