import { supabase, isSupabaseConfigured } from './supabase';
import type { Customer } from '@/types/customer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCustomer(row: any): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    segment: row.segment,
    ltv: row.ltv,
    orders: row.orders,
    lastOrder: row.last_order,
    avgOrder: row.avg_order,
    warranties: row.warranties,
    repairs: row.repairs,
    since: row.since,
  };
}

function toRow(c: Omit<Customer, 'id'>) {
  return {
    name: c.name, phone: c.phone, email: c.email, segment: c.segment,
    ltv: c.ltv, orders: c.orders, last_order: c.lastOrder,
    avg_order: c.avgOrder, warranties: c.warranties, repairs: c.repairs, since: c.since,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('customers').select('*').order('name');
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapCustomer);
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data ? mapCustomer(data) : null;
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('customers').insert(toRow(customer)).select().single();
  if (error) throw new Error(error.message);
  return mapCustomer(data);
}
