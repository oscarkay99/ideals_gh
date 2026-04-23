import { categoryBreakdown, paymentMethods } from '@/mocks/dashboard';

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Revenue by Category</h3>
          <span className="text-xs text-slate-400">This month</span>
        </div>
        <div className="space-y-3">
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-xs text-slate-600 w-20 flex-shrink-0">{cat.name}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800 w-20 text-right flex-shrink-0">{cat.pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Revenue</span>
          <span className="text-sm font-bold text-slate-900">GHS 84,320</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Payment Methods</h3>
          <span className="text-xs text-slate-400">This month</span>
        </div>
        {/* Stacked bar */}
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
          {paymentMethods.map((m) => (
            <div
              key={m.method}
              className="h-full rounded-full transition-all"
              style={{ width: `${m.pct}%`, backgroundColor: m.color }}
            />
          ))}
        </div>
        <div className="space-y-2.5">
          {paymentMethods.map((m) => (
            <div key={m.method} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
              <span className="text-xs text-slate-600 flex-1">{m.method}</span>
              <span className="text-xs font-semibold text-slate-800">GHS {m.value.toLocaleString()}</span>
              <span className="text-xs text-slate-400 w-8 text-right">{m.pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-amber-500">
            <i className="ri-smartphone-line text-xs" />
          </div>
          <span className="text-xs text-slate-500">MoMo dominates at 57% — keep MoMo QR visible in store</span>
        </div>
      </div>
    </div>
  );
}