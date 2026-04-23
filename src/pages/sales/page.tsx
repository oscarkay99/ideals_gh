import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { salesStats, recentSales, cartProducts } from '@/mocks/sales';

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
                  <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.condition} · {p.stock} left</p>
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
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Recent Sales</h3>
              <button className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">View all</button>
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
                  {recentSales.map((s, i) => (
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
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Current Sale</h3>

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 mx-auto mb-3">
                  <i className="ri-shopping-cart-line text-xl text-slate-300" />
                </div>
                <p className="text-xs text-slate-400">Add products to start a sale</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">GHS {item.price.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 text-slate-500 cursor-pointer">
                          <i className="ri-subtract-line text-xs" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 text-slate-500 cursor-pointer">
                          <i className="ri-add-line text-xs" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-400 cursor-pointer">
                        <i className="ri-close-line text-xs" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Delivery Method</p>
                  <div className="flex gap-2">
                    {(['pickup', 'delivery'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDelivery(d)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${
                          delivery === d ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['MoMo', 'Bank Transfer', 'Cash', 'Card'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setPayment(m)}
                        className={`flex items-center gap-1.5 py-2 px-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap ${
                          payment === m ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-slate-50 border border-transparent text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-3 h-3 flex items-center justify-center">
                          <i className={`${methodIcons[m]} text-xs`} />
                        </div>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-800">GHS {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Delivery</span>
                    <span className="text-slate-800">{deliveryFee > 0 ? `GHS ${deliveryFee}` : 'Free'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-slate-50">
                    <span className="text-slate-800">Total</span>
                    <span className="text-slate-900">GHS {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button onClick={() => setShowQuote(true)} className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
                    Generate Quote
                  </button>
                  <button className="w-full py-3 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
                    Complete Sale
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowQuote(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-800">Quote Preview</h3>
              <button onClick={() => setShowQuote(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                <i className="ri-close-line text-base" />
              </button>
            </div>
            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-xl overflow-hidden mx-auto mb-2">
                <img src="https://public.readdy.ai/ai/img_res/7bf43506-9df4-4671-b4ee-9c6d6fc6f9c0.png" alt="GadgetFlow" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-bold text-slate-800">GadgetFlow</p>
              <p className="text-[10px] text-slate-400">Quote #Q-2026-0089 · Valid until Apr 30, 2026</p>
            </div>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">{item.name}</span>
                    <span className="text-[10px] text-slate-400">x{item.qty}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">GHS {item.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-800">GHS {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Delivery</span>
                <span className="text-slate-800">{deliveryFee > 0 ? `GHS ${deliveryFee}` : 'Free'}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-slate-100">
                <span className="text-slate-800">Total</span>
                <span className="text-emerald-600">GHS {total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#20b858] transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2">
                <i className="ri-whatsapp-line text-sm" /> Share via WhatsApp
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}