import { paymentStats } from '@/mocks/payments';

export default function PaymentStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Collected</p>
        <p className="text-2xl font-bold text-slate-900">{paymentStats.totalCollected.value}</p>
        <div className="flex items-center gap-1 mt-1 text-emerald-600">
          <div className="w-3 h-3 flex items-center justify-center">
            <i className="ri-arrow-up-line text-xs" />
          </div>
          <span className="text-xs font-medium">{paymentStats.totalCollected.change}</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Pending Verification</p>
        <p className="text-2xl font-bold text-amber-600">{paymentStats.pendingVerification.value}</p>
        <p className="text-xs text-slate-400 mt-1">{paymentStats.pendingVerification.count} transactions</p>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
        <p className="text-2xl font-bold text-red-500">{paymentStats.outstandingBalance.value}</p>
        <p className="text-xs text-slate-400 mt-1">{paymentStats.outstandingBalance.count} customers</p>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Reconciliation Queue</p>
        <p className="text-2xl font-bold text-slate-900">{paymentStats.reconciliationQueue.value}</p>
        <p className="text-xs text-slate-400 mt-1">{paymentStats.reconciliationQueue.label} to review</p>
      </div>
    </div>
  );
}
