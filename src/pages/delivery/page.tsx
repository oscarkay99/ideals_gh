import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { deliveryOrders, drivers, deliveryZones } from '@/mocks/delivery';

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
        <div className="lg:col-span-2 space-y-4">
          {/* Map Embed */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-slate-800">Live Route Map — Greater Accra</span>
              </div>
              <button className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1">
                <i className="ri-route-line" />Optimize Route
              </button>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127521.47!2d-0.2057!3d5.5913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C+Ghana!5e0!3m2!1sen!2sgh!4v1"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Delivery Map"
            />
          </div>

          {/* Selected Order Detail */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{selectedOrder.customer}</h3>
                <p className="text-xs text-slate-400">{selectedOrder.id} · {selectedOrder.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[selectedOrder.status as OrderStatus].bg} ${statusConfig[selectedOrder.status as OrderStatus].color}`}>
                  <i className={`${statusConfig[selectedOrder.status as OrderStatus].icon} mr-1`} />
                  {statusConfig[selectedOrder.status as OrderStatus].label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 mb-0.5">Delivery Address</p>
                <p className="text-xs font-semibold text-slate-700">{selectedOrder.address}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 mb-0.5">ETA</p>
                <p className="text-xs font-semibold text-slate-700">{selectedOrder.eta} today</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 mb-0.5">Driver</p>
                <p className="text-xs font-semibold text-slate-700">{selectedOrder.driver}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 mb-0.5">Order Value</p>
                <p className="text-xs font-semibold text-emerald-600">GHS {selectedOrder.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4">
              <p className="text-[10px] text-slate-400 mb-1">Items</p>
              {selectedOrder.items.map((item, i) => (
                <p key={i} className="text-xs text-slate-700">• {item}</p>
              ))}
            </div>

            {selectedOrder.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-[10px] text-amber-600 font-semibold mb-0.5">Driver Note</p>
                <p className="text-xs text-slate-700">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#1E5FBE' }}>
                <i className="ri-whatsapp-line mr-1" />Notify Customer
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <i className="ri-phone-line mr-1" />Call Driver
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <i className="ri-checkbox-circle-line mr-1" />Mark Delivered
              </button>
            </div>
          </div>

          {/* Drivers */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Drivers</h4>
            <div className="grid grid-cols-3 gap-3">
              {drivers.map(driver => (
                <div key={driver.id} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-emerald-600 text-sm" />
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${driver.status === 'active' ? 'bg-emerald-100 text-emerald-600' : driver.status === 'idle' ? 'bg-sky-100 text-sky-600' : 'bg-slate-200 text-slate-500'}`}>
                      {driver.status === 'active' ? 'Active' : driver.status === 'idle' ? 'Idle' : 'Off Duty'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{driver.name}</p>
                  <p className="text-[10px] text-slate-400">{driver.deliveries} active · {driver.completed} done</p>
                  <div className="flex items-center gap-1 mt-1">
                    <i className="ri-star-fill text-amber-400 text-[10px]" />
                    <span className="text-[10px] text-slate-500">{driver.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Delivery Zones & Fees</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {deliveryZones.map(zone => (
                <div key={zone.name} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-700">{zone.name}</p>
                  <p className="text-sm font-bold text-emerald-600">GHS {zone.fee}</p>
                  <p className="text-[10px] text-slate-400">{zone.eta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
