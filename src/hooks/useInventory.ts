import { useState, useEffect } from 'react';
import { getProducts, updateStock } from '@/services/products';
import { inventoryProducts as mockData } from '@/mocks/inventory';

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  condition: string;
  price: string;
  stock: number;
  location: string;
  supplier: string;
  lastRestocked?: string;
  fastMover?: boolean;
  imei?: string;
}

export function useInventory() {
  const [products, setProducts] = useState<InventoryProduct[]>(mockData as InventoryProduct[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(data => { if (data.length > 0) setProducts(data as unknown as InventoryProduct[]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = (p: Omit<InventoryProduct, 'id'>) => {
    const local = { ...p, id: `P${Date.now()}` } as InventoryProduct;
    setProducts(prev => [local, ...prev]);
    return local;
  };

  const adjustStock = async (id: string, qty: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: qty } : p));
    try { await updateStock(id, qty); } catch { /* optimistic */ }
  };

  return { products, loading, add, adjustStock };
}
