import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';

export interface InventoryRecord {
  id: string;
  name: string;
  category: string;
  color?: string;
  condition: string;
  price: string;
  stock: number;
  location: string;
  supplier: string;
  imei?: string;
  fast_mover?: boolean;
  last_restocked?: string;
}

export async function fetchInventory(): Promise<InventoryRecord[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('inventory').select('*').order('name');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addInventoryItem(item: Omit<InventoryRecord, 'id'>): Promise<InventoryRecord> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'inventory',
      summary: `Create inventory item ${item.name}`,
      metadata: { module: 'inventory', category: item.category },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('inventory').insert(item).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}

export async function setInventoryStock(id: string, stock: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update_stock',
      entityType: 'inventory',
      entityId: id,
      summary: `Set inventory stock for ${id} to ${stock}`,
      metadata: { module: 'inventory', stock },
    },
    async () => {
      const { error } = await supabase.from('inventory').update({ stock }).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}

export async function updateInventoryItem(id: string, item: Omit<InventoryRecord, 'id'>): Promise<InventoryRecord> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'update',
      entityType: 'inventory',
      entityId: id,
      summary: `Update inventory item ${id}`,
      metadata: { module: 'inventory', category: item.category, stock: item.stock },
    },
    async () => {
      const { data, error } = await supabase.from('inventory').update(item).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}
