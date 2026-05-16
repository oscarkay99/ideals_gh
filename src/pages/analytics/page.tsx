import { useState, useMemo } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { monthlyData } from '@/mocks/analytics';
import { useSales } from '@/hooks/useSales';
import { useLeads } from '@/hooks/useLeads';
import { useRepairs } from '@/hooks/useRepairs';
import RevenueVsTarget from './components/RevenueVsTarget';
import SalesFunnelChart from './components/SalesFunnelChart';
import TopProductsTable from './components/TopProductsTable';
import CustomerSegments from './components/CustomerSegments';
import RepairAnalytics from './components/RepairAnalytics';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line' },
  { id: 'revenue', label: 'Revenue', icon: 'ri-money-dollar-circle-line' },
  { id: 'products', label: 'Products', icon: 'ri-archive-line' },
  { id: 'customers', label: 'Customers', icon: 'ri-group-line' },
  { id: 'operations', label: 'Operations', icon: 'ri-tools-line' },
];

const parseGHS = (t: string) => parseFloat(t.replace(/[^0-9.]/g, '')) || 0;
const fmtGHS = (n: number) => n >= 1000 ? `GHS ${(n / 1000).toFixed(1)}K` : `GHS ${Math.round(n)}`;

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('6M');
  const { sales } = useSales();
  const { leads } = useLeads();
  const { repairs } = useRepairs();

  const analyticsKPIs = useMemo(() => {
    const completed = sales.filter(s => s.status === 'completed');
    const totalRevenue = completed.reduce((sum, s) => sum + parseGHS(s.total), 0);
    const totalOrders = completed.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(completed.map(s => s.customer)).size;
    const ltv = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;
    return [
      { label: 'Total Revenue', value: fmtGHS(totalRevenue), change: `${totalOrders} sales`, trend: 'up', icon: 'ri-money-dollar-circle-line', accent: 'bg-emerald-500', sub: 'All-time completed' },
      { label: 'Total Orders', value: `${totalOrders}`, change: `${leads.length} leads`, trend: 'up', icon: 'ri-shopping-bag-3-line', accent: 'bg-blue-500', sub: 'Completed sales' },
      { label: 'Avg Order Value', value: fmtGHS(avgOrder), change: `${repairs.length} repairs`, trend: 'up', icon: 'ri-bar-chart-box-line', accent: 'bg-violet-500', sub: 'Per transaction' },
      { label: 'Customer LTV', value: fmtGHS(ltv), change: `${uniqueCustomers} customers`, trend: 'up', icon: 'ri-user-heart-line', accent: 'bg-amber-500', sub: 'Avg lifetime value' },
    ];
  }, [sales, leads, repairs]);

  return (
    <AdminLayout title="Analytics" subtitle="Deep performance insights across your entire operation">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-2xl p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={`${tab.icon} text-sm`} />
              </div>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1">
          {['1M', '3M', '6M', '1Y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                period === p ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {analyticsKPIs.map((kpi) => {
          const accentBg = kpi.accent.replace('-500', '-50');
          const accentText = kpi.accent.replace('bg-', 'text-');
          return (
            <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.accent} rounded-l-2xl`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">{kpi.label}</p>
                  <p className="text-[26px] font-bold text-slate-900 mt-1 tracking-tight leading-none">{kpi.value}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
                  <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700`}>
                    <i className="ri-arrow-up-line text-xs" />
                    {kpi.change}
                  </div>
                </div>
                <div className={`w-11 h-11 flex items-center justify-center rounded-2xl ${accentBg} ${accentText} flex-shrink-0`}>
                  <i className={`${kpi.icon} text-xl`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* AI Summary Banner */}
          <div className="bg-[#0A0F1E] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex-shrink-0">
                <i className="ri-sparkling-2-fill text-white text-base" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-1">AI Performance Summary</p>
                <p className="text-white/60 text-xs leading-relaxed">
                  No data yet. Start recording sales, leads, and repairs to unlock AI-powered performance insights tailored to your store.
                </p>
              </div>
              <button className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
                <i className="ri-download-line text-xs" />
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <RevenueVsTarget />
            </div>
            <div>
              <SalesFunnelChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <TopProductsTable />
            </div>
            <div>
              <CustomerSegments />
            </div>
          </div>

          <RepairAnalytics />
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-5">
          <RevenueVsTarget />

          {/* Monthly breakdown table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Monthly Revenue Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Month', 'Revenue', 'Target', 'vs Target', 'Orders', 'Avg Order', 'Leads'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((d, i) => {
                    const diff = d.revenue - d.target;
                    const diffPct = ((diff / d.target) * 100).toFixed(1);
                    const beat = diff >= 0;
                    return (
                      <tr key={d.month} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/20'}`}>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-800">{d.month} 2026</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-900">GHS {d.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">GHS {d.target.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold ${beat ? 'text-emerald-600' : 'text-red-500'}`}>
                            {beat ? '+' : ''}{diffPct}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-700">{d.orders}</td>
                        <td className="px-4 py-3 text-xs text-slate-700">GHS {Math.round(d.revenue / d.orders).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-slate-700">{d.leads}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          <TopProductsTable />
          <RepairAnalytics />
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <SalesFunnelChart />
            </div>
            <div>
              <CustomerSegments />
            </div>
          </div>

          {/* Retention metrics */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-5">Customer Retention Metrics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Repeat Purchase Rate', value: '41%', change: '+6%', icon: 'ri-refresh-line', color: 'text-emerald-600' },
                { label: 'Avg Days Between Orders', value: '38 days', change: '-5 days', icon: 'ri-calendar-line', color: 'text-blue-600' },
                { label: 'NPS Score', value: '72', change: '+8', icon: 'ri-star-line', color: 'text-amber-600' },
                { label: 'Churn Rate', value: '11.6%', change: '-2.1%', icon: 'ri-user-unfollow-line', color: 'text-red-500' },
              ].map((m) => (
                <div key={m.label} className="bg-slate-50 rounded-2xl p-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-xl bg-white mb-3 ${m.color}`}>
                    <i className={`${m.icon} text-base`} />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{m.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.label}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">{m.change}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === 'operations' && (
        <div className="space-y-5">
          <RepairAnalytics />

          {/* Team performance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-5">Team Performance Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Kofi Mensah', role: 'Sales Lead', metric: '42 sales', sub: '34% close rate', avatar: 'KM', rank: 1 },
                { name: 'Abena Frimpong', role: 'Sales Rep', metric: '38 sales', sub: '31% close rate', avatar: 'AF', rank: 2 },
                { name: 'Ama Owusu', role: 'Technician', metric: '56 repairs', sub: '96% satisfaction', avatar: 'AO', rank: null },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                      {m.avatar}
                    </div>
                    {m.rank && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-white text-[10px] font-bold">
                        {m.rank}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.role}</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">{m.metric}</p>
                    <p className="text-[10px] text-slate-400">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}