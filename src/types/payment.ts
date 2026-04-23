import type { PaymentMethod } from '@/types/sale';

export type TransactionStatus = 'verified' | 'pending' | 'needs_review' | 'failed';

export interface Transaction {
  id: string;
  customer: string;
  amount: string;
  method: PaymentMethod;
  status: TransactionStatus;
  reference: string;
  date: string;
  product: string;
}

export interface VerificationQueueItem {
  id: string;
  customer: string;
  amount: string;
  method: PaymentMethod;
  reference: string;
  proofNote: string;
  time: string;
}

export interface PaymentStats {
  totalCollected: { value: string; change: string };
  pendingVerification: { value: string; count: number };
  outstandingBalance: { value: string; count: number };
  reconciliationQueue: { value: number; label: string };
}
