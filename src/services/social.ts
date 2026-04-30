import { supabase, isSupabaseConfigured } from './supabase';
import { waContacts, waConversations } from '@/mocks/whatsapp';
import { igContacts, igConversations } from '@/mocks/instagram';
import { tiktokChats } from '@/mocks/tiktok';

export type Channel = 'whatsapp' | 'instagram' | 'tiktok' | 'sms';

export interface SocialContact {
  id: string;
  channel: Channel;
  channel_contact_id: string;
  display_name: string | null;
  phone: string | null;
  username: string | null;
  avatar_url: string | null;
  customer_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SocialConversation {
  id: string;
  channel: Channel;
  contact_id: string;
  status: 'open' | 'resolved' | 'pending';
  last_message_at: string;
  unread_count: number;
  ai_enabled: boolean;
  contact?: SocialContact;
}

export interface SocialMessage {
  id: string;
  conversation_id: string;
  channel: Channel;
  direction: 'inbound' | 'outbound';
  sender_type: 'customer' | 'agent' | 'ai';
  content: string;
  content_type: string;
  ai_generated: boolean;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  channels: Channel[];
  trigger_keywords: string[];
  trigger_type: string;
  ai_prompt: string | null;
  response_template: string | null;
  icon: string;
  color_class: string;
  icon_color: string;
  is_active: boolean;
  runs: number;
  conversions: number;
}

export interface ScheduledPost {
  id: string;
  channels: Channel[];
  content: string;
  media_urls: string[];
  scheduled_at: string;
  status: 'scheduled' | 'published' | 'failed' | 'draft';
  ai_generated: boolean;
  published_at: string | null;
  platform_post_ids: Record<string, string>;
  created_at: string;
}

// ─── Mock adapters (used when Supabase is not configured) ─────────────────────

function mockContacts(channel: Channel) {
  if (channel === 'whatsapp') return waContacts.map(c => ({
    id: c.id, channel, channel_contact_id: c.id, display_name: c.name,
    phone: c.phone, username: null, avatar_url: null, customer_id: null, metadata: {}, created_at: new Date().toISOString(),
  }));
  if (channel === 'instagram') return igContacts.map(c => ({
    id: c.id, channel, channel_contact_id: c.id, display_name: c.displayName,
    phone: null, username: c.name, avatar_url: null, customer_id: null, metadata: {}, created_at: new Date().toISOString(),
  }));
  return tiktokChats.map(c => ({
    id: c.id, channel, channel_contact_id: c.id, display_name: c.name,
    phone: null, username: c.name, avatar_url: c.avatar, customer_id: null, metadata: {}, created_at: new Date().toISOString(),
  }));
}

function mockMessages(channel: Channel, contactId: string): SocialMessage[] {
  let msgs: { from: string; text: string; time: string; aiGenerated?: boolean }[] = [];
  if (channel === 'whatsapp') msgs = waConversations[contactId] ?? [];
  else if (channel === 'instagram') msgs = igConversations[contactId] ?? [];
  else {
    const chat = tiktokChats.find(c => c.id === contactId);
    msgs = (chat?.messages ?? []).map(m => ({ from: m.sender === 'them' ? 'customer' : m.sender, text: m.text, time: m.time }));
  }
  return msgs.map((m, i) => ({
    id: `mock-${contactId}-${i}`,
    conversation_id: `conv-${contactId}`,
    channel,
    direction: m.from === 'customer' ? 'inbound' : 'outbound',
    sender_type: (m.from === 'ai' ? 'ai' : m.from === 'agent' ? 'agent' : 'customer') as SocialMessage['sender_type'],
    content: m.text,
    content_type: 'text',
    ai_generated: !!(m as any).aiGenerated,
    created_at: new Date().toISOString(),
  }));
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function getConversations(channel: Channel): Promise<(SocialConversation & { contact: SocialContact })[]> {
  if (!isSupabaseConfigured) {
    return mockContacts(channel).map(c => ({
      id: `conv-${c.id}`,
      channel,
      contact_id: c.id,
      status: 'open' as const,
      last_message_at: new Date().toISOString(),
      unread_count: 0,
      ai_enabled: true,
      contact: c as SocialContact,
    }));
  }

  const { data, error } = await supabase
    .from('social_conversations')
    .select('*, contact:social_contacts(*)')
    .eq('channel', channel)
    .order('last_message_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as (SocialConversation & { contact: SocialContact })[];
}

export async function getMessages(conversationId: string, channel: Channel, contactId?: string): Promise<SocialMessage[]> {
  if (!isSupabaseConfigured && contactId) {
    return mockMessages(channel, contactId);
  }

  const { data, error } = await supabase
    .from('social_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function sendAgentMessage(conversationId: string, channel: Channel, content: string): Promise<SocialMessage> {
  if (!isSupabaseConfigured) {
    return {
      id: `mock-${Date.now()}`,
      conversation_id: conversationId,
      channel,
      direction: 'outbound',
      sender_type: 'agent',
      content,
      content_type: 'text',
      ai_generated: false,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('social_messages')
    .insert({ conversation_id: conversationId, channel, direction: 'outbound', sender_type: 'agent', content })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from('social_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId);

  return data;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('social_conversations').update({ unread_count: 0 }).eq('id', conversationId);
}

export async function toggleAiEnabled(conversationId: string, enabled: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('social_conversations').update({ ai_enabled: enabled }).eq('id', conversationId);
}

// ─── Automation Rules ─────────────────────────────────────────────────────────

export async function getAutomationRules(channel?: Channel): Promise<AutomationRule[]> {
  if (!isSupabaseConfigured) return [];

  let query = supabase.from('social_automation_rules').select('*').order('created_at');
  if (channel) query = query.contains('channels', [channel]);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function toggleAutomationRule(id: string, is_active: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('social_automation_rules').update({ is_active }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createAutomationRule(rule: Omit<AutomationRule, 'id' | 'runs' | 'conversions'>): Promise<AutomationRule> {
  const { data, error } = await supabase.from('social_automation_rules').insert(rule).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// ─── Scheduled Posts ──────────────────────────────────────────────────────────

export async function getScheduledPosts(): Promise<ScheduledPost[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('scheduled_posts').select('*').order('scheduled_at');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createScheduledPost(post: Omit<ScheduledPost, 'id' | 'published_at' | 'platform_post_ids' | 'created_at'>): Promise<ScheduledPost> {
  const { data, error } = await supabase.from('scheduled_posts').insert(post).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function publishNow(postId: string): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ post_id: postId }),
  });
  if (!res.ok) throw new Error(`Publish failed: ${await res.text()}`);
}

// ─── Realtime subscriptions ───────────────────────────────────────────────────

export function subscribeToMessages(conversationId: string, onMessage: (msg: SocialMessage) => void) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'social_messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => onMessage(payload.new as SocialMessage))
    .subscribe();
}

export function subscribeToConversations(channel: Channel, onUpdate: (conv: SocialConversation) => void) {
  return supabase
    .channel(`conversations:${channel}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'social_conversations',
      filter: `channel=eq.${channel}`,
    }, (payload) => onUpdate(payload.new as SocialConversation))
    .subscribe();
}
