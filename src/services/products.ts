import { supabase, isSupabaseConfigured } from './supabase';
import { featuredProducts, productDetail } from '@/mocks/products';
import type { Product, ProductDetail } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return featuredProducts as Product[];
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  if (!isSupabaseConfigured) return productDetail as ProductDetail;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateStock(id: string, quantity: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('products').update({ stock: quantity }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw new Error(error.message);
  return data;
}
