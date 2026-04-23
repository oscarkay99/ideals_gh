import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { repairs, repairStats } from '@/mocks/repairs';

const statusConfig: Record<string, { label: string; color: string; dot: string; step: number }> = {
  received:     { label: 'Received',     color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400', step: 1 },
  diagnosed:    { label: 'Diagnosed',    color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500',  step: 2 },
  parts_pending:{ label: 'Parts Pending',color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500', step: 3 },
  in_progress:  { label: 'In Progress',  color: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-500',step: 4 },
  ready:        { label: 'Ready',        color: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-500',step: 6 },
};

const timelineSteps = ['Received', 'Diagnosed', 'Parts Pending', 'In Progress', 'Quality Check', 'Ready'];

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

      {/* Detail Panel */}
      {repair && (
        <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setSelected(null)}>
          <div className="absolute right-0 top-0 bottom-0 w-[440px] bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-slate-800">Repair Details</h3>
                <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <i className="ri-close-line text-base" />
                </button>
              </div>

              <div className="mb-5">
                <p className="text-xs font-mono text-slate-400">{repair.id}</p>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{repair.device}</h4>
                <p className="text-xs text-slate-500 mt-1">{repair.issue}</p>
              </div>

              {/* Timeline */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-700 mb-3">Progress</p>
                <div className="relative">
                  {timelineSteps.map((step, i) => {
                    const currentStep = statusConfig[repair.status].step;
                    const isDone = i < currentStep;
                    const isCurrent = i === currentStep - 1;
                    return (
                      <div key={step} className="flex items-start gap-3 relative">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isDone ? <i className="ri-check-line text-xs" /> : i + 1}
                          </div>
                          {i < timelineSteps.length - 1 && (
                            <div className={`w-0.5 h-6 ${isDone ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`text-xs font-medium ${isCurrent ? 'text-blue-700' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>{step}</p>
                          {isCurrent && <p className="text-[10px] text-slate-400 mt-0.5">In progress</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Customer</span>
                  <span className="text-xs font-medium text-slate-800">{repair.customer}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Technician</span>
                  <span className="text-xs font-medium text-slate-800">{repair.technician}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Started</span>
                  <span className="text-xs font-medium text-slate-800">{repair.started}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">ETA</span>
                  <span className="text-xs font-bold text-slate-800">{repair.eta}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Estimated Cost</span>
                  <span className="text-xs font-bold text-slate-800">{repair.cost}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Warranty</span>
                  <span className={`text-xs font-medium ${repair.warranty ? 'text-emerald-600' : 'text-slate-400'}`}>{repair.warranty ? 'Yes — Covered' : 'No'}</span>
                </div>
              </div>

              {/* Parts */}
              {repair.parts.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Parts Status</p>
                  <div className="space-y-2">
                    {repair.parts.map((part, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                        <span className="text-xs text-slate-700">{part.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          part.status === 'installed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {part.status === 'installed' ? 'Installed' : 'Ordered'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-slate-50 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-slate-700 mb-2">Technician Notes</p>
                {repair.notes.map((note, i) => (
                  <p key={i} className="text-xs text-slate-600 leading-relaxed mb-1">• {note}</p>
                ))}
              </div>

              <div className="flex gap-2">
                {repair.status !== 'ready' && (
                  <button className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
                    {repair.status === 'diagnosed' || repair.status === 'parts_pending' ? 'Request Approval' : 'Mark Ready'}
                  </button>
                )}
                {repair.status === 'ready' && (
                  <button className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
                    Notify Customer
                  </button>
                )}
                <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}