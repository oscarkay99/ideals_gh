import { supabase, isSupabaseConfigured } from './supabase';

export interface POItem {
  name: string;
  qty: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: POItem[];
  totalValue: number;
  status: string;
  orderedDate: string;
  expectedDate: string;
  deliveredDate: string | null;
  paymentTerms: string;
  notes?: string;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('ordered_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    supplier: row.supplier,
    items: row.items ?? [],
    totalValue: row.total_value,
    status: row.status,
    orderedDate: row.ordered_date,
    expectedDate: row.expected_date,
    deliveredDate: row.delivered_date,
    paymentTerms: row.payment_terms ?? '',
    notes: row.notes,
  }));
}

export async function createPurchaseOrder(po: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert({
      supplier: po.supplier,
      items: po.items,
      total_value: po.totalValue,
      status: po.status,
      ordered_date: po.orderedDate,
      expected_date: po.expectedDate,
      delivered_date: po.deliveredDate,
      payment_terms: po.paymentTerms,
      notes: po.notes,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    supplier: data.supplier,
    items: data.items ?? [],
    totalValue: data.total_value,
    status: data.status,
    orderedDate: data.ordered_date,
    expectedDate: data.expected_date,
    deliveredDate: data.delivered_date,
    paymentTerms: data.payment_terms ?? '',
    notes: data.notes,
  };
}
