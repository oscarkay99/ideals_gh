import { useState, useEffect } from 'react';
import { getSales, createSale } from '@/services/sales';
import type { Sale } from '@/types/sale';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { sales, loading, add };
}
