import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';

export interface CalendarEvent {
  id: string;
  title: string;
  customer: string;
  phone: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  notes?: string;
  color?: string;
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'events',
      summary: `Create calendar event ${event.title}`,
      metadata: { module: 'events', type: event.type, date: event.date },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('events').insert(event).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}

export async function updateCalendarEvent(id: string, patch: Partial<Omit<CalendarEvent, 'id'>>): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update',
      entityType: 'events',
      entityId: id,
      summary: `Update calendar event ${id}`,
      metadata: { module: 'events', fields: Object.keys(patch) },
    },
    async () => {
      const { error } = await supabase.from('events').update(patch).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}
