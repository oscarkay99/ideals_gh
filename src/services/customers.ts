import { supabase, isSupabaseConfigured } from './supabase';
import { customers } from '@/mocks/customers';
import type { Customer } from '@/types/customer';

export async function getCustomers(): Promise<Customer[]> {
  if (!isSupabaseConfigured) return customers as Customer[];
  const { data, error } = await supabase.from('customers').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!isSupabaseConfigured) return customers.find(c => c.id === id) as Customer ?? null;
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('customers').insert(customer).select().single();
  if (error) throw new Error(error.message);
  return data;
}
