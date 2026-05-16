import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import { useToast } from '@/contexts/ToastContext';

export interface WarrantyReturn {
  id: string;
  customer: string;
  product: string;
  issue: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  notes: string;
}

export function useWarranty() {
  const [returns, setReturns] = useState<WarrantyReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.from('warranty_returns').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReturns(data as WarrantyReturn[]); })
      .finally(() => setLoading(false));

    const channel = supabase.channel('warranty_returns')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'warranty_returns' }, () => {
        supabase.from('warranty_returns').select('*').order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setReturns(data as WarrantyReturn[]); });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addReturn = async (r: Omit<WarrantyReturn, 'id'>) => {
    const id = `WR-${Date.now()}`;
    const item = { ...r, id };
    setReturns(prev => [item, ...prev]);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('warranty_returns').insert(item);
      if (error) showToast('Could not save return — check connection', 'warning');
      else showToast('Return request submitted');
    } else {
      showToast('Return request submitted');
    }
    return item;
  };

  const updateStatus = async (id: string, status: WarrantyReturn['status']) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (isSupabaseConfigured) {
      await supabase.from('warranty_returns').update({ status }).eq('id', id);
    }
    showToast(`Return marked as ${status}`);
  };

  const stats = {
    totalReturns: returns.length,
    pendingReturns: returns.filter(r => r.status === 'pending').length,
    approvedReturns: returns.filter(r => r.status === 'approved').length,
  };

  return { returns, loading, addReturn, updateStatus, stats };
}
