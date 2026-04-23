const paymentMethods = [
  { id: 'momo', label: 'MTN MoMo', icon: 'ri-smartphone-line', color: '#FFCC00' },
  { id: 'cash', label: 'Cash', icon: 'ri-money-dollar-circle-line', color: '#25D366' },
  { id: 'card', label: 'Card', icon: 'ri-bank-card-line', color: '#1E5FBE' },
  { id: 'transfer', label: 'Bank Transfer', icon: 'ri-bank-line', color: '#0A1F4A' },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
  lineTotal: number;
}

interface CartPanelProps {
  cartItems: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  discount: number;
  onDiscountChange: (v: number) => void;
  selectedPayments: string[];
  onTogglePayment: (id: string) => void;
  splitAmounts: Record<string, number>;
  onSplitAmountChange: (id: string, v: number) => void;
  customerName: string;
  onCustomerName: (v: string) => void;
  customerPhone: string;
  onCustomerPhone: (v: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateItemDiscount: (id: string, disc: number) => void;
  onClearCart: () => void;
  onCompleteSale: () => void;
}

export default function CartPanel({
  cartItems,
  subtotal,
  discountAmount,
  total,
  discount,
  onDiscountChange,
  selectedPayments,
  onTogglePayment,
  splitAmounts,
  onSplitAmountChange,
  customerName,
  onCustomerName,
  customerPhone,
  onCustomerPhone,
  onUpdateQty,
  onRemoveFromCart,
  onUpdateItemDiscount,
  onClearCart,
  onCompleteSale,
}: CartPanelProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Current Sale</h3>
          {cartItems.length > 0 && (
            <button onClick={onClearCart} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Clear all</button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <input
            type="text"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => onCustomerName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <input
            type="text"
            placeholder="Phone number"
            value={customerPhone}
            onChange={(e) => onCustomerPhone(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

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
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer">
                    <i className="ri-subtract-line text-xs" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer">
                    <i className="ri-add-line text-xs" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => onUpdateItemDiscount(item.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-10 px-1 py-1 rounded-lg bg-white text-[10px] text-center text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-200"
                    placeholder="0%"
                  />
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
                <p className="text-xs font-bold text-slate-800 w-16 text-right">GHS {Math.round(item.lineTotal).toLocaleString()}</p>
                <button onClick={() => onRemoveFromCart(item.id)} className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-red-400 cursor-pointer">
                  <i className="ri-close-line text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-xl">
              <i className="ri-coupon-line text-amber-500 text-sm" />
              <span className="text-xs text-amber-700 font-medium flex-1">Overall Discount</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => onDiscountChange(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-12 px-2 py-1 rounded-lg bg-white text-xs text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-200"
              />
              <span className="text-xs text-amber-700">%</span>
            </div>

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

            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Payment Method (select all that apply)</p>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => onTogglePayment(m.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${selectedPayments.includes(m.id) ? 'border-transparent text-white' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                    style={selectedPayments.includes(m.id) ? { background: m.color } : {}}
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
                          onChange={(e) => onSplitAmountChange(pid, parseInt(e.target.value) || 0)}
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
              onClick={onCompleteSale}
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
  );
}
