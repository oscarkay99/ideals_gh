interface RecentSale {
  id: string;
  customer: string;
  items: string;
  total: number;
  time: string;
}

interface RecentSalesListProps {
  sales: RecentSale[];
}

export default function RecentSalesList({ sales }: RecentSalesListProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-700">Today&apos;s Sales</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {sales.map(sale => (
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
  );
}
