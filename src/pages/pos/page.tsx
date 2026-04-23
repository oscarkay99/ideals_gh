import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { posProducts, posRecentSales } from '@/mocks/pos';

type CartItem = { id: string; qty: number; discount: number };

const categories = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google', 'Tecno', 'Accessories'];
const paymentMethods = [
  { id: 'momo', label: 'MTN MoMo', icon: 'ri-smartphone-line', color: '#FFCC00' },
  { id: 'cash', label: 'Cash', icon: 'ri-money-dollar-circle-line', color: '#25D366' },
  { id: 'card', label: 'Card', icon: 'ri-bank-card-line', color: '#1E5FBE' },
  { id: 'transfer', label: 'Bank Transfer', icon: 'ri-bank-line', color: '#0A1F4A' },
];

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
        {/* Product Panel */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Search + Category */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1">
              <i className="ri-search-line text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search product or scan barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-slate-600 outline-none w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${category === cat ? 'text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                style={category === cat ? { background: '#1E5FBE' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
            {filtered.map(p => {
              const inCart = cart.find(c => c.id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p.id)}
                  disabled={p.stock === 0}
                  className={`bg-white rounded-2xl p-3 border text-left transition-all cursor-pointer ${p.stock === 0 ? 'opacity-50 cursor-not-allowed border-slate-100' : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'} ${inCart ? 'border-blue-300 bg-blue-50/50' : ''}`}
                >
                  <div className="w-full h-20 rounded-xl bg-slate-50 overflow-hidden mb-2">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-[10px] text-slate-400 mb-1">{p.sku}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold" style={{ color: '#1E5FBE' }}>GHS {p.price.toLocaleString()}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.stock <= 2 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                      {p.stock === 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </div>
                  {inCart && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#1E5FBE' }}>{inCart.qty}</span>
                      <span className="text-[10px] text-blue-600 font-medium">in cart</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700">Today&apos;s Sales</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {posRecentSales.map(sale => (
                <div key={sale.id} className="px-4 py-2.5 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 w-14">{sale.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{sale.customer}</p>
                    <p className="text-[10px] text-slate-400 truncate">{sale.items}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-800">GHS {sale.total.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">{sale.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Current Sale</h3>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Clear all</button>
              )}
            </div>

            {/* Customer */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <input
                type="text"
                placeholder="Phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-shopping-cart-line text-2xl text-slate-300" />
                </div>
                <p className="text-xs text-slate-400">Tap a product to add it</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">GHS {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer">
                        <i className="ri-subtract-line text-xs" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer">
                        <i className="ri-add-line text-xs" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItemDiscount(item.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-10 px-1 py-1 rounded-lg bg-white text-[10px] text-center text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-200"
                        placeholder="0%"
                      />
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 w-16 text-right">GHS {Math.round(item.lineTotal).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-red-400 cursor-pointer">
                      <i className="ri-close-line text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <>
                {/* Overall Discount */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-xl">
                  <i className="ri-coupon-line text-amber-500 text-sm" />
                  <span className="text-xs text-amber-700 font-medium flex-1">Overall Discount</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-12 px-2 py-1 rounded-lg bg-white text-xs text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-200"
                  />
                  <span className="text-xs text-amber-700">%</span>
                </div>

                {/* Totals */}
                <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-700">GHS {Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-600">Discount ({discount}%)</span>
                      <span className="text-amber-600">-GHS {Math.round(discountAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-100">
                    <span className="text-slate-800">Total</span>
                    <span style={{ color: '#1E5FBE' }}>GHS {Math.round(total).toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Payment Method (select all that apply)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => togglePayment(m.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${selectedPayments.includes(m.id) ? 'border-transparent text-white' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                        style={selectedPayments.includes(m.id) ? { background: m.color, color: m.id === 'cash' ? '#fff' : '#fff' } : {}}
                      >
                        <i className={`${m.icon} text-sm`} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                  {selectedPayments.length > 1 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] text-slate-400">Split amounts</p>
                      {selectedPayments.map(pid => {
                        const method = paymentMethods.find(m => m.id === pid)!;
                        return (
                          <div key={pid} className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 w-24">{method.label}</span>
                            <input
                              type="number"
                              placeholder="0"
                              value={splitAmounts[pid] || ''}
                              onChange={(e) => setSplitAmounts(prev => ({ ...prev, [pid]: parseInt(e.target.value) || 0 }))}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            />
                            <span className="text-xs text-slate-400">GHS</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={completeSale}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white cursor-pointer whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #0A1F4A, #1E5FBE)' }}
                >
                  <i className="ri-check-double-line mr-2" />
                  Complete Sale · GHS {Math.round(total).toLocaleString()}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #0A1F4A, #1E5FBE)' }}>
                <i className="ri-check-line text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Sale Complete!</h3>
              <p className="text-xs text-slate-400 mt-1">Receipt #{Math.floor(Math.random() * 9000) + 1000}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-slate-600">{item.name} x{item.qty}</span>
                  <span className="font-semibold text-slate-800">GHS {Math.round(item.lineTotal).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span style={{ color: '#1E5FBE' }}>GHS {Math.round(total).toLocaleString()}</span>
              </div>
            </div>
            {customerName && <p className="text-xs text-center text-slate-500 mb-4">Customer: {customerName} {customerPhone && `· ${customerPhone}`}</p>}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 cursor-pointer whitespace-nowrap">
                <i className="ri-printer-line mr-1" /> Print
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#25D366' }}>
                <i className="ri-whatsapp-line mr-1" /> WhatsApp
              </button>
              <button onClick={newSale} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}