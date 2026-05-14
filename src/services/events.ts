import { supabase, isSupabaseConfigured } from './supabase';

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
  const { data, error } = await supabase.from('events').insert(event).select().single();
  if (error) throw new Error(error.message);
  return data;
}
