import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { salesStats, cartProducts } from '@/mocks/sales';
import { useSales } from '@/hooks/useSales';
import CartPanel from './components/CartPanel';
import QuoteModal from './components/QuoteModal';
import type { PaymentMethod, DeliveryType } from '@/types/sale';

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  pending_payment: { label: 'Pending Payment', color: 'bg-amber-100 text-amber-700' },
  packing: { label: 'Packing', color: 'bg-blue-100 text-blue-700' },
};

const methodIcons: Record<string, string> = {
  MoMo: 'ri-smartphone-line',
  'Bank Transfer': 'ri-bank-line',
  Cash: 'ri-money-dollar-circle-line',
  Card: 'ri-bank-card-line',
};

export default function SalesPage() {
  const { sales, add: createSale } = useSales();
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [delivery, setDelivery] = useState<'pickup' | 'delivery'>('pickup');
  const [payment, setPayment] = useState('MoMo');
  const [showQuote, setShowQuote] = useState(false);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));

  const handleProcessOrder = async (customer: string) => {
    if (cartItems.length === 0) return;
    const itemNames = cartItems.map(i => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ''}`).join(', ');
    await createSale({
      customer,
      items: itemNames,
      total: `GHS ${total.toLocaleString()}`,
      method: payment as PaymentMethod,
      status: 'completed',
      date: new Date().toLocaleDateString('en-GH', { month: 'short', day: 'numeric', year: 'numeric' }),
      delivery: delivery === 'pickup' ? 'Pickup' : 'Delivery' as DeliveryType,
    });
    setCart([]);
  };

  const cartItems = cart.map((c) => {
    const product = cartProducts.find((p) => p.id === c.id)!;
    return { ...product, qty: c.qty, lineTotal: product.price * c.qty };
  });

  const subtotal = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const deliveryFee = delivery === 'delivery' ? 50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <AdminLayout title="Sales" subtitle="Create quotes, process orders, and track transactions">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {salesStats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accent} rounded-l-2xl`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{s.change}</p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <i className={`${s.icon} text-lg`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Product Selection */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Select Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cartProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em]">Item</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.id} · {p.condition} · {p.stock} left</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">GHS {p.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer transition-all flex-shrink-0"
                  >
                    <i className="ri-add-line text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sales */}
          <div id="recent-sales-table" className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Recent Sales</h3>
              <button onClick={() => document.getElementById('recent-sales-table')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Order', 'Customer', 'Items', 'Total', 'Method', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-400">
                        <i className="ri-shopping-bag-3-line text-3xl block mb-2 text-slate-200" />
                        No sales yet. Use the POS to record your first sale.
                      </td>
                    </tr>
                  )}
                  {sales.map((s, i) => (
                    <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/20'}`}>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{s.id}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-800">{s.customer}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[140px] truncate">{s.items}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{s.total}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                            <i className={`${methodIcons[s.method]} text-xs`} />
                          </div>
                          <span className="text-xs text-slate-600">{s.method}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConfig[s.status].color}`}>{statusConfig[s.status].label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <div className="lg:col-span-2">
          <CartPanel
            cartItems={cartItems}
            delivery={delivery}
            payment={payment}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            onDeliveryChange={setDelivery}
            onPaymentChange={setPayment}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onGenerateQuote={() => setShowQuote(true)}
            onProcessOrder={handleProcessOrder}
          />
        </div>
      </div>

      {showQuote && (
        <QuoteModal
          cartItems={cartItems}
          customerName={cartItems.length > 0 ? 'Walk-in Customer' : ''}
          deliveryType={delivery}
          paymentMethod={payment}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onClose={() => setShowQuote(false)}
        />
      )}
    </AdminLayout>
  );
}
