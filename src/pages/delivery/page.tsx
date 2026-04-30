import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { deliveryOrders, drivers, deliveryZones } from '@/mocks/delivery';
import DeliveryDetail from './components/DeliveryDetail';

type OrderStatus = 'pending' | 'in_transit' | 'delivered';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100', icon: 'ri-time-line' },
  in_transit: { label: 'In Transit', color: 'text-sky-600', bg: 'bg-sky-100', icon: 'ri-truck-line' },
  delivered: { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: 'ri-checkbox-circle-line' },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  high: { color: 'text-rose-600', bg: 'bg-rose-100' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-100' },
  low: { color: 'text-slate-500', bg: 'bg-slate-100' },
};

export default function DeliveryPage() {
  const [selectedOrder, setSelectedOrder] = useState(deliveryOrders[0]);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filtered = filter === 'all' ? deliveryOrders : deliveryOrders.filter(o => o.status === filter);

  const stats = {
    total: deliveryOrders.length,
    pending: deliveryOrders.filter(o => o.status === 'pending').length,
    inTransit: deliveryOrders.filter(o => o.status === 'in_transit').length,
    delivered: deliveryOrders.filter(o => o.status === 'delivered').length,
  };

  return (
    <AdminLayout title="Delivery Route Optimizer" subtitle="Same-day delivery management, route planning & driver tracking">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Today', value: stats.total, icon: 'ri-truck-line', color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Pending', value: stats.pending, icon: 'ri-time-line', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Transit', value: stats.inTransit, icon: 'ri-navigation-line', color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Delivered', value: stats.delivered, icon: 'ri-checkbox-circle-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-xl">
                <i className={`${s.icon} text-base ${s.color}`} />
              </div>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order List */}
        <div>
          {/* Filter */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 mb-3">
            {(['all', 'pending', 'in_transit', 'delivered'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                {f === 'in_transit' ? 'Transit' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map(order => {
              const sc = statusConfig[order.status as OrderStatus];
              const pc = priorityConfig[order.priority];
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full bg-white rounded-2xl border p-4 text-left hover:border-emerald-300 transition-all cursor-pointer ${selectedOrder.id === order.id ? 'border-emerald-400' : 'border-slate-100'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{order.customer}</p>
                      <p className="text-xs text-slate-400">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${pc.bg} ${pc.color}`}>
                        {order.priority}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${sc.bg} ${sc.color}`}>
                        <i className={`${sc.icon} mr-0.5`} />{sc.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <i className="ri-map-pin-line text-slate-400" />
                    <span className="truncate">{order.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{order.items.join(', ')}</span>
                    <span className="text-xs font-bold text-slate-700">ETA {order.eta}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map + Detail */}
        <DeliveryDetail order={selectedOrder} drivers={drivers} zones={deliveryZones} />
      </div>
    </AdminLayout>
  );
}
