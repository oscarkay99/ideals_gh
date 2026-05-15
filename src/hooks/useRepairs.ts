import { useState, useEffect } from 'react';
import { getRepairs, createRepair, updateRepairStatus, updateRepairNotes } from '@/services/repairs';
import type { Repair, RepairStatus } from '@/types/repair';
import { useToast } from '@/contexts/ToastContext';

export function useRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getRepairs()
      .then(data => setRepairs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (r: Omit<Repair, 'id'>) => {
    try {
      const created = await createRepair(r);
      setRepairs(prev => [created, ...prev]);
      showToast('Repair job created');
      return created;
    } catch {
      const local = { ...r, id: `R-${Date.now()}` } as Repair;
      setRepairs(prev => [local, ...prev]);
      showToast('Repair saved locally — sync failed', 'warning');
      return local;
    }
  };

  const updateStatus = async (id: string, status: RepairStatus) => {
    setRepairs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await updateRepairStatus(id, status);
      showToast('Status updated');
    } catch {
      showToast('Could not sync status', 'warning');
    }
  };

  const addNote = (id: string, note: string) => {
    setRepairs(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, notes: [...(r.notes ?? []), note] } : r);
      const repair = updated.find(r => r.id === id);
      if (repair) {
        updateRepairNotes(id, repair.notes ?? [])
          .then(() => showToast('Note added'))
          .catch(() => showToast('Could not sync note', 'warning'));
      }
      return updated;
    });
  };

  return { repairs, loading, add, updateStatus, addNote };
}
