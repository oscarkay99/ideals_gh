import AdminLayout from '@/components/feature/AdminLayout';
import PaymentStats from './components/PaymentStats';
import TransactionTable from './components/TransactionTable';
import VerificationQueue from './components/VerificationQueue';

export default function PaymentsPage() {
  return (
    <AdminLayout title="Payments" subtitle="Financial overview and reconciliation">
      <div className="space-y-5">
        <PaymentStats />

        {/* MoMo status card */}
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
            {[
              { label: 'MTN MoMo', value: 'GHS 48,200', pct: '57%' },
              { label: 'Bank Transfer', value: 'GHS 22,120', pct: '26%' },
              { label: 'Cash & Card', value: 'GHS 14,000', pct: '17%' },
            ].map((m) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <TransactionTable />
          </div>
          <div>
            <VerificationQueue />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
