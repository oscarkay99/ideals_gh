import { supabase, isSupabaseConfigured } from './supabase';
import type { Channel } from './social';

export interface ChannelIntegration {
  id: string;
  channel: Channel;
  status: 'connected' | 'disconnected' | 'error';
  user_id: string | null;
  phone_number_id: string | null;
  waba_id: string | null;
  ig_user_id: string | null;
  tiktok_app_id: string | null;
  access_token: string | null;
  app_secret: string | null;
  webhook_verify_token: string;
  last_sync: string | null;
  metadata: Record<string, unknown>;
}

const DISCONNECTED = (channel: Channel): ChannelIntegration => ({
  id: `mock-${channel}`,
  channel,
  status: 'disconnected',
  user_id: null,
  phone_number_id: null,
  waba_id: null,
  ig_user_id: null,
  tiktok_app_id: null,
  access_token: null,
  app_secret: null,
  webhook_verify_token: '',
  last_sync: null,
  metadata: {},
});

export async function getAllIntegrations(): Promise<ChannelIntegration[]> {
  if (!isSupabaseConfigured) {
    return (['whatsapp', 'instagram', 'tiktok'] as Channel[]).map(DISCONNECTED);
  }

  const { data, error } = await supabase
    .from('channel_integrations')
    .select('*')
    .order('channel');

  if (error) throw new Error(error.message);

  // Fill in gaps for channels not yet connected
  const channels: Channel[] = ['whatsapp', 'instagram', 'tiktok'];
  const result = [...(data ?? [])] as ChannelIntegration[];
  for (const ch of channels) {
    if (!result.find(r => r.channel === ch)) {
      result.push(DISCONNECTED(ch));
    }
  }
  return result;
}

export async function getIntegration(channel: Channel): Promise<ChannelIntegration | null> {
  if (!isSupabaseConfigured) return DISCONNECTED(channel);

  const { data, error } = await supabase
    .from('channel_integrations')
    .select('*')
    .eq('channel', channel)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as ChannelIntegration) ?? DISCONNECTED(channel);
}

export async function disconnectChannel(channel: Channel): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('channel_integrations')
    .update({ status: 'disconnected', access_token: null, last_sync: null })
    .eq('channel', channel);
  if (error) throw new Error(error.message);
}

export function getWebhookUrl(channel: Channel): string {
  const base = import.meta.env.VITE_SUPABASE_URL ?? '';
  return `${base}/functions/v1/${channel}-webhook`;
}
