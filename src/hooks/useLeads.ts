import { useState, useEffect } from 'react';
import { getLeads, createLead, updateLeadStatus } from '@/services/leads';
import type { Lead, LeadStatus } from '@/types/lead';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

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
      return created;
    } catch {
      const local = { ...l, id: `L${Date.now()}` } as Lead;
      setLeads(prev => [local, ...prev]);
      return local;
    }
  };

  const move = async (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    try { await updateLeadStatus(id, status); } catch { /* optimistic */ }
  };

  return { leads, loading, add, move };
}
