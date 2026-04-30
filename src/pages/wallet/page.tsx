import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { walletCustomers, walletStats, walletTiers } from '@/mocks/wallet';
import WalletCustomerDetail from './components/WalletCustomerDetail';
import TopUpModal from './components/TopUpModal';

export default function WalletPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(walletCustomers[0]);
  const [topupModal, setTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');

  const tierConfig: Record<string, { icon: string; color: string; bg: string }> = {
    Bronze: { icon: 'ri-medal-line', color: 'text-amber-700', bg: 'bg-amber-100' },
    Silver: { icon: 'ri-medal-2-line', color: 'text-slate-600', bg: 'bg-slate-100' },
    Gold: { icon: 'ri-trophy-line', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    Platinum: { icon: 'ri-vip-crown-line', color: 'text-violet-600', bg: 'bg-violet-100' },
  };

  return (
    <AdminLayout title="GadgetFlow Wallet" subtitle="Customer store credit, loyalty tiers & wallet management">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Wallet Balance', value: `GHS ${walletStats.totalWalletBalance.toLocaleString()}`, icon: 'ri-wallet-3-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Wallets', value: walletStats.activeWallets.toString(), icon: 'ri-group-line', color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Deposits This Month', value: `GHS ${walletStats.totalDepositsThisMonth.toLocaleString()}`, icon: 'ri-arrow-down-circle-line', color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Avg Balance', value: `GHS ${walletStats.avgBalance.toLocaleString()}`, icon: 'ri-bar-chart-line', color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-xl">
                <i className={`${s.icon} text-base ${s.color}`} />
              </div>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {walletTiers.map(tier => {
          const cfg = tierConfig[tier.name];
          return (
            <div key={tier.name} className={`${tier.bg || 'bg-white'} rounded-2xl border border-slate-100 p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${cfg.bg}`}>
                  <i className={`${cfg.icon} text-sm ${cfg.color}`} />
                </div>
                <span className={`text-sm font-bold ${cfg.color}`}>{tier.name}</span>
              </div>
              <p className="text-xs text-slate-500">Min balance: <strong>GHS {tier.minBalance.toLocaleString()}</strong></p>
              <p className="text-xs text-slate-500">Loyalty bonus: <strong className="text-emerald-600">{tier.bonus}</strong></p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Customer List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Wallet Holders</h3>
            <button className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1">
              <i className="ri-add-line" />Add Customer
            </button>
          </div>
          {walletCustomers.map(customer => {
            const cfg = tierConfig[customer.tier];
            return (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={`w-full bg-white rounded-2xl border p-4 text-left hover:border-emerald-300 transition-all cursor-pointer ${selectedCustomer.id === customer.id ? 'border-emerald-400' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${customer.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>
                        {customer.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{customer.phone}</p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">GHS {customer.balance.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Customer Detail */}
        <WalletCustomerDetail customer={selectedCustomer} onTopUp={() => setTopupModal(true)} />
      </div>

      {topupModal && (
        <TopUpModal
          customer={selectedCustomer}
          topupAmount={topupAmount}
          onAmountChange={setTopupAmount}
          onClose={() => setTopupModal(false)}
        />
      )}
    </AdminLayout>
  );
}
