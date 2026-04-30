interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  lineTotal: number;
}

interface Props {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onClose: () => void;
}

export default function QuoteModal({ cartItems, subtotal, deliveryFee, total, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-800">Quote Preview</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
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
  );
}
