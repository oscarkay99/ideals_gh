import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';

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

export async function updateExpense(id: string, updates: Partial<Omit<Expense, 'id'>>): Promise<Expense> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'update',
      entityType: 'expenses',
      entityId: id,
      summary: `Update expense ${id}`,
      metadata: { module: 'expenses', ...updates },
    },
    async () => {
      const { data, error } = await supabase.from('expenses').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}

export async function deleteExpense(id: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'delete',
      entityType: 'expenses',
      entityId: id,
      summary: `Delete expense ${id}`,
      metadata: { module: 'expenses' },
    },
    async () => {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'expenses',
      summary: `Create expense ${expense.description}`,
      metadata: { module: 'expenses', category: expense.category, amount: expense.amount },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('expenses').insert(expense).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}
