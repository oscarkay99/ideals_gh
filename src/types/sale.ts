export type SaleStatus = 'completed' | 'pending_payment' | 'packing' | 'cancelled' | 'refunded';
export type PaymentMethod = 'MoMo' | 'Cash' | 'Bank Transfer' | 'Card';
export type DeliveryType = 'Pickup' | 'Delivery';

export interface Sale {
  id: string;
  customer: string;
  items: string;
  total: string;
  method: PaymentMethod;
  status: SaleStatus;
  date: string;
  delivery: DeliveryType;
  cogs?: number;
}

export interface SaleStat {
  label: string;
  value: string;
  change: string;
  icon: string;
  accent: string;
}
