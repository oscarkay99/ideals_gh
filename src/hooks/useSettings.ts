import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

export function useSetting(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.from('settings').select('value').eq('key', key).maybeSingle()
      .then(({ data }) => { setValue(data?.value ?? null); setLoading(false); });

    const channel = supabase.channel(`settings:${key}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings', filter: `key=eq.${key}` },
        (payload) => {
          const row = payload.new as { value?: string } | null;
          setValue(row?.value ?? null);
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [key]);

  const save = useCallback(async (newValue: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('settings').upsert(
      { key, value: newValue, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) { console.error('settings save failed:', error.message); return false; }
    setValue(newValue);
    return true;
  }, [key]);

  return { value, loading, save };
}
