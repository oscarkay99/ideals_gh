export type ProductCondition = 'New' | 'Refurbished' | 'Used - Good' | 'Used - Fair';
export type ProductCategory = 'Phones' | 'Laptops' | 'Accessories' | 'Tablets' | 'Wearables';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface ProductReview {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface ConditionDetails {
  grade: string;
  batteryHealth: string;
  cosmetic: string;
  includes: string[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: string;
  originalPrice: string | null;
  stock: number;
  warranty: string;
  image: string;
  badge: string | null;
}

export interface ProductDetail extends Product {
  conditionDetails: ConditionDetails;
  warrantyDetails: string;
  images: string[];
  specs: ProductSpec[];
  addOns: ProductAddOn[];
  reviews: ProductReview[];
}

export interface CartProduct {
  id: string;
  name: string;
  condition: ProductCondition;
  price: number;
  stock: number;
  image: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}
