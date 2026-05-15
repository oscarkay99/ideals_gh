import { useMemo, useState, useEffect } from 'react';
import { useSetting } from '@/hooks/useSettings';
import AdminLayout from '@/components/feature/AdminLayout';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import AIPanel from './components/AIPanel';
import AlertBanner from './components/AlertBanner';
import LiveFeed from './components/LiveFeed';
import TopProducts from './components/TopProducts';
import KPIStrip from './components/KPIStrip';
import ProfitSection from './components/ProfitSection';
import { useSales } from '@/hooks/useSales';
import { useLeads } from '@/hooks/useLeads';
import { useInventory } from '@/hooks/useInventory';
import { useExpenses } from '@/hooks/useExpenses';
import { useTransactions } from '@/hooks/useTransactions';

type Period = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today', yesterday: 'Yesterday', week: 'This Week', month: 'This Month', custom: 'Custom',
};

function parseNum(t: string | number) {
  return typeof t === 'number' ? t : parseFloat(String(t).replace(/[^0-9.]/g, '')) || 0;
}

function parseSaleDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function inRange(dateStr: string, start: Date, end: Date): boolean {
  const d = parseSaleDate(dateStr);
  if (!d) return false;
  const day = startOfDay(d);
  return day >= start && day <= end;
}

function getRange(period: Period, customStart: string, customEnd: string): { start: Date; end: Date } {
  const now = new Date();
  const today = startOfDay(now);
  switch (period) {
    case 'today':     return { start: today, end: today };
    case 'yesterday': { const y = new Date(today); y.setDate(y.getDate() - 1); return { start: y, end: y }; }
    case 'week':      { const ws = new Date(today); ws.setDate(today.getDate() - ((today.getDay() + 6) % 7)); return { start: ws, end: today }; }
    case 'month':     return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today };
    case 'custom':    return {
      start: customStart ? startOfDay(new Date(customStart)) : today,
      end:   customEnd   ? startOfDay(new Date(customEnd))   : today,
    };
  }
}

function getPrevRange(period: Period, range: { start: Date; end: Date }): { start: Date; end: Date } {
  const span = range.end.getTime() - range.start.getTime();
  return {
    start: new Date(range.start.getTime() - span - 86400000),
    end:   new Date(range.start.getTime() - 86400000),
  };
}

