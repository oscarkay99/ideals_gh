import { supabase, isSupabaseConfigured } from './supabase';

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
  const { data, error } = await supabase.from('inventory').insert(item).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function setInventoryStock(id: string, stock: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('inventory').update({ stock }).eq('id', id);
  if (error) throw new Error(error.message);
}
