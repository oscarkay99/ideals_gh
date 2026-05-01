interface Props {
  selectedModel: string;
  tradeValue: number;
  onClose: () => void;
}

export default function BookingModal({ selectedModel, tradeValue, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Book Trade-In Appointment</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
            <i className="ri-close-line text-slate-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Customer Name</label>
            <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="Full name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number</label>
            <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="+233 XX XXX XXXX" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Preferred Date & Time</label>
            <input type="datetime-local" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-xs text-slate-600">Device: <strong>{selectedModel}</strong></p>
            <p className="text-xs text-slate-600">Estimated value: <strong className="text-emerald-600">GHS {tradeValue.toLocaleString()}</strong></p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#0D1F4A' }}>Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}
