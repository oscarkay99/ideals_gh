import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { walletCustomers, walletStats, walletTiers } from '@/mocks/wallet';

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

  const txTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
    deposit: { icon: 'ri-arrow-down-circle-line', color: 'text-emerald-500', label: 'Deposit' },
    purchase: { icon: 'ri-shopping-bag-3-line', color: 'text-rose-500', label: 'Purchase' },
    bonus: { icon: 'ri-gift-line', color: 'text-violet-500', label: 'Bonus' },
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
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #0A1F4A 0%, #1E5FBE 100%)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${selectedCustomer.avatarColor} flex items-center justify-center text-white font-bold`}>
                  {selectedCustomer.avatar}
                </div>
                <div>
                  <p className="font-bold text-white">{selectedCustomer.name}</p>
                  <p className="text-white/50 text-xs">{selectedCustomer.phone}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-5 h-5 flex items-center justify-center rounded-md ${tierConfig[selectedCustomer.tier].bg}`}>
                      <i className={`${tierConfig[selectedCustomer.tier].icon} text-xs ${tierConfig[selectedCustomer.tier].color}`} />
                    </div>
                    <span className={`text-xs font-semibold ${tierConfig[selectedCustomer.tier].color}`}>{selectedCustomer.tier} Member</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setTopupModal(true)}
                className="px-4 py-2 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: '#1E5FBE' }}
              >
                <i className="ri-add-circle-line mr-1" />Top Up
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 mb-0.5">Current Balance</p>
                <p className="text-xl font-bold" style={{ color: '#F5A623' }}>GHS {selectedCustomer.balance.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 mb-0.5">Total Deposited</p>
                <p className="text-lg font-bold text-white">GHS {selectedCustomer.totalDeposited.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 mb-0.5">Total Spent</p>
                <p className="text-lg font-bold text-white">GHS {selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Transaction History</h4>
            <div className="space-y-3">
              {selectedCustomer.transactions.map(tx => {
                const cfg = txTypeConfig[tx.type];
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                        <i className={`${cfg.icon} text-sm ${cfg.color}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{tx.description}</p>
                        <p className="text-[10px] text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.amount > 0 ? '+' : ''}GHS {Math.abs(tx.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400">Bal: GHS {tx.balance.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {topupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Top Up Wallet</h3>
              <button onClick={() => setTopupModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Adding credit to <strong>{selectedCustomer.name}</strong>'s wallet</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Amount (GHS)</label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={e => setTopupAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="0.00"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} onClick={() => setTopupAmount(amt.toString())} className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 rounded-lg text-xs font-medium text-slate-700 cursor-pointer whitespace-nowrap">
                    GHS {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Payment Method</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                  <option>MoMo (MTN)</option>
                  <option>MoMo (Vodafone)</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setTopupModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => setTopupModal(false)} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#1E5FBE' }}>
                <i className="ri-add-circle-line mr-1" />Add GHS {topupAmount ? parseInt(topupAmount).toLocaleString() : '0'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
