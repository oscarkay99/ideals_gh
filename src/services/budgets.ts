import { supabase, isSupabaseConfigured } from './supabase';

export interface Budget {
  categoryId: string;
  amount: number;
}

export async function getBudgets(): Promise<Budget[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('budgets').select('category_id, amount');
  if (error) throw new Error(error.message);
  return (data ?? []).map(r => ({ categoryId: r.category_id as string, amount: r.amount as number }));
}

export async function upsertBudget(categoryId: string, amount: number): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('budgets')
    .upsert({ category_id: categoryId, amount, updated_at: new Date().toISOString() }, { onConflict: 'category_id' });
  if (error) throw new Error(error.message);
}
