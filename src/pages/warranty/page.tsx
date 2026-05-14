import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { warranties, returns, warrantyStats } from '@/mocks/warranty';
import WarrantyDetail from './components/WarrantyDetail';
import NewReturnModal from './components/NewReturnModal';

const tabs = ['Warranties', 'Returns & Refunds'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#25D366', bg: '#25D36615' },
  expiring_soon: { label: 'Expiring Soon', color: '#F5A623', bg: '#F5A62315' },
  expired: { label: 'Expired', color: '#94A3B8', bg: '#F1F5F9' },
};

const returnStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  approved: { label: 'Approved', color: '#0D1F4A', bg: '#0D1F4A15' },
  pending: { label: 'Pending', color: '#F5A623', bg: '#F5A62315' },
  rejected: { label: 'Rejected', color: '#E05A2B', bg: '#E05A2B15' },
  completed: { label: 'Completed', color: '#25D366', bg: '#25D36615' },
};

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState('Warranties');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWarranty, setSelectedWarranty] = useState<string | null>(null);
  const [showNewReturn, setShowNewReturn] = useState(false);

  const filteredWarranties = warranties.filter(w => {
    const matchSearch = w.customer.toLowerCase().includes(search.toLowerCase()) || w.device.toLowerCase().includes(search.toLowerCase()) || w.imei.includes(search);
    const matchStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const selected = warranties.find(w => w.id === selectedWarranty);

  return (
    <AdminLayout title="Warranty & Returns" subtitle="Track warranties · Manage returns · Process refunds">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Active Warranties', value: `${warrantyStats.totalActive}`, icon: 'ri-shield-check-line', color: '#25D366' },
          { label: 'Expiring Soon', value: `${warrantyStats.expiringSoon}`, icon: 'ri-alarm-warning-line', color: '#F5A623' },
          { label: 'Pending Returns', value: `${warrantyStats.pendingReturns}`, icon: 'ri-arrow-go-back-line', color: '#E05A2B' },
          { label: 'Refunds This Month', value: `GHS ${warrantyStats.refundValue.toLocaleString()}`, icon: 'ri-refund-2-line', color: '#0D1F4A' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
              </div>
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex border border-slate-200 rounded-xl p-1 bg-white">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
              style={activeTab === tab ? { background: '#0D1F4A' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewReturn(true)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
          style={{ background: '#E05A2B' }}
        >
          <i className="ri-arrow-go-back-line mr-1" /> New Return Request
        </button>
      </div>

      {/* Warranties Tab */}
      {activeTab === 'Warranties' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1">
                <i className="ri-search-line text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by customer, device, or IMEI..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-slate-600 outline-none w-full"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'expiring_soon', 'expired'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${filterStatus === f ? 'text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    style={filterStatus === f ? { background: '#0D1F4A' } : {}}
                  >
                    {f === 'all' ? 'All' : f === 'expiring_soon' ? 'Expiring' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredWarranties.map(w => {
                  const st = statusConfig[w.status];
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWarranty(selectedWarranty === w.id ? null : w.id)}
                      className={`w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/50 transition-colors ${selectedWarranty === w.id ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: st.bg }}>
                        <i className="ri-shield-check-line text-sm" style={{ color: st.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-800">{w.customer}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: st.color }}>{st.label}</span>
                        </div>
                        <p className="text-xs text-slate-600">{w.device}</p>
                        <p className="text-[10px] text-slate-400">IMEI: {w.imei} · {w.type} · {w.duration}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-semibold text-slate-700">Expires {w.expiryDate}</p>
                        {w.status === 'active' && <p className="text-[10px]" style={{ color: '#25D366' }}>{w.daysLeft} days left</p>}
                        {w.status === 'expiring_soon' && <p className="text-[10px]" style={{ color: '#F5A623' }}>{w.daysLeft} days left</p>}
                        {w.status === 'expired' && <p className="text-[10px] text-slate-400">Expired</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div>
            {selected ? (
              <WarrantyDetail
                warranty={selected}
                onClose={() => setSelectedWarranty(null)}
                onNewReturn={() => setShowNewReturn(true)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                <i className="ri-shield-check-line text-3xl text-slate-200 mb-3" />
                <p className="text-xs text-slate-400">Select a warranty to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Returns Tab */}
      {activeTab === 'Returns & Refunds' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {returns.map(ret => {
              const st = returnStatusConfig[ret.status];
              return (
                <div key={ret.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: st.bg }}>
                    <i className="ri-arrow-go-back-line text-sm" style={{ color: st.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-800">{ret.id}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: st.color }}>{st.label}</span>
                    </div>
                    <p className="text-xs text-slate-700">{ret.customer} · {ret.device}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ret.reason}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Requested: {ret.requestDate}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-700">{ret.resolution}</p>
                    {ret.refundAmount > 0 && <p className="text-xs font-bold" style={{ color: '#E05A2B' }}>GHS {ret.refundAmount.toLocaleString()}</p>}
                    {ret.status === 'pending' && (
                      <div className="flex gap-1 mt-2">
                        <button className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white cursor-pointer" style={{ background: '#25D366' }}>Approve</button>
                        <button className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white cursor-pointer" style={{ background: '#E05A2B' }}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showNewReturn && <NewReturnModal onClose={() => setShowNewReturn(false)} />}
    </AdminLayout>
  );
}