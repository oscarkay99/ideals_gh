interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
  lineTotal: number;
}

interface ReceiptModalProps {
  open: boolean;
  cartItems: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  onNewSale: () => void;
}

export default function ReceiptModal({ open, cartItems, total, customerName, customerPhone, onNewSale }: ReceiptModalProps) {
  if (!open) return null;

  return (
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
          <button onClick={onNewSale} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}
