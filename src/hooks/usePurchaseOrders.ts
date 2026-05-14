import { useState, useEffect } from 'react';
import { getPurchaseOrders, createPurchaseOrder } from '@/services/purchaseOrders';
import { purchaseOrders as mockData } from '@/mocks/suppliers';
import type { PurchaseOrder } from '@/services/purchaseOrders';

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockData as PurchaseOrder[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPurchaseOrders()
      .then(data => { if (data.length > 0) setOrders(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (po: Omit<PurchaseOrder, 'id'>) => {
    try {
      const created = await createPurchaseOrder(po);
      setOrders(prev => [created, ...prev]);
      return created;
    } catch {
      const local: PurchaseOrder = { ...po, id: `PO-${Date.now()}` };
      setOrders(prev => [local, ...prev]);
      return local;
    }
  };

  return { orders, loading, add };
}
