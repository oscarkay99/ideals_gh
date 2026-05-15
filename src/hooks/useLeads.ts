import { useState, useEffect } from 'react';
import { getLeads, createLead, updateLeadStatus } from '@/services/leads';
import type { Lead, LeadStatus } from '@/types/lead';
import { useToast } from '@/contexts/ToastContext';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getLeads()
      .then(data => setLeads(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (l: Omit<Lead, 'id'>) => {
    try {
      const created = await createLead(l);
      setLeads(prev => [created, ...prev]);
      showToast('Lead added');
      return created;
    } catch {
      const local = { ...l, id: `L${Date.now()}` } as Lead;
      setLeads(prev => [local, ...prev]);
      showToast('Lead saved locally — sync failed', 'warning');
      return local;
    }
  };

  const move = async (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    try {
      await updateLeadStatus(id, status);
      showToast('Lead status updated');
    } catch {
      showToast('Could not sync status', 'warning');
    }
  };

  return { leads, loading, add, move };
}
