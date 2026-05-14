import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { priceIntelProducts, priceAlerts } from '@/mocks/priceintel';
import PriceDetail from './components/PriceDetail';

export default function PriceIntelPage() {
  const [selectedProduct, setSelectedProduct] = useState(priceIntelProducts[0] ?? null);
  const [alertDismissed, setAlertDismissed] = useState<string[]>([]);

  const positionConfig = {
    below_market: { label: 'Below Market', color: 'bg-emerald-100 text-emerald-700', icon: 'ri-arrow-down-line' },
    above_market: { label: 'Above Market', color: 'bg-rose-100 text-rose-700', icon: 'ri-arrow-up-line' },
    at_market: { label: 'At Market', color: 'bg-sky-100 text-sky-700', icon: 'ri-subtract-line' },
  };

  const alertConfig = {
    high: { color: 'border-rose-200 bg-rose-50', icon: 'ri-alert-fill text-rose-500', badge: 'bg-rose-100 text-rose-600' },
    medium: { color: 'border-amber-200 bg-amber-50', icon: 'ri-alert-line text-amber-500', badge: 'bg-amber-100 text-amber-600' },
    opportunity: { color: 'border-emerald-200 bg-emerald-50', icon: 'ri-lightbulb-flash-line text-emerald-500', badge: 'bg-emerald-100 text-emerald-600' },
  };

  const visibleAlerts = priceAlerts.filter(a => !alertDismissed.includes(a.id));

  return (
    <AdminLayout title="Price Intelligence" subtitle="Real-time competitor pricing, market position & dynamic pricing alerts">
      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2 mb-5">
          {visibleAlerts.map(alert => {
            const cfg = alertConfig[alert.severity as keyof typeof alertConfig];
            return (
              <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.color}`}>
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className={`${cfg.icon} text-sm`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-800">{alert.device}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                      {alert.severity === 'opportunity' ? 'Opportunity' : alert.severity === 'high' ? 'Action Needed' : 'Monitor'}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-600">{alert.message}</p>
                </div>
                <button onClick={() => setAlertDismissed(prev => [...prev, alert.id])} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/60 cursor-pointer flex-shrink-0">
                  <i className="ri-close-line text-slate-400 text-sm" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Product List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Tracked Products</h3>
          {priceIntelProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center">
              <i className="ri-line-chart-line text-3xl text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-600 mb-1">No products tracked</p>
              <p className="text-xs text-slate-400">Add products to monitor competitor pricing and market position.</p>
            </div>
          ) : priceIntelProducts.map(product => {
            const pos = positionConfig[product.position as keyof typeof positionConfig];
            const diff = product.ourPrice - product.marketAvg;
            return (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full bg-white rounded-2xl border p-4 text-left hover:border-emerald-300 transition-all cursor-pointer ${selectedProduct?.id === product.id ? 'border-emerald-400' : 'border-slate-100'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{product.device}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${pos.color}`}>
                    <i className={`${pos.icon} mr-0.5`} />{pos.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-800">GHS {product.ourPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Market avg: GHS {product.marketAvg.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${diff < 0 ? 'text-emerald-600' : diff > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-slate-400">Demand {product.demandScore}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedProduct && <PriceDetail product={selectedProduct} />}
      </div>
    </AdminLayout>
  );
}
