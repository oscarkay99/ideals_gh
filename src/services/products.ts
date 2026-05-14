import { supabase, isSupabaseConfigured } from './supabase';
import { runAuditedMutation } from './audit';
import { featuredProducts, productDetail } from '@/mocks/products';
import type { Product, ProductDetail } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return featuredProducts as Product[];
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  if (!isSupabaseConfigured) return productDetail as ProductDetail;
  const { data, error } = await supabase.from('inventory').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateStock(id: string, quantity: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  await runAuditedMutation(
    {
      layer: 'service',
      action: 'update_stock',
      entityType: 'inventory',
      entityId: id,
      summary: `Update storefront stock for ${id} to ${quantity}`,
      metadata: { module: 'products', quantity },
    },
    async () => {
      const { error } = await supabase.from('inventory').update({ stock: quantity }).eq('id', id);
      if (error) throw new Error(error.message);
    },
  );
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return runAuditedMutation(
    {
      layer: 'service',
      action: 'create',
      entityType: 'inventory',
      summary: `Create product ${product.name}`,
      metadata: { module: 'products', category: product.category },
      getEntityId: (created) => created.id,
    },
    async () => {
      const { data, error } = await supabase.from('inventory').insert(product).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  );
}
