import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { expenseCategories, monthlyExpenses, recentTransactions, expenseStats } from '@/mocks/expenses';

const tabs = ['Overview', 'Transactions', 'Budgets'];

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddExpense, setShowAddExpense] = useState(false);

  const maxExpense = Math.max(...monthlyExpenses.map(m => m.expenses));

  return (
    <AdminLayout title="Expenses & Profit" subtitle="Track spending · Monitor margins · Budget control">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Monthly Revenue', value: `GHS ${expenseStats.totalRevenue.toLocaleString()}`, icon: 'ri-money-dollar-circle-line', color: '#1E5FBE' },
          { label: 'Total Expenses', value: `GHS ${expenseStats.totalExpenses.toLocaleString()}`, icon: 'ri-arrow-down-circle-line', color: '#E05A2B' },
          { label: 'Gross Profit', value: `GHS ${expenseStats.grossProfit.toLocaleString()}`, icon: 'ri-arrow-up-circle-line', color: '#25D366' },
          { label: 'Profit Margin', value: `${expenseStats.profitMargin}%`, icon: 'ri-percent-line', color: '#F5A623' },
        ].map((s) => (
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

      {/* YTD Banner */}
      <div className="rounded-2xl p-5 mb-5 flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0A1F4A 0%, #1E5FBE 100%)' }}>
        <div className="relative">
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Year to Date</p>
          <h2 className="text-white text-xl font-bold tracking-tight">GHS {expenseStats.ytdRevenue.toLocaleString()} revenue · GHS {expenseStats.ytdProfit.toLocaleString()} profit</h2>
          <p className="text-white/50 text-xs mt-1.5">Jan - Apr 2026 · {expenseStats.ytdExpenses.toLocaleString()} in expenses · 7.3% avg margin</p>
        </div>
        <div className="relative hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Outstanding</p>
            <p className="text-white text-lg font-bold">GHS {expenseStats.outstandingPayments.toLocaleString()}</p>
            <p className="text-white/50 text-xs">{expenseStats.pendingInvoices} pending invoices</p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.2)' }}>
            <i className="ri-file-list-3-line text-2xl" style={{ color: '#F5A623' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex border border-slate-200 rounded-xl p-1 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
              style={activeTab === tab ? { background: '#1E5FBE' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
          style={{ background: '#E05A2B' }}
        >
          <i className="ri-add-line mr-1" /> Add Expense
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly Chart */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Revenue vs Expenses vs Profit</h3>
            <div className="flex items-end gap-3 h-48 px-2">
              {monthlyExpenses.filter(m => m.revenue > 0).map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <div className="w-full rounded-t-md relative group" style={{ height: `${(month.revenue / 100000) * 160}px`, background: '#1E5FBE' }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        GHS {month.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="w-full rounded-b-md relative group" style={{ height: `${(month.expenses / 100000) * 160}px`, background: '#E05A2B' }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        GHS {month.expenses.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{month.month}</span>
                  <span className="text-[10px] font-semibold" style={{ color: month.profit > 5000 ? '#25D366' : '#F5A623' }}>+GHS {month.profit.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ background: '#1E5FBE' }} />
                <span className="text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ background: '#E05A2B' }} />
                <span className="text-slate-500">Expenses</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Expense by Category</h3>
            <div className="space-y-3">
              {expenseCategories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded" style={{ background: cat.color }} />
                      <span className="text-slate-700">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">GHS {cat.spent.toLocaleString()} / GHS {cat.budget.toLocaleString()}</span>
                      <span className={`font-semibold ${cat.spent > cat.budget ? 'text-red-500' : 'text-slate-700'}`}>
                        {Math.round((cat.spent / cat.budget) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%`,
                        background: cat.spent > cat.budget ? '#E05A2B' : cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'Transactions' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tx.type === 'expense' ? '#E05A2B15' : '#25D36615' }}>
                  <i className={`${tx.type === 'expense' ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} text-lg`} style={{ color: tx.type === 'expense' ? '#E05A2B' : '#25D366' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{tx.description}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-500">
                    <span>{tx.category}</span>
                    <span>{tx.date}</span>
                    <span className={`px-1.5 py-0.5 rounded-full ${tx.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{tx.status}</span>
                  </div>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${tx.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                  {tx.type === 'expense' ? '-' : '+'}GHS {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'Budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenseCategories.map((cat) => {
            const percent = (cat.spent / cat.budget) * 100;
            const isOver = cat.spent > cat.budget;
            return (
              <div key={cat.id} className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}15` }}>
                      <i className="ri-folder-line text-sm" style={{ color: cat.color }} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isOver ? 'bg-red-50 text-red-500' : percent > 80 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {isOver ? 'Over Budget' : percent > 80 ? 'Near Limit' : 'On Track'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-slate-800">GHS {cat.spent.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">/ GHS {cat.budget.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(percent, 100)}%`, background: isOver ? '#E05A2B' : cat.color }} />
                </div>
                <p className="text-xs text-slate-400">
                  {isOver ? `GHS ${(cat.spent - cat.budget).toLocaleString()} over budget` : `GHS ${(cat.budget - cat.spent).toLocaleString()} remaining`}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Add Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Description</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. iPhone stock purchase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Amount (GHS)</label>
                  <input type="number" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Category</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
                    {expenseCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Date</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Notes</label>
                <textarea className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none" rows={2} placeholder="Optional notes..." />
              </div>
              <button onClick={() => setShowAddExpense(false)} className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#E05A2B' }}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}