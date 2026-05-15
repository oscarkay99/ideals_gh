import { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/services/suppliers';
import type { Supplier } from '@/services/suppliers';
import { useToast } from '@/contexts/ToastContext';

export type { Supplier };

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getSuppliers()
      .then(data => setSuppliers(data))
      .catch((err) => { if (import.meta.env.DEV) console.error('Failed to load suppliers:', err); })
      .finally(() => setLoading(false));
  }, []);

  const add = async (s: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      const created = await createSupplier(s);
      setSuppliers(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      showToast(`${s.name} added`);
      return created;
    } catch {
      const local: Supplier = { ...s, id: `SUP-${Date.now()}` };
      setSuppliers(prev => [...prev, local].sort((a, b) => a.name.localeCompare(b.name)));
      showToast('Supplier saved locally — sync failed', 'warning');
      return local;
    }
  };

  const update = async (id: string, updates: Partial<Omit<Supplier, 'id' | 'createdAt'>>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      await updateSupplier(id, updates);
      showToast('Supplier updated');
    } catch {
      showToast('Could not sync changes', 'warning');
    }
  };

  const remove = async (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    try {
      await deleteSupplier(id);
      showToast('Supplier removed');
    } catch {
      getSuppliers().then(data => setSuppliers(data)).catch(() => {});
      showToast('Could not remove — changes restored', 'error');
    }
  };

  return { suppliers, loading, add, update, remove };
}
