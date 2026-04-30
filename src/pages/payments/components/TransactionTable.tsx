import { useState } from 'react';
import { transactions as initialTransactions } from '@/mocks/payments';

const statusConfig: Record<string, { label: string; color: string }> = {
  verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-600' },
  needs_review: { label: 'Needs Review', color: 'bg-slate-100 text-slate-600' },
};

const methodIcons: Record<string, string> = {
  MoMo: 'ri-smartphone-line',
  'Bank Transfer': 'ri-bank-line',
  Cash: 'ri-money-dollar-circle-line',
  Card: 'ri-bank-card-line',
};

export default function TransactionTable() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const approve = (id: string) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'verified' } : t));

  const filtered = transactions.filter((t) => {
    const matchStatus = filter === 'all' || t.status === filter;
    const matchSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 flex-1">Transactions</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'verified', 'pending', 'needs_review', 'failed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'All' : statusConfig[s]?.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <div className="w-4 h-4 flex items-center justify-center text-slate-400">
            <i className="ri-search-line text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-32"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['ID', 'Customer', 'Product', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn, i) => (
              <>
                <tr key={txn.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{txn.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {txn.customer[0]}
                      </div>
                      <span className="text-xs font-medium text-slate-800 whitespace-nowrap">{txn.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[140px] truncate">{txn.product}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-900 whitespace-nowrap">{txn.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <div className="w-4 h-4 flex items-center justify-center text-slate-500">
                        <i className={`${methodIcons[txn.method]} text-xs`} />
                      </div>
                      <span className="text-xs text-slate-600">{txn.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusConfig[txn.status].color}`}>
                      {statusConfig[txn.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{txn.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${expandedId === txn.id ? 'bg-blue-50 text-blue-500' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                      >
                        <i className="ri-eye-line text-sm" />
                      </button>
                      {txn.status === 'pending' && (
                        <button
                          onClick={() => approve(txn.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-emerald-500 cursor-pointer transition-all"
                          title="Approve transaction"
                        >
                          <i className="ri-checkbox-circle-line text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedId === txn.id && (
                  <tr className="bg-blue-50/40 border-b border-blue-100">
                    <td colSpan={8} className="px-6 py-3 text-xs text-slate-600">
                      <div className="flex flex-wrap gap-6">
                        <span><strong className="text-slate-700">Reference:</strong> {txn.reference}</span>
                        <span><strong className="text-slate-700">Product:</strong> {txn.product}</span>
                        <span><strong className="text-slate-700">Customer:</strong> {txn.customer}</span>
                        <span><strong className="text-slate-700">Amount:</strong> {txn.amount}</span>
                        <span><strong className="text-slate-700">Method:</strong> {txn.method}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
