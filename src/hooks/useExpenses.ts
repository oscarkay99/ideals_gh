import { useState, useEffect } from 'react';
import { getExpenses, createExpense } from '@/services/expenses';
import { recentTransactions as mockData } from '@/mocks/expenses';
import type { Expense } from '@/services/expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockData as Expense[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpenses()
      .then(data => { if (data.length > 0) setExpenses(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (e: Omit<Expense, 'id'>) => {
    try {
      const created = await createExpense(e);
      setExpenses(prev => [created, ...prev]);
      return created;
    } catch {
      const local: Expense = { ...e, id: `EXP-${Date.now()}` };
      setExpenses(prev => [local, ...prev]);
      return local;
    }
  };

  return { expenses, loading, add };
}
