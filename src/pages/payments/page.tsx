import AdminLayout from '@/components/feature/AdminLayout';
import PaymentStats from './components/PaymentStats';
import TransactionTable from './components/TransactionTable';
import VerificationQueue from './components/VerificationQueue';

export default function PaymentsPage() {
  return (
    <AdminLayout title="Payments" subtitle="Financial overview and reconciliation">
      <div className="space-y-5">
        <PaymentStats />

        <TransactionTable />

        <div className="mt-5">
          <VerificationQueue />
        </div>
      </div>
    </AdminLayout>
  );
}
