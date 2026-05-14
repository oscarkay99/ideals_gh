import { useState, useEffect } from 'react';
import { getCustomers, createCustomer } from '@/services/customers';
import type { Customer } from '@/types/customer';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

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
      return created;
    } catch {
      const local = { ...c, id: `C${Date.now()}` } as Customer;
      setCustomers(prev => [local, ...prev]);
      return local;
    }
  };

  return { customers, loading, add };
}
