interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  accentColor?: string;
  accent?: string;
  sub?: string;
}

export default function StatCard({ label, value, change, trend, icon, accentColor, sub }: StatCardProps) {
  const color = accentColor || '#1E5FBE';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-all duration-300 relative overflow-hidden cursor-default">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: color }} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">{label}</p>
          <p className="text-[28px] font-bold text-slate-900 mt-1.5 tracking-tight leading-none">{value}</p>
          {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
          <div
            className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              trend === 'up' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <i className={`${trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-xs`} />
            {change} vs last month
          </div>
        </div>
        <div
          className="w-11 h-11 flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{ background: `${color}18`, color }}
        >
          <i className={`${icon} text-xl`} />
        </div>
      </div>
    </div>
  );
}
