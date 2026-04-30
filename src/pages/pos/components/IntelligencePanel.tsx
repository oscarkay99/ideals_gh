import {
  productMetrics, bundleInsights, peakHours, customerIntelligence,
  type ProductMetrics,
} from '@/mocks/posIntelligence';
import { posProducts } from '@/mocks/pos';

function formatGHS(n: number) {
  return `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function VelocityBadge({ v }: { v: ProductMetrics['velocity'] }) {
  const cfg = {
    hot:    { label: '🔥 Hot', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
    steady: { label: '📈 Steady', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    slow:   { label: '🐢 Slow', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
    new:    { label: '✨ New', cls: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  }[v];
  return <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${cfg.cls}`}>{cfg.label}</span>;
}

function TrendIcon({ t }: { t: ProductMetrics['trend'] }) {
  if (t === 'up') return <i className="ri-arrow-up-line text-emerald-500 text-xs" />;
  if (t === 'down') return <i className="ri-arrow-down-line text-rose-500 text-xs" />;
  return <i className="ri-subtract-line text-slate-400 text-xs" />;
}

export default function IntelligencePanel() {
  const metrics = productMetrics.sort((a, b) => b.revenue30d - a.revenue30d);
  const reorderAlerts = metrics.filter(m => m.reorderAlert);
  const slowMovers = metrics.filter(m => m.velocity === 'slow' && m.daysOfStock > 30).slice(0, 4);
  const topSellers = metrics.slice(0, 5);

  const maxHourRevenue = Math.max(...peakHours.map(h => h.revenue));
  const peakHour = peakHours.reduce((a, b) => b.transactions > a.transactions ? b : a, peakHours[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto pb-4">

      {/* ── Top sellers ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          <i className="ri-bar-chart-fill mr-1 text-[#1E5FBE]" />Top Performers — 30 Days
        </p>
        <div className="space-y-2">
          {topSellers.map((m, i) => {
            const product = posProducts.find(p => p.id === m.productId);
            if (!product) return null;
            const barWidth = Math.round((m.revenue30d / (metrics[0]?.revenue30d ?? 1)) * 100);
            return (
              <div key={m.productId}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                  <p className="flex-1 text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                  <VelocityBadge v={m.velocity} />
                  <TrendIcon t={m.trend} />
                  <span className="text-xs font-bold text-slate-700">{formatGHS(m.revenue30d)}</span>
                </div>
                <div className="ml-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg, #1E5FBE, #3b82f6)' }} />
                </div>
                <div className="ml-6 flex gap-3 mt-0.5 text-[9px] text-slate-400">
                  <span>{m.unitsSold30d} units</span>
                  <span>{formatGHS(m.profit30d)} profit</span>
                  <span>{m.daysOfStock < 999 ? `${m.daysOfStock}d stock` : 'Ample stock'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Reorder alerts + slow movers ─────────────────────────────────── */}
      <div className="space-y-4">
        {reorderAlerts.length > 0 && (
          <div className="bg-rose-50 rounded-2xl border border-rose-200 p-4">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">
              <i className="ri-alarm-warning-line mr-1" />Reorder Alerts
            </p>
            <div className="space-y-2">
              {reorderAlerts.map(m => {
                const product = posProducts.find(p => p.id === m.productId);
                if (!product) return null;
                return (
                  <div key={m.productId} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                    <i className="ri-error-warning-fill text-rose-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                      <p className="text-[10px] text-rose-500">{m.daysOfStock}d of stock left · {m.unitsSold30d} sold last 30d</p>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">Reorder</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">
            <i className="ri-snail-line mr-1" />Slow Movers — Consider Promotion
          </p>
          {slowMovers.length === 0 ? (
            <p className="text-xs text-amber-600">All products moving well</p>
          ) : (
            <div className="space-y-2">
              {slowMovers.map(m => {
                const product = posProducts.find(p => p.id === m.productId);
                if (!product) return null;
                return (
                  <div key={m.productId} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                    <i className="ri-time-line text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                      <p className="text-[10px] text-amber-600">{m.unitsSold30d} units/30d · {m.daysOfStock}d stock remaining</p>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold">{m.sellThrough}% sell-through</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Peak hours chart ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <i className="ri-time-line mr-1 text-indigo-500" />Peak Hours — 30 Day Average
          </p>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
            Peak: {peakHour?.label}
          </span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {peakHours.filter(h => h.hour >= 8 && h.hour <= 20).map(h => {
            const height = Math.round((h.revenue / maxHourRevenue) * 100);
            const isTop = h.hour === peakHour?.hour;
            return (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${height}%`,
                    minHeight: 2,
                    background: isTop ? 'linear-gradient(180deg,#1E5FBE,#3b82f6)' : '#e2e8f0',
                  }}
                />
                <span className="text-[8px] text-slate-400">{h.label}</span>
                <div className="absolute bottom-full mb-1 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                  {h.transactions} sales · {formatGHS(h.revenue)}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Best time to run promotions: <span className="font-semibold text-indigo-600">{peakHour?.label} – {peakHours[peakHours.indexOf(peakHour!) + 1]?.label ?? '6pm'}</span>
        </p>
      </div>

      {/* ── Frequently bought together ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          <i className="ri-links-line mr-1 text-emerald-500" />Frequently Bought Together
        </p>
        <div className="space-y-2">
          {bundleInsights.slice(0, 5).map((b, i) => {
            const pA = posProducts.find(p => p.id === b.productA);
            const pB = posProducts.find(p => p.id === b.productB);
            if (!pA || !pB) return null;
            return (
              <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                    <span className="truncate">{pA.name}</span>
                    <i className="ri-add-line text-slate-400 flex-shrink-0" />
                    <span className="truncate">{pB.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{b.coOccurrences}× co-purchased</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-bold text-emerald-600">{b.liftScore}x lift</p>
                  <p className="text-[9px] text-slate-400">correlation</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 mt-3 bg-emerald-50 rounded-lg px-2 py-1.5 text-center">
          <i className="ri-lightbulb-line mr-1 text-emerald-500" />
          Suggest these bundles at checkout for +18% avg order value
        </p>
      </div>

      {/* ── Customer intelligence ─────────────────────────────────────────── */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          <i className="ri-user-star-line mr-1 text-amber-500" />Customer Intelligence
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {customerIntelligence.sort((a, b) => b.vipScore - a.vipScore).map(ci => {
            const names = ['Kwame Asante', 'Ama Owusu', 'Kofi Mensah', 'Abena Frimpong', 'Yaw Darko'];
            const idx = parseInt(ci.customerId.replace('c', '')) - 1;
            const name = names[idx] ?? ci.customerId;
            const initials = name.split(' ').map(n => n[0]).join('');
            const churnColors = { low: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', high: 'text-rose-600 bg-rose-50' };
            return (
              <div key={ci.customerId} className="bg-slate-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1E5FBE]/10 flex items-center justify-center text-[11px] font-bold text-[#1E5FBE] flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{name}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < Math.round(ci.vipScore / 20) ? '#F5A623' : '#e2e8f0' }} />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400">{ci.vipScore}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between"><span className="text-slate-400">Spent</span><span className="font-semibold">{formatGHS(ci.totalSpent)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Orders</span><span className="font-semibold">{ci.totalTransactions}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Last visit</span><span className="font-semibold">{ci.daysSinceLastPurchase}d ago</span></div>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${churnColors[ci.churnRisk]}`}>
                  {ci.churnRisk === 'low' ? 'Loyal' : ci.churnRisk === 'medium' ? 'At risk' : 'Churning'}
                </span>
                <p className="text-[9px] text-indigo-600 bg-indigo-50 rounded-lg px-1.5 py-1 leading-relaxed">
                  <i className="ri-sparkling-2-line mr-0.5" />{ci.predictedNextPurchase}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Demand forecast ───────────────────────────────────────────────── */}
      <div className="lg:col-span-2 bg-gradient-to-r from-[#0A1F4A] to-[#1E5FBE] rounded-2xl p-4 text-white">
        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-3">
          <i className="ri-sparkling-2-line mr-1 text-amber-400" />AI Demand Forecast — Next 7 Days
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {productMetrics.filter(m => m.velocity === 'hot' || m.trend === 'up').slice(0, 4).map(m => {
            const product = posProducts.find(p => p.id === m.productId);
            if (!product) return null;
            const forecastUnits = Math.round(m.avgDailySales * 7 * 1.1); // 10% weekend boost
            const forecastRevenue = forecastUnits * product.price;
            return (
              <div key={m.productId} className="bg-white/10 rounded-xl p-3">
                <p className="text-xs font-semibold text-white truncate mb-1">{product.name}</p>
                <p className="text-2xl font-black text-white">{forecastUnits}</p>
                <p className="text-[10px] text-white/60">units expected</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-1">{formatGHS(forecastRevenue)} revenue</p>
                <div className={`text-[9px] mt-1.5 px-1.5 py-0.5 rounded-full inline-block ${m.trend === 'up' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {m.trend === 'up' ? '↑ Trending up' : '→ Steady demand'}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-white/40 mt-3">
          Based on 30-day sales velocity · Updated daily · Stock up before weekend rush
        </p>
      </div>
    </div>
  );
}
