import { supabase, isSupabaseConfigured } from './supabase';
import { recentSales } from '@/mocks/sales';
import type { Sale, SaleStatus } from '@/types/sale';

export async function getSales(): Promise<Sale[]> {
  if (!isSupabaseConfigured) return recentSales as Sale[];
  const { data, error } = await supabase.from('sales').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateSaleStatus(id: string, status: SaleStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('sales').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('sales').insert(sale).select().single();
  if (error) throw new Error(error.message);
  return data;
}
