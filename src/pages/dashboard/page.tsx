import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/feature/AdminLayout';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import AIPanel from './components/AIPanel';
import AlertBanner from './components/AlertBanner';
import LiveFeed from './components/LiveFeed';
import TopProducts from './components/TopProducts';
import KPIStrip from './components/KPIStrip';
import { dashboardStats } from '@/mocks/dashboard';

const quickActions = [
  { label: 'Create Quote', icon: 'ri-file-add-line', style: { background: '#0D1F4A' }, path: '/sales' },
  { label: 'Add Inventory', icon: 'ri-add-box-line', style: { background: '#07101F' }, path: '/inventory' },
  { label: 'Log Payment', icon: 'ri-bank-card-line', style: { background: '#F5A623' }, path: '/payments' },
  { label: 'New Lead', icon: 'ri-user-add-line', style: { background: '#1552A8' }, path: '/leads' },
  { label: 'AI Studio', icon: 'ri-sparkling-2-line', style: { background: '#0E3D8A' }, path: '/ai-studio' },
  { label: 'Analytics', icon: 'ri-bar-chart-2-line', style: { background: 'rgba(7,16,31,0.08)', color: '#0D1F4A' }, path: '/analytics' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AdminLayout title="Dashboard" subtitle="Thursday, April 23, 2026 · Accra, Ghana">
      {/* Hero welcome strip */}
      <div className="rounded-2xl p-5 mb-5 flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #07101F 0%, #0D1F4A 50%, #1552A8 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(245,166,35,0.15)' }} />
        <div className="relative">
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Good morning, Kwame</p>
          <h2 className="text-white text-xl font-bold tracking-tight">Your store is performing <span style={{ color: '#F5A623' }}>above target</span> this month.</h2>
          <p className="text-white/50 text-xs mt-1.5">GHS 84,320 revenue · 109 orders · 47 active leads · 6 repairs in queue</p>
        </div>
        <div className="relative hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Monthly Target</p>
            <p className="text-white text-lg font-bold">GHS 80,000</p>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <i className="ri-checkbox-circle-fill text-xs" style={{ color: '#F5A623' }} />
              <span className="text-xs font-semibold" style={{ color: '#F5A623' }}>105.4% achieved</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.2)' }}>
            <i className="ri-trophy-line text-2xl" style={{ color: '#F5A623' }} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Revenue" value={dashboardStats.revenue.value} change={dashboardStats.revenue.change} trend="up" icon="ri-money-dollar-circle-line" accentColor="#0D1F4A" sub="GHS 80K target" />
        <StatCard label="Active Leads" value={dashboardStats.leads.value} change={dashboardStats.leads.change} trend="up" icon="ri-user-star-line" accentColor="#F5A623" sub="12 hot, 18 warm" />
        <StatCard label="Stock Alerts" value={dashboardStats.stockAlerts.value} change={dashboardStats.stockAlerts.change} trend="down" icon="ri-alert-line" accentColor="#E05A2B" sub="3 out of stock" />
        <StatCard label="Pending Payments" value={dashboardStats.pendingPayments.value} change={dashboardStats.pendingPayments.change} trend="up" icon="ri-time-line" accentColor="#1552A8" sub="7 transactions" />
      </div>

      {/* Alert Banner */}
      <div className="mb-5">
        <AlertBanner />
      </div>

      {/* Main Grid — Revenue + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <AIPanel />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="mb-5">
        <KPIStrip />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Quick Actions</h3>
          <span className="text-xs text-slate-400">Jump to any section</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap text-white hover:opacity-90"
              style={action.style}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`${action.icon} text-lg`} />
              </div>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LiveFeed />
        <TopProducts />
      </div>
    </AdminLayout>
  );
}