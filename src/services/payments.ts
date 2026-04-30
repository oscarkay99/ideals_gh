import { supabase, isSupabaseConfigured } from './supabase';
import { transactions, verificationQueue } from '@/mocks/payments';
import type { Transaction, VerificationQueueItem, TransactionStatus } from '@/types/payment';

export async function getTransactions(): Promise<Transaction[]> {
  if (!isSupabaseConfigured) return transactions as Transaction[];
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getVerificationQueue(): Promise<VerificationQueueItem[]> {
  if (!isSupabaseConfigured) return verificationQueue as VerificationQueueItem[];
  const { data, error } = await supabase.from('transactions').select('*').eq('status', 'pending');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function verifyTransaction(id: string, status: TransactionStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('transactions').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}
