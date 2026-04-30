import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { suppliers, purchaseOrders, supplierStats } from '@/mocks/suppliers';
import PurchaseOrderDetail from './components/PurchaseOrderDetail';
import NewPOModal from './components/NewPOModal';

const tabs = ['Purchase Orders', 'Suppliers'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  delivered: { label: 'Delivered', color: '#25D366', bg: '#25D36615' },
  in_transit: { label: 'In Transit', color: '#1E5FBE', bg: '#1E5FBE15' },
  pending: { label: 'Pending', color: '#F5A623', bg: '#F5A62315' },
  cancelled: { label: 'Cancelled', color: '#E05A2B', bg: '#E05A2B15' },
};

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState('Purchase Orders');
  const [selectedPO, setSelectedPO] = useState<string | null>(null);
  const [showNewPO, setShowNewPO] = useState(false);

  const selectedOrder = purchaseOrders.find(po => po.id === selectedPO);

  return (
    <AdminLayout title="Purchase Orders" subtitle="Suppliers · Stock Orders · Delivery Tracking">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {[
          { label: 'Total Suppliers', value: `${supplierStats.totalSuppliers}`, icon: 'ri-store-2-line', color: '#1E5FBE' },
          { label: 'Active Orders', value: `${supplierStats.activeOrders}`, icon: 'ri-file-list-3-line', color: '#F5A623' },
          { label: 'Month Spend', value: `GHS ${(supplierStats.totalSpentMonth / 1000).toFixed(0)}K`, icon: 'ri-money-dollar-circle-line', color: '#E05A2B' },
          { label: 'Pending Deliveries', value: `${supplierStats.pendingDeliveries}`, icon: 'ri-truck-line', color: '#0A1F4A' },
          { label: 'Avg Lead Time', value: supplierStats.avgLeadTime, icon: 'ri-time-line', color: '#154290' },
        ].map(s => (
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

      {/* Tabs + Action */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex border border-slate-200 rounded-xl p-1 bg-white">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
              style={activeTab === tab ? { background: '#1E5FBE' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewPO(true)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
          style={{ background: '#1E5FBE' }}
        >
          <i className="ri-add-line mr-1" /> New Purchase Order
        </button>
      </div>

      {/* Purchase Orders */}
      {activeTab === 'Purchase Orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {purchaseOrders.map(po => {
                const st = statusConfig[po.status];
                return (
                  <button
                    key={po.id}
                    onClick={() => setSelectedPO(selectedPO === po.id ? null : po.id)}
                    className={`w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/50 transition-colors ${selectedPO === po.id ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: st.bg }}>
                      <i className="ri-file-list-3-line text-sm" style={{ color: st.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-800">{po.id}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: st.color }}>{st.label}</span>
                      </div>
                      <p className="text-xs text-slate-500">{po.supplier} · {po.items.length} item{po.items.length !== 1 ? 's' : ''}</p>
                      <p className="text-[10px] text-slate-400">Ordered: {po.orderedDate} · Expected: {po.expectedDate}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-800 flex-shrink-0">GHS {po.totalValue.toLocaleString()}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PO Detail */}
          <div>
            {selectedOrder ? (
              <PurchaseOrderDetail order={selectedOrder} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                <i className="ri-file-list-3-line text-3xl text-slate-200 mb-3" />
                <p className="text-xs text-slate-400">Select a purchase order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suppliers */}
      {activeTab === 'Suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#1E5FBE15' }}>
                  <i className="ri-store-2-line text-sm" style={{ color: '#1E5FBE' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{supplier.name}</p>
                  <p className="text-xs text-slate-400">{supplier.category}</p>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className={i < supplier.rating ? 'ri-star-fill text-xs' : 'ri-star-line text-xs'} style={{ color: i < supplier.rating ? '#F5A623' : '#E2E8F0' }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Contact</p>
                  <p className="font-semibold text-slate-700">{supplier.contact}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Lead Time</p>
                  <p className="font-semibold text-slate-700">{supplier.leadTime}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Total Orders</p>
                  <p className="font-semibold text-slate-700">{supplier.totalOrders}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-400">Payment Terms</p>
                  <p className="font-semibold text-slate-700">{supplier.paymentTerms}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-500">Total Value</span>
                <span className="font-bold" style={{ color: '#1E5FBE' }}>{supplier.totalValue}</span>
              </div>
              <button onClick={() => setShowNewPO(true)} className="w-full py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                Create Purchase Order
              </button>
            </div>
          ))}
        </div>
      )}

      {showNewPO && <NewPOModal suppliers={suppliers} onClose={() => setShowNewPO(false)} />}
    </AdminLayout>
  );
}