function last7Days(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + i); return startOfDay(d);
  });
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return `GHS ${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `GHS ${(n / 1_000).toFixed(1)}k`;
  return `GHS ${Math.round(n).toLocaleString()}`;
}

function changeBadge(curr: number, prev: number): { label: string; trend: 'up' | 'down' | 'neutral' } {
  if (prev === 0 && curr === 0) return { label: 'No data', trend: 'neutral' };
  if (prev === 0) return { label: 'New', trend: 'up' };
  const pct = Math.round(((curr - prev) / Math.abs(prev)) * 100);
  return { label: `${pct >= 0 ? '+' : ''}${pct}% vs prev period`, trend: curr >= prev ? 'up' : 'down' };
}

export default function DashboardPage() {
  const { sales } = useSales();
  const { leads } = useLeads();
  const { products } = useInventory();
  const { expenses } = useExpenses();
  const { transactions } = useTransactions();

  const [period, setPeriod] = useState<Period>('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const { value: targetValue, save: saveSetting } = useSetting('monthly_profit_target');
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [editingTarget, setEditingTarget] = useState(false);

  useEffect(() => {
    setMonthlyTarget(targetValue ? parseFloat(targetValue) : 0);
  }, [targetValue]);

  const dateSubtitle = useMemo(() =>
    new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()) + ' · Accra, Ghana'
  , []);

  const range     = getRange(period, customStart, customEnd);
  const prevRange = getPrevRange(period, range);

  const activeSales = sales.filter(s => s.status !== 'cancelled' && s.status !== 'refunded');

  function estimateCogs(itemsStr: string) {
    return itemsStr.split(',').reduce((sum, part) => {
      const m = part.trim().match(/^(\d+)x\s+(.+)$/);
      if (!m) return sum;
      const product = products.find(p => p.name.toLowerCase() === m[2].trim().toLowerCase());
      return sum + (product?.costPrice ? product.costPrice * parseInt(m[1]) : 0);
    }, 0);
  }
  const saleCogs = (s: typeof activeSales[number]) => s.cogs ?? estimateCogs(s.items);

  const { currSales, prevSales, currRevenue, prevRevenue, currCogs, currOpEx, currProfit, prevProfit,
          revenueSparkline, profitSparkline } = useMemo(() => {
    const curr = activeSales.filter(s => inRange(s.date, range.start, range.end));
    const prev = activeSales.filter(s => inRange(s.date, prevRange.start, prevRange.end));

    const rev  = (arr: typeof curr) => arr.reduce((s, x) => s + parseNum(x.total), 0);
    const cogs = (arr: typeof curr) => arr.reduce((s, x) => s + saleCogs(x), 0);
    const opex = (start: Date, end: Date) => expenses
      .filter(e => e.type === 'expense' && inRange(e.date ?? '', start, end))
      .reduce((s, e) => s + parseNum(e.amount), 0);

    const cRev  = rev(curr);
    const cCogs = cogs(curr);
    const cOpEx = opex(range.start, range.end);
    const pRev  = rev(prev);
    const pCogs = cogs(prev);
    const pOpEx = opex(prevRange.start, prevRange.end);

    const days = last7Days();
    const revSparkline = days.map(d => {
      return activeSales.filter(s => {
        const sd = parseSaleDate(s.date);
        return sd && startOfDay(sd).getTime() === d.getTime();
      }).reduce((s, x) => s + parseNum(x.total), 0);
    });
    const profSparkline = days.map((d, i) => {
      const daySales = activeSales.filter(s => {
        const sd = parseSaleDate(s.date);
        return sd && startOfDay(sd).getTime() === d.getTime();
      });
      const dRev  = daySales.reduce((s, x) => s + parseNum(x.total), 0);
      const dCogs = daySales.reduce((s, x) => s + saleCogs(x), 0);
      const dOpEx = opex(d, d);
      return Math.max(dRev - dCogs - dOpEx, 0);
    });

    return {
      currSales: curr, prevSales: prev,
      currRevenue: cRev, prevRevenue: pRev,
      currCogs: cCogs, currOpEx: cOpEx,
      currProfit: cRev - cCogs - cOpEx,
      prevProfit: pRev - pCogs - pOpEx,
      revenueSparkline: revSparkline,
      profitSparkline:  profSparkline,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, expenses, products, period, customStart, customEnd]);

  function saveTarget(val: string) {
    const n = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (!isNaN(n) && n > 0) {
      setMonthlyTarget(n);
      saveSetting(String(n));
    }
    setEditingTarget(false);
  }

  const monthNetProfit = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const ms = activeSales.filter(s => inRange(s.date, monthStart, today));
    const rev  = ms.reduce((s, x) => s + parseNum(x.total), 0);
    const cogs = ms.reduce((s, x) => s + saleCogs(x), 0);
    const opex = expenses
      .filter(e => e.type === 'expense' && inRange(e.date ?? '', monthStart, today))
      .reduce((s, e) => s + parseNum(e.amount), 0);
    return rev - cogs - opex;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, expenses, products]);

  const targetPct = monthlyTarget > 0 ? Math.min(Math.round((monthNetProfit / monthlyTarget) * 100), 100) : 0;

  const stockAlerts  = products.filter(p => p.stock <= 2).length;
  const outOfStock   = products.filter(p => p.stock === 0).length;
  const currLeads    = leads.filter(l => l.status === 'hot' || l.status === 'warm').length;
  const hotLeads     = leads.filter(l => l.status === 'hot').length;
  const pendingPay   = transactions.filter(t => t.status === 'pending' || t.status === 'needs_review');
  const pendingAmt   = pendingPay.reduce((s, t) => s + parseNum(t.amount), 0);

  const revChange    = changeBadge(currRevenue, prevRevenue);
  const profitChange = changeBadge(currProfit, prevProfit);
  const margin       = currRevenue > 0 ? Math.round((currProfit / currRevenue) * 100) : 0;

  const stockSparkline = [stockAlerts, stockAlerts, stockAlerts, stockAlerts, stockAlerts, stockAlerts, stockAlerts];
  const pendingSparkline = [pendingAmt, pendingAmt, pendingAmt, pendingAmt, pendingAmt, pendingAmt, pendingAmt];

  return (
    <AdminLayout title="Dashboard" subtitle={dateSubtitle}>
      {/* Hero */}
      <div className="rounded-2xl p-5 mb-5 flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #07101F 0%, #0D1F4A 50%, #1552A8 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(245,166,35,0.15)' }} />
        <div className="relative">
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Good morning</p>
          <h2 className="text-white text-xl font-bold tracking-tight">Welcome to your <span style={{ color: '#F5A623' }}>iDeals Tech Hub</span> dashboard.</h2>
          <p className="text-white/50 text-xs mt-1.5">Add products, leads, and sales to see live stats here.</p>
        </div>
        <div className="relative hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Profit Target (Mo)</p>
            {editingTarget ? (
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-white/60 text-sm">GHS</span>
                <input
                  autoFocus
                  type="number"
                  placeholder="e.g. 50000"
                  defaultValue={monthlyTarget > 0 ? String(monthlyTarget) : ''}
                  onBlur={e => saveTarget(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveTarget((e.target as HTMLInputElement).value); if (e.key === 'Escape') setEditingTarget(false); }}
                  className="w-28 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm outline-none text-right"
                />
              </div>
            ) : (
              <>
                <p className="text-white text-lg font-bold">
                  {monthlyTarget > 0 ? fmt(monthlyTarget) : 'GHS —'}
                </p>
                {monthlyTarget > 0 ? (
                  <div className="mt-1.5">
                    <div className="flex items-center justify-end gap-1.5 mb-1">
                      <span className="text-[10px] text-white/40">{fmt(Math.max(monthNetProfit, 0))} net profit</span>
                      <span className="text-[10px] font-semibold" style={{ color: targetPct >= 100 ? '#25D366' : '#F5A623' }}>
                        {targetPct}%
                      </span>
                    </div>
                    <div className="w-28 h-1.5 rounded-full bg-white/10 ml-auto">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${targetPct}%`, background: targetPct >= 100 ? '#25D366' : '#F5A623' }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingTarget(true)}
                    className="mt-0.5 flex items-center gap-1 justify-end cursor-pointer group"
                  >
                    <i className="ri-add-line text-xs" style={{ color: '#F5A623' }} />
                    <span className="text-xs font-semibold group-hover:underline" style={{ color: '#F5A623' }}>Set target</span>
                  </button>
                )}
                {monthlyTarget > 0 && (
                  <button onClick={() => setEditingTarget(true)} className="mt-1 text-[10px] text-white/30 hover:text-white/60 cursor-pointer block ml-auto">
                    Edit target
                  </button>
                )}
              </>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.2)' }}>
            <i className={`ri-trophy-line text-2xl`} style={{ color: targetPct >= 100 ? '#25D366' : '#F5A623' }} />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
          {(Object.keys(PERIOD_LABELS) as Period[]).filter(p => p !== 'custom').map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={period === p
                ? { background: '#0D1F4A', color: 'white' }
                : { color: '#64748b' }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
          <button
            onClick={() => setPeriod('custom')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            style={period === 'custom'
              ? { background: '#0D1F4A', color: 'white' }
              : { color: '#64748b' }}
          >
            Custom
          </button>
        </div>

        {period === 'custom' && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <input
              type="date"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              className="text-xs text-slate-700 outline-none bg-transparent cursor-pointer"
            />
            <span className="text-slate-300 text-xs">→</span>
            <input
              type="date"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              className="text-xs text-slate-700 outline-none bg-transparent cursor-pointer"
            />
          </div>
        )}

        <span className="text-xs text-slate-400 ml-1">
          {currSales.length} sale{currSales.length !== 1 ? 's' : ''} in period
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard
          label="Revenue"
          value={fmt(currRevenue)}
          change={revChange.label}
          trend={revChange.trend}
          icon="ri-money-dollar-circle-line"
          accentColor="#0D1F4A"
          sub={`${currSales.length} sales`}
          sparkline={revenueSparkline}
        />
        <StatCard
          label="Net Profit"
          value={fmt(currProfit)}
          change={profitChange.label}
          trend={profitChange.trend}
          icon="ri-line-chart-line"
          accentColor="#25D366"
          sub={`${margin}% net margin`}
          sparkline={profitSparkline}
        />
        <StatCard
          label="Active Leads"
          value={String(currLeads)}
          change={`${leads.length} total leads`}
          trend="neutral"
          icon="ri-user-star-line"
          accentColor="#F5A623"
          sub={`${hotLeads} hot · ${leads.filter(l => l.status === 'warm').length} warm`}
          sparkline={[0, currLeads, currLeads, currLeads, currLeads, currLeads, currLeads]}
        />
        <StatCard
          label="Stock Alerts"
          value={String(stockAlerts)}
          change={`${outOfStock} out of stock`}
          trend={stockAlerts > 0 ? 'down' : 'up'}
          icon="ri-alert-line"
          accentColor="#E05A2B"
          sub={`${products.length} total products`}
          sparkline={stockSparkline}
        />
        <StatCard
          label="Pending Payments"
          value={fmt(pendingAmt)}
          change={`${pendingPay.length} transactions`}
          trend={pendingPay.length > 0 ? 'down' : 'up'}
          icon="ri-time-line"
          accentColor="#1552A8"
          sub={`${pendingPay.length} awaiting`}
          sparkline={pendingSparkline}
        />
      </div>

      {/* Alert Banner */}
      <div className="mb-5"><AlertBanner /></div>

      {/* Revenue + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <div><AIPanel /></div>
      </div>

      {/* Profit Section */}
      <div className="mb-5"><ProfitSection /></div>

      {/* KPI Strip */}
      <div className="mb-5"><KPIStrip /></div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LiveFeed />
        <TopProducts />
      </div>
    </AdminLayout>
  );
}
