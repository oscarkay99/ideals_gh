import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { repairs, repairStats } from '@/mocks/repairs';
import RepairDetail from './components/RepairDetail';

const statusConfig: Record<string, { label: string; color: string; dot: string; step: number }> = {
  received:     { label: 'Received',     color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400', step: 1 },
  diagnosed:    { label: 'Diagnosed',    color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500',  step: 2 },
  parts_pending:{ label: 'Parts Pending',color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500', step: 3 },
  in_progress:  { label: 'In Progress',  color: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-500',step: 4 },
  ready:        { label: 'Ready',        color: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-500',step: 6 },
};

export default function RepairsPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = repairs.filter((r) => filter === 'all' || r.status === filter);
  const repair = selected ? repairs.find((r) => r.id === selected) : null;

  return (
    <AdminLayout title="Repairs" subtitle="Queue, tracking, and technician updates">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {repairStats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accent} rounded-l-2xl`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{s.change}</p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <i className={`${s.icon} text-lg`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-sm">
          <div className="w-4 h-4 flex items-center justify-center text-slate-400">
            <i className="ri-search-line text-sm" />
          </div>
          <input type="text" placeholder="Search repairs..." className="bg-transparent text-sm text-slate-600 outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'received', 'diagnosed', 'parts_pending', 'in_progress', 'ready'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'All' : statusConfig[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Repair Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const st = statusConfig[r.status];
          return (
            <div
              key={r.id}
              onClick={() => setSelected(r.id)}
              className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-mono text-slate-400">{r.id}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{r.device}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">{r.issue}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
                <span>{r.customer}</span>
                <span>Tech: {r.technician}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 flex items-center justify-center text-slate-400">
                    <i className="ri-time-line text-xs" />
                  </div>
                  <span className="text-xs text-slate-500">ETA: {r.eta}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{r.cost}</span>
              </div>
              {r.warranty && (
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-3 h-3 flex items-center justify-center text-blue-500">
                    <i className="ri-shield-check-line text-xs" />
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">Under Warranty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {repair && <RepairDetail repair={repair} onClose={() => setSelected(null)} />}
    </AdminLayout>
  );
}