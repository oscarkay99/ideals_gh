import { topProducts } from '@/mocks/dashboard';

export default function TopProducts() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Top Products</h3>
        <button className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">View inventory</button>
      </div>
      <div className="space-y-3">
        {topProducts.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300 w-4 flex-shrink-0">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{p.name}</p>
              <p className="text-[10px] text-slate-400">{p.sold} sold</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-800">{p.revenue}</p>
              <p className={`text-[10px] ${p.stock <= 2 ? 'text-red-500' : 'text-slate-400'}`}>
                {p.stock} in stock
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
