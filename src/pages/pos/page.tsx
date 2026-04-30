import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { posProducts, posRecentSales } from '@/mocks/pos';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import RecentSalesList from './components/RecentSalesList';
import ReceiptModal from './components/ReceiptModal';

type CartItem = { id: string; qty: number; discount: number };

const categories = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google', 'Tecno', 'Accessories'];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['momo']);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, number>>({});

  const filtered = posProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, qty: 1, discount: 0 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const updateItemDiscount = (id: string, disc: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, discount: disc } : i));

  const cartItems = cart.map(c => {
    const product = posProducts.find(p => p.id === c.id)!;
    const lineTotal = product.price * c.qty * (1 - c.discount / 100);
    return { ...product, qty: c.qty, discount: c.discount, lineTotal };
  });

  const subtotal = cartItems.reduce((s, i) => s + i.lineTotal, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const togglePayment = (id: string) => {
    setSelectedPayments(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const completeSale = () => {
    if (cartItems.length === 0) return;
    setShowReceipt(true);
  };

  const newSale = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    setSelectedPayments(['momo']);
    setShowReceipt(false);
  };

  return (
    <AdminLayout title="Point of Sale" subtitle="In-store checkout · Fast · Accurate">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-full">
        <ProductGrid
          products={filtered}
          cart={cart}
          search={search}
          onSearch={setSearch}
          category={category}
          onCategory={setCategory}
          onAddToCart={addToCart}
          categories={categories}
        />

        <CartPanel
          cartItems={cartItems}
          subtotal={subtotal}
          discountAmount={discountAmount}
          total={total}
          discount={discount}
          onDiscountChange={setDiscount}
          selectedPayments={selectedPayments}
          onTogglePayment={togglePayment}
          splitAmounts={splitAmounts}
          onSplitAmountChange={(id, v) => setSplitAmounts(prev => ({ ...prev, [id]: v }))}
          customerName={customerName}
          onCustomerName={setCustomerName}
          customerPhone={customerPhone}
          onCustomerPhone={setCustomerPhone}
          onUpdateQty={updateQty}
          onRemoveFromCart={removeFromCart}
          onUpdateItemDiscount={updateItemDiscount}
          onClearCart={() => setCart([])}
          onCompleteSale={completeSale}
        />
      </div>

      <div className="mt-5">
        <RecentSalesList sales={posRecentSales} />
      </div>

      <ReceiptModal
        open={showReceipt}
        cartItems={cartItems}
        total={total}
        customerName={customerName}
        customerPhone={customerPhone}
        onNewSale={newSale}
      />
    </AdminLayout>
  );
}
