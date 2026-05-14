import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';
import type { Repair, RepairStatus } from '@/types/repair';

export async function getRepairs(): Promise<Repair[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('repairs').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateRepairStatus(id: string, status: RepairStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update_status',
      entityType: 'repairs',
      entityId: id,
      summary: `Update repair ${id} status to ${status}`,
      metadata: { module: 'repairs', status },
    },
    async () => {
      const { error } = await supabase.from('repairs').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}

export async function createRepair(repair: Omit<Repair, 'id'>): Promise<Repair> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'repairs',
      summary: `Create repair for ${repair.customer}`,
      metadata: { module: 'repairs', device: repair.device },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('repairs').insert(repair).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}

export async function updateRepairNotes(id: string, notes: string[]): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update_notes',
      entityType: 'repairs',
      entityId: id,
      summary: `Update repair notes for ${id}`,
      metadata: { module: 'repairs', notesCount: notes.length },
    },
    async () => {
      const { error } = await supabase.from('repairs').update({ notes }).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}
