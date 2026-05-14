export interface PosProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  type: 'phone' | 'tablet' | 'laptop' | 'audio' | 'accessory' | 'wearable';
  imei?: boolean;
  brand: string;
}

export interface PosCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  totalSpent: number;
  purchaseCount: number;
  lastPurchase: string;
  openRepairs: number;
  tags: string[];
}

export const posProducts: PosProduct[] = [];

export const posCustomers: PosCustomer[] = [];

export const posRecentSales: never[] = [];

export const upsellRules: never[] = [];

export const installmentPlans = [
  { id: 'cash', label: 'Cash / Full Pay', months: 1, rate: 0 },
  { id: '3mo', label: '3 Months', months: 3, rate: 0.05 },
  { id: '6mo', label: '6 Months', months: 6, rate: 0.10 },
  { id: '12mo', label: '12 Months', months: 12, rate: 0.18 },
];

export const tradeInConditions: never[] = [];

export const tradeInDevices: never[] = [];
