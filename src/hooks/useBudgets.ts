import { useState, useEffect } from 'react';
import { getBudgets, upsertBudget } from '@/services/budgets';
import { useToast } from '@/contexts/ToastContext';

export function useBudgets() {
  const [budgetMap, setBudgetMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getBudgets()
      .then(data => {
        const map: Record<string, number> = {};
        data.forEach(b => { map[b.categoryId] = b.amount; });
        setBudgetMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setBudget = async (categoryId: string, amount: number) => {
    setBudgetMap(prev => ({ ...prev, [categoryId]: amount }));
    try {
      await upsertBudget(categoryId, amount);
      showToast('Budget updated');
    } catch {
      showToast('Could not save budget', 'error');
    }
  };

  return { budgetMap, loading, setBudget };
}
