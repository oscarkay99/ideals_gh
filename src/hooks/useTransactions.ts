import { useState, useEffect } from 'react';
import { getTransactions, verifyTransaction } from '@/services/payments';
import { transactions as mockData } from '@/mocks/payments';
import type { Transaction, TransactionStatus } from '@/types/payment';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockData as Transaction[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions()
      .then(data => { if (data.length > 0) setTransactions(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const verify = async (id: string, status: TransactionStatus) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try { await verifyTransaction(id, status); } catch { /* optimistic */ }
  };

  return { transactions, loading, verify };
}
