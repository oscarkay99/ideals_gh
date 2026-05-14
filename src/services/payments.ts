import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';
import type { Transaction, VerificationQueueItem, TransactionStatus } from '@/types/payment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupBySession(rows: any[]): Transaction[] {
  const sessions = new Map<string, any>();
  for (const row of rows) {
    const key = row.session_id ?? row.id;
    if (!sessions.has(key)) {
      sessions.set(key, { ...row, totalRevenue: 0, products: [] });
    }
    const s = sessions.get(key)!;
    s.totalRevenue += Number(row.revenue ?? 0);
    s.products.push(row.product_name);
  }
  return Array.from(sessions.values()).map((s) => ({
    id: s.session_id ?? s.id,
    customer: s.customer_name ?? (s.customer_id ? `ID:${String(s.customer_id).slice(0, 8)}` : 'Walk-in'),
    customerPhone: s.customer_phone ?? null,
    customerId: s.customer_id ?? null,
    amount: `GHS ${Number(s.totalRevenue).toLocaleString()}`,
    method: s.payment_method ?? 'Cash',
    status: 'verified' as TransactionStatus,
    reference: String(s.session_id ?? s.id).slice(0, 8).toUpperCase(),
    date: s.sale_date ?? s.created_at?.slice(0, 10) ?? '—',
    product: s.products[0] ?? '—',
  }));
}

export async function getTransactions(): Promise<Transaction[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('pos_transactions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return groupBySession(data ?? []);
}

export async function getVerificationQueue(): Promise<VerificationQueueItem[]> {
  return [];
}

export async function verifyTransaction(id: string, status: TransactionStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'verify',
      entityType: 'pos_transactions',
      entityId: id,
      summary: `Verify transaction ${id} as ${status}`,
      metadata: { module: 'payments', status },
    },
    async () => {
      const { error } = await supabase
        .from('pos_transactions')
        .update({ status })
        .eq('session_id', id);
      if (error) throw new Error(error.message);
    },
  );
}
