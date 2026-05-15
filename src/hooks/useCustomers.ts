import { useState, useEffect } from 'react';
import { getCustomers, createCustomer } from '@/services/customers';
import type { Customer } from '@/types/customer';
import { useToast } from '@/contexts/ToastContext';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getCustomers()
      .then(data => setCustomers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (c: Omit<Customer, 'id'>) => {
    try {
      const created = await createCustomer(c);
      setCustomers(prev => [created, ...prev]);
      showToast(`${c.name} added`);
      return created;
    } catch {
      const local = { ...c, id: `C${Date.now()}` } as Customer;
      setCustomers(prev => [local, ...prev]);
      showToast('Customer saved locally — sync failed', 'warning');
      return local;
    }
  };

  return { customers, loading, add };
}
