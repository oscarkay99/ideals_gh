import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';

export interface StoreSettings {
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  primary_color: string;
}

const SETTINGS_ID = 'store';

export async function getStoreSettings(): Promise<StoreSettings | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.from('settings').select('*').eq('id', SETTINGS_ID).maybeSingle();
  return data ?? null;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'upsert',
      entityType: 'settings',
      entityId: SETTINGS_ID,
      summary: 'Update store settings',
      metadata: { module: 'settings', businessName: settings.business_name },
    },
    async () => {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: SETTINGS_ID, ...settings }, { onConflict: 'id' });
      if (error) throw new Error(error.message);
    },
  );
}
