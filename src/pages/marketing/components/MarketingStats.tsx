import { marketingStats } from '@/mocks/marketing';

export default function MarketingStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {marketingStats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 relative overflow-hidden hover:shadow-md transition-all duration-200">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.accent} rounded-l-2xl`} />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1 tracking-tight">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1.5 text-emerald-600">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-arrow-up-line text-xs" />
                </div>
                <span className="text-xs font-medium">{stat.change} this month</span>
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <i className={`${stat.icon} text-lg`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
