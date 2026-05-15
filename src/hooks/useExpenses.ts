import { useState, useEffect } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/services/expenses';
import type { Expense } from '@/services/expenses';
import { useToast } from '@/contexts/ToastContext';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getExpenses()
      .then(data => setExpenses(data))
      .catch((err) => { if (import.meta.env.DEV) console.error('Failed to load expenses:', err); })
      .finally(() => setLoading(false));
  }, []);

  const add = async (e: Omit<Expense, 'id'>) => {
    try {
      const created = await createExpense(e);
      setExpenses(prev => [created, ...prev]);
      showToast('Expense added');
      return created;
    } catch {
      const local: Expense = { ...e, id: `EXP-${Date.now()}` };
      setExpenses(prev => [local, ...prev]);
      showToast('Expense saved locally — sync failed', 'warning');
      return local;
    }
  };

  const update = async (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    try {
      await updateExpense(id, updates);
      showToast('Expense updated');
    } catch {
      showToast('Could not sync changes', 'warning');
    }
  };

  const remove = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    try {
      await deleteExpense(id);
      showToast('Expense deleted');
    } catch {
      getExpenses().then(data => setExpenses(data)).catch(() => {});
      showToast('Could not delete — changes restored', 'error');
    }
  };

  return { expenses, loading, add, update, remove };
}
