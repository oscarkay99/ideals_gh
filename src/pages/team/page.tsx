import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { teamMembers, teamStats } from '@/mocks/team';

const medals = ['ri-medal-fill text-amber-400', 'ri-medal-fill text-slate-400', 'ri-medal-fill text-amber-700'];

export default function TeamPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const member = selected ? teamMembers.find((m) => m.id === selected) : null;

  return (
    <AdminLayout title="Team" subtitle="Performance, leaderboard, and coaching">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {teamStats.map((s) => (
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

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Sales Leaderboard</h3>
          <span className="text-xs text-slate-400">This Month</span>
        </div>
        <div className="space-y-3">
          {teamMembers.filter((m) => m.role.includes('Sales')).map((m, i) => (
            <div
              key={m.id}
              onClick={() => setSelected(m.id)}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 w-12 flex-shrink-0">
                {i < 3 && (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${medals[i]} text-base`} />
                  </div>
                )}
                {i >= 3 && <span className="text-xs font-bold text-slate-300 w-5 text-center">#{i + 1}</span>}
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {m.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                <p className="text-[10px] text-slate-400">{m.role}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-800">{m.sales} sales</p>
                <p className="text-[10px] text-slate-400">{m.revenue}</p>
              </div>
              <div className="text-right flex-shrink-0 w-20">
                <p className="text-xs font-bold text-emerald-600">{m.conversionRate}</p>
                <p className="text-[10px] text-slate-400">close rate</p>
              </div>
              <div className="text-right flex-shrink-0 w-20">
                <p className="text-xs font-medium text-slate-700">{m.avgResponse}</p>
                <p className="text-[10px] text-slate-400">response</p>
              </div>
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${m.trend === 'up' ? 'ri-arrow-up-line text-emerald-500' : 'ri-arrow-down-line text-red-400'} text-xs`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m.id)}
            className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base font-bold">
                {m.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                <p className="text-[10px] text-slate-400">{m.role}</p>
              </div>
              <div className="ml-auto">
                <div className={`w-2 h-2 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {m.sales !== undefined && (
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Sales</p>
                  <p className="text-sm font-bold text-slate-800">{m.sales}</p>
                </div>
              )}
              {m.repairs !== undefined && (
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Repairs</p>
                  <p className="text-sm font-bold text-slate-800">{m.repairs}</p>
                </div>
              )}
              {m.tasks !== undefined && (
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Tasks</p>
                  <p className="text-sm font-bold text-slate-800">{m.tasks}</p>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-2.5">
                <p className="text-[10px] text-slate-400">Revenue</p>
                <p className="text-sm font-bold text-slate-800">{m.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {member && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-800">Team Member</h3>
              <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                <i className="ri-close-line text-base" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                {member.avatar}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs text-slate-400">{member.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {member.sales !== undefined && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{member.sales}</p>
                  <p className="text-[10px] text-slate-400">Sales</p>
                </div>
              )}
              {member.conversionRate && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{member.conversionRate}</p>
                  <p className="text-[10px] text-slate-400">Close Rate</p>
                </div>
              )}
              {member.avgResponse && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{member.avgResponse}</p>
                  <p className="text-[10px] text-slate-400">Avg Response</p>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-slate-800">{member.revenue}</p>
                <p className="text-[10px] text-slate-400">Revenue</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
                View Full Report
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
                Coaching Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}