import { useState, useEffect } from 'react';
import { fetchInventory, addInventoryItem, setInventoryStock } from '@/services/inventory';

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  color?: string;
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
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory()
      .then(data => setProducts(data as unknown as InventoryProduct[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (p: Omit<InventoryProduct, 'id'>) => {
    try {
      const created = await addInventoryItem({
        name: p.name, category: p.category, color: p.color,
        condition: p.condition, price: p.price, stock: p.stock,
        location: p.location, supplier: p.supplier, imei: p.imei,
      });
      const item = created as unknown as InventoryProduct;
      setProducts(prev => [item, ...prev]);
      return item;
    } catch {
      const local = { ...p, id: `P${Date.now()}` } as InventoryProduct;
      setProducts(prev => [local, ...prev]);
      return local;
    }
  };

  const adjustStock = async (id: string, qty: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: qty } : p));
    try { await setInventoryStock(id, qty); } catch { /* optimistic */ }
  };

  return { products, loading, add, adjustStock };
}
