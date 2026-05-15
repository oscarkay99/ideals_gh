import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  leadTime: string;
  paymentTerms: string;
  rating: number;
  totalOrders: number;
  notes?: string;
  createdAt?: string;
}

function toRow(s: Omit<Supplier, 'id' | 'createdAt'>) {
  return {
    name: s.name,
    category: s.category,
    contact: s.contact,
    lead_time: s.leadTime,
    payment_terms: s.paymentTerms,
    rating: s.rating,
    total_orders: s.totalOrders,
    notes: s.notes ?? null,
  };
}

function fromRow(r: Record<string, unknown>): Supplier {
  return {
    id: r.id as string,
    name: r.name as string,
    category: r.category as string,
    contact: r.contact as string,
    leadTime: r.lead_time as string,
    paymentTerms: r.payment_terms as string,
    rating: r.rating as number,
    totalOrders: r.total_orders as number,
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
  };
}

export async function getSuppliers(): Promise<Supplier[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('suppliers').select('*').order('name');
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'suppliers',
      summary: `Create supplier ${supplier.name}`,
      metadata: { module: 'suppliers' },
      getEntityId: (created) => (created as Supplier).id,
    },
    async () => {
      const { data, error } = await supabase.from('suppliers').insert(toRow(supplier)).select().single();
      if (error) throw new Error(error.message);
      return fromRow(data);
    },
  );
}

export async function updateSupplier(id: string, updates: Partial<Omit<Supplier, 'id' | 'createdAt'>>): Promise<Supplier> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'update',
      entityType: 'suppliers',
      entityId: id,
      summary: `Update supplier ${id}`,
      metadata: { module: 'suppliers' },
    },
    async () => {
      const partial: Record<string, unknown> = {};
      if (updates.name !== undefined) partial.name = updates.name;
      if (updates.category !== undefined) partial.category = updates.category;
      if (updates.contact !== undefined) partial.contact = updates.contact;
      if (updates.leadTime !== undefined) partial.lead_time = updates.leadTime;
      if (updates.paymentTerms !== undefined) partial.payment_terms = updates.paymentTerms;
      if (updates.rating !== undefined) partial.rating = updates.rating;
      if (updates.notes !== undefined) partial.notes = updates.notes;
      const { data, error } = await supabase.from('suppliers').update(partial).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return fromRow(data);
    },
  );
}

export async function deleteSupplier(id: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'delete',
      entityType: 'suppliers',
      entityId: id,
      summary: `Delete supplier ${id}`,
      metadata: { module: 'suppliers' },
    },
    async () => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}
