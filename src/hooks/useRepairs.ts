import { useState, useEffect } from 'react';
import { getRepairs, createRepair, updateRepairStatus } from '@/services/repairs';
import { repairs as mockData } from '@/mocks/repairs';
import type { Repair, RepairStatus } from '@/types/repair';

export function useRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>(mockData as Repair[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepairs()
      .then(data => { if (data.length > 0) setRepairs(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (r: Omit<Repair, 'id'>) => {
    try {
      const created = await createRepair(r);
      setRepairs(prev => [created, ...prev]);
      return created;
    } catch {
      const local = { ...r, id: `R-${Date.now()}` } as Repair;
      setRepairs(prev => [local, ...prev]);
      return local;
    }
  };

  const updateStatus = async (id: string, status: RepairStatus) => {
    setRepairs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try { await updateRepairStatus(id, status); } catch { /* optimistic */ }
  };

  const addNote = (id: string, note: string) => {
    setRepairs(prev => prev.map(r => r.id === id ? { ...r, notes: [...(r.notes ?? []), note] } : r));
  };

  return { repairs, loading, add, updateStatus, addNote };
}
