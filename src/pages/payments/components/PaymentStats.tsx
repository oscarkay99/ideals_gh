import { useTransactions } from '@/hooks/useTransactions';

function parseAmt(a: string) {
  return parseFloat(a.replace(/[^0-9.]/g, '')) || 0;
}

function fmtGHS(n: number) {
  return `GHS ${Math.round(n).toLocaleString()}`;
}

export default function PaymentStats() {
  const { transactions } = useTransactions();

  const verified   = transactions.filter(t => t.status === 'verified');
  const pending    = transactions.filter(t => t.status === 'pending' || t.status === 'needs_review');
  const needsReview = transactions.filter(t => t.status === 'needs_review');

  const totalCollected   = verified.reduce((s, t) => s + parseAmt(t.amount), 0);
  const pendingTotal     = pending.reduce((s, t) => s + parseAmt(t.amount), 0);

  const momoTotal = verified.filter(t => t.method === 'MoMo').reduce((s, t) => s + parseAmt(t.amount), 0);
  const bankTotal = verified.filter(t => t.method === 'Bank Transfer').reduce((s, t) => s + parseAmt(t.amount), 0);
  const cashCardTotal = verified.filter(t => t.method === 'Cash' || t.method === 'Card').reduce((s, t) => s + parseAmt(t.amount), 0);
  const maxBreakdown = Math.max(momoTotal, bankTotal, cashCardTotal, 1);

  const breakdown = [
    { label: 'MTN MoMo',      value: fmtGHS(momoTotal),     pct: `${Math.round((momoTotal / maxBreakdown) * 100)}%` },
    { label: 'Bank Transfer', value: fmtGHS(bankTotal),     pct: `${Math.round((bankTotal / maxBreakdown) * 100)}%` },
    { label: 'Cash & Card',   value: fmtGHS(cashCardTotal), pct: `${Math.round((cashCardTotal / maxBreakdown) * 100)}%` },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-slate-900">{fmtGHS(totalCollected)}</p>
          <p className="text-xs text-slate-400 mt-1">{verified.length} verified transactions</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Pending Verification</p>
          <p className="text-2xl font-bold text-amber-600">{fmtGHS(pendingTotal)}</p>
          <p className="text-xs text-slate-400 mt-1">{pending.length} transactions</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
          <p className="text-2xl font-bold text-red-500">{fmtGHS(0)}</p>
          <p className="text-xs text-slate-400 mt-1">0 customers</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Reconciliation Queue</p>
          <p className="text-2xl font-bold text-slate-900">{needsReview.length}</p>
          <p className="text-xs text-slate-400 mt-1">items to review</p>
        </div>
      </div>

      {/* Method breakdown — replaces the mock version in the parent */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <i className="ri-smartphone-line text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Mobile Money Integration</p>
              <p className="text-xs text-slate-400">MTN MoMo · Vodafone Cash · AirtelTigo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Connected</span>
            <span className="text-xs text-slate-400">· Last sync: 2 min ago</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-50">
          {breakdown.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-slate-400">{m.label}</p>
              <p className="text-sm font-bold text-slate-800">{m.value}</p>
              <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: m.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
