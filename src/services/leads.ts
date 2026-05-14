import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';
import type { Lead, LeadStatus } from '@/types/lead';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    source: row.source,
    status: row.status,
    product: row.product,
    budget: row.budget,
    lastContact: row.last_contact,
    assigned: row.assigned,
    notes: row.notes,
    followUp: row.follow_up,
    quoteReady: row.quote_ready,
  };
}

function toRow(l: Omit<Lead, 'id'>) {
  return {
    name: l.name, phone: l.phone, source: l.source, status: l.status,
    product: l.product, budget: l.budget, last_contact: l.lastContact,
    assigned: l.assigned, notes: l.notes, follow_up: l.followUp, quote_ready: l.quoteReady,
  };
}

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapLead);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update_status',
      entityType: 'leads',
      entityId: id,
      summary: `Update lead ${id} status to ${status}`,
      metadata: { module: 'leads', status },
    },
    async () => {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'leads',
      summary: `Create lead ${lead.name}`,
      metadata: { module: 'leads', source: lead.source },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('leads').insert(toRow(lead)).select().single();
      if (error) throw new Error(error.message);
      return mapLead(data);
    },
  );
}
