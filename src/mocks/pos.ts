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

export const installmentPlans: never[] = [];

export const tradeInConditions: never[] = [];

export const tradeInDevices: never[] = [];
