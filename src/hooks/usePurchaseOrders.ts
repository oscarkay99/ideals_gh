import { useState, useEffect } from 'react';
import { getPurchaseOrders, createPurchaseOrder } from '@/services/purchaseOrders';
import type { PurchaseOrder } from '@/services/purchaseOrders';
import { useToast } from '@/contexts/ToastContext';

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getPurchaseOrders()
      .then(data => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (po: Omit<PurchaseOrder, 'id'>) => {
    try {
      const created = await createPurchaseOrder(po);
      setOrders(prev => [created, ...prev]);
      showToast('Purchase order created');
      return created;
    } catch {
      const local: PurchaseOrder = { ...po, id: `PO-${Date.now()}` };
      setOrders(prev => [local, ...prev]);
      showToast('Order saved locally — sync failed', 'warning');
      return local;
    }
  };

  return { orders, loading, add };
}
