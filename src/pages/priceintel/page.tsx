import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { priceIntelProducts, priceAlerts } from '@/mocks/priceintel';

export default function PriceIntelPage() {
  const [selectedProduct, setSelectedProduct] = useState(priceIntelProducts[0]);
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
          {priceIntelProducts.map(product => {
            const pos = positionConfig[product.position as keyof typeof positionConfig];
            const diff = product.ourPrice - product.marketAvg;
            return (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full bg-white rounded-2xl border p-4 text-left hover:border-emerald-300 transition-all cursor-pointer ${selectedProduct.id === product.id ? 'border-emerald-400' : 'border-slate-100'}`}
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
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">{selectedProduct.device}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last updated: 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${positionConfig[selectedProduct.position as keyof typeof positionConfig].color}`}>
                  {positionConfig[selectedProduct.position as keyof typeof positionConfig].label}
                </span>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <i className="ri-store-2-line text-emerald-600 text-sm" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">GadgetFlow (You)</span>
                </div>
                <span className="text-base font-bold text-emerald-600">GHS {selectedProduct.ourPrice.toLocaleString()}</span>
              </div>

              {selectedProduct.competitors.map((comp, i) => {
                const diff = comp.price - selectedProduct.ourPrice;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                        <i className="ri-building-2-line text-slate-500 text-sm" />
                      </div>
                      <div>
                        <span className="text-sm text-slate-700">{comp.name}</span>
                        <p className="text-[10px] text-slate-400">{comp.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">GHS {comp.price.toLocaleString()}</p>
                      <p className={`text-[10px] font-medium ${diff > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {diff > 0 ? '+' : ''}{diff.toLocaleString()} vs you
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Market Average Bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Market Range</span>
                <span className="text-xs text-slate-500">Avg: GHS {selectedProduct.marketAvg.toLocaleString()}</span>
              </div>
              <div className="relative h-3 bg-slate-100 rounded-full">
                <div className="absolute top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '60%' }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-sm"
                  style={{ left: `${Math.min(Math.max(((selectedProduct.ourPrice - 7000) / 4000) * 100, 5), 90)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-400">GHS {Math.min(...selectedProduct.competitors.map(c => c.price)).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">GHS {Math.max(...selectedProduct.competitors.map(c => c.price)).toLocaleString()}</span>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className="ri-sparkling-2-line text-violet-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-violet-700 mb-0.5">AI Pricing Suggestion</p>
                  <p className="text-xs text-slate-600">{selectedProduct.suggestion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demand Score */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Market Demand Score</h4>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={selectedProduct.demandScore > 80 ? '#10b981' : selectedProduct.demandScore > 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${selectedProduct.demandScore} ${100 - selectedProduct.demandScore}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-800">{selectedProduct.demandScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  {selectedProduct.demandScore > 80 ? 'High Demand' : selectedProduct.demandScore > 60 ? 'Moderate Demand' : 'Low Demand'}
                </p>
                <p className="text-xs text-slate-500">Based on search trends, competitor stock levels, and your sales velocity over the past 30 days.</p>
                <div className="flex items-center gap-1 mt-2">
                  <i className={`text-xs ${selectedProduct.trend === 'rising' ? 'ri-arrow-up-line text-emerald-500' : selectedProduct.trend === 'falling' ? 'ri-arrow-down-line text-rose-500' : 'ri-subtract-line text-slate-400'}`} />
                  <span className="text-xs text-slate-500 capitalize">{selectedProduct.trend} trend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
