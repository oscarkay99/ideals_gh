import { supabase, isSupabaseConfigured } from './supabase';
import { repairs } from '@/mocks/repairs';
import type { Repair, RepairStatus } from '@/types/repair';

export async function getRepairs(): Promise<Repair[]> {
  if (!isSupabaseConfigured) return repairs as Repair[];
  const { data, error } = await supabase.from('repairs').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateRepairStatus(id: string, status: RepairStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('repairs').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createRepair(repair: Omit<Repair, 'id'>): Promise<Repair> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('repairs').insert(repair).select().single();
  if (error) throw new Error(error.message);
  return data;
}
