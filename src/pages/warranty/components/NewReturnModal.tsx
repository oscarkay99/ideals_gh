interface Props {
  onClose: () => void;
}

export default function NewReturnModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">New Return Request</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-slate-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Customer Name</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Customer name" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Device / Product</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. iPhone 15 Pro 256GB" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">IMEI / Serial Number</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="15-digit IMEI" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Reason for Return</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none" rows={3} placeholder="Describe the issue..." />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Resolution Type</label>
            <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
              <option>Exchange</option>
              <option>Full Refund</option>
              <option>Partial Refund</option>
              <option>Repair Under Warranty</option>
            </select>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#E05A2B' }}>
            Submit Return Request
          </button>
        </div>
      </div>
    </div>
  );
}
