import { supabase, isSupabaseConfigured } from './supabase';
import { leads } from '@/mocks/leads';
import type { Lead, LeadStatus } from '@/types/lead';

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured) return leads as Lead[];
  const { data, error } = await supabase.from('leads').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('leads').insert(lead).select().single();
  if (error) throw new Error(error.message);
  return data;
}
