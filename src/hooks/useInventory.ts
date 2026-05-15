import { useState, useEffect } from 'react';
import { fetchInventory, addInventoryItem, setInventoryStock, updateInventoryItem } from '@/services/inventory';
import { useToast } from '@/contexts/ToastContext';

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  color?: string;
  condition: string;
  price: string;
  costPrice?: number;
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
  const { showToast } = useToast();

  useEffect(() => {
    fetchInventory()
      .then(data => setProducts(data.map(r => ({
        id: r.id, name: r.name, category: r.category, color: r.color,
        condition: r.condition, price: r.price, stock: r.stock,
        location: r.location, supplier: r.supplier, imei: r.imei,
        costPrice: r.cost_price ?? undefined,
        fastMover: r.fast_mover ?? undefined,
        lastRestocked: r.last_restocked ?? undefined,
      }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (p: Omit<InventoryProduct, 'id'>) => {
    try {
      const created = await addInventoryItem({
        name: p.name, category: p.category, color: p.color,
        condition: p.condition, price: p.price, stock: p.stock,
        location: p.location, supplier: p.supplier, imei: p.imei,
        cost_price: p.costPrice,
      });
      const item: InventoryProduct = {
        id: created.id, name: created.name, category: created.category, color: created.color,
        condition: created.condition, price: created.price, stock: created.stock,
        location: created.location, supplier: created.supplier, imei: created.imei,
        costPrice: created.cost_price ?? undefined,
      };
      setProducts(prev => [item, ...prev]);
      showToast(`${p.name} added to inventory`);
      return item;
    } catch {
      const local = { ...p, id: `P${Date.now()}` } as InventoryProduct;
      setProducts(prev => [local, ...prev]);
      showToast('Product saved locally — sync failed', 'warning');
      return local;
    }
  };

  const adjustStock = async (id: string, qty: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: qty } : p));
    try {
      await setInventoryStock(id, qty);
      showToast('Stock updated');
    } catch {
      showToast('Could not sync stock update', 'warning');
    }
  };

  const update = async (id: string, p: Omit<InventoryProduct, 'id'>) => {
    const updated: InventoryProduct = { ...p, id };
    setProducts(prev => prev.map(x => x.id === id ? updated : x));
    try {
      await updateInventoryItem(id, {
        name: p.name, category: p.category, color: p.color,
        condition: p.condition, price: p.price, stock: p.stock,
        location: p.location, supplier: p.supplier, imei: p.imei,
        cost_price: p.costPrice,
      });
      showToast(`${p.name} updated`);
    } catch {
      showToast('Could not sync changes', 'warning');
    }
    return updated;
  };

  return { products, loading, add, update, adjustStock };
}
