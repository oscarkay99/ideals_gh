import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';
import type { Sale, SaleStatus } from '@/types/sale';

export async function getSales(): Promise<Sale[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('sales').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateSaleStatus(id: string, status: SaleStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update_status',
      entityType: 'sales',
      entityId: id,
      summary: `Update sale ${id} status to ${status}`,
      metadata: { module: 'sales', status },
    },
    async () => {
      const { error } = await supabase.from('sales').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}

export async function createSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'sales',
      summary: `Create sale for ${sale.customer}`,
      metadata: { module: 'sales', method: sale.method, status: sale.status },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('sales').insert(sale).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}
