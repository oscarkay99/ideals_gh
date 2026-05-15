import { useState, useEffect } from 'react';
import { getSales, createSale, updateSaleStatus } from '@/services/sales';
import { useToast } from '@/contexts/ToastContext';
import type { Sale, SaleStatus } from '@/types/sale';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getSales()
      .then(data => setSales(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (s: Omit<Sale, 'id'>) => {
    try {
      const created = await createSale(s);
      setSales(prev => [created, ...prev]);
      return created;
    } catch {
      const local = { ...s, id: `S-${Date.now()}` } as Sale;
      setSales(prev => [local, ...prev]);
      return local;
    }
  };

  const voidSale = async (id: string, status: 'cancelled' | 'refunded') => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    try {
      await updateSaleStatus(id, status);
      showToast(`Sale ${status === 'cancelled' ? 'voided' : 'marked as refunded'}`);
    } catch {
      showToast('Could not sync status change', 'warning');
    }
  };

  return { sales, loading, add, voidSale };
}
