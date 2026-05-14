import { supabase, isSupabaseConfigured } from './supabase';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  status: string;
  type: string;
}

export async function getExpenses(): Promise<Expense[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('expenses').insert(expense).select().single();
  if (error) throw new Error(error.message);
  return data;
}
