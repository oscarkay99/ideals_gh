interface Supplier { id: string; name: string }

interface Props {
  suppliers: Supplier[];
  onClose: () => void;
}

export default function NewPOModal({ suppliers, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">New Purchase Order</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-slate-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Supplier</label>
            <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
              {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Expected Delivery</label>
              <input type="date" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Payment Terms</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
                <option>Prepaid</option>
                <option>Net 7</option>
                <option>Net 14</option>
                <option>Net 30</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Items</label>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="Product name" className="col-span-1 px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                  <input type="number" placeholder="Qty" className="px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                  <input type="number" placeholder="Unit cost (GHS)" className="px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Notes</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none" rows={2} placeholder="Optional notes..." />
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#0D1F4A' }}>
            Submit Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}
