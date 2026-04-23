import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';

const reportTypes = [
  { id: 'sales', name: 'Sales Report', icon: 'ri-shopping-bag-3-line', color: '#1E5FBE', desc: 'Revenue, orders, top products, payment methods' },
  { id: 'inventory', name: 'Inventory Report', icon: 'ri-archive-line', color: '#0A1F4A', desc: 'Stock levels, fast movers, restock alerts' },
  { id: 'customers', name: 'Customer Report', icon: 'ri-group-line', color: '#F5A623', desc: 'LTV, segments, retention, new vs returning' },
  { id: 'repairs', name: 'Repairs Report', icon: 'ri-tools-line', color: '#E05A2B', desc: 'Turnaround time, revenue, technician performance' },
  { id: 'expenses', name: 'P&L Statement', icon: 'ri-calculator-line', color: '#154290', desc: 'Revenue vs expenses, profit margins, YTD' },
  { id: 'team', name: 'Team Performance', icon: 'ri-team-line', color: '#25D366', desc: 'Sales per rep, close rates, response times' },
  { id: 'marketing', name: 'Marketing Report', icon: 'ri-megaphone-line', color: '#FE2C55', desc: 'Campaign ROI, leads by channel, conversion rates' },
  { id: 'loyalty', name: 'Loyalty Report', icon: 'ri-vip-crown-line', color: '#F5A623', desc: 'Points issued, redeemed, tier distribution' },
];

const prebuiltReports = [
  { id: 'pr1', name: 'Monthly Sales Summary', type: 'Sales', period: 'April 2026', generated: 'Apr 22, 2026', size: '2.4 MB', format: 'PDF' },
  { id: 'pr2', name: 'Q1 2026 P&L Statement', type: 'Finance', period: 'Jan–Mar 2026', generated: 'Apr 1, 2026', size: '1.8 MB', format: 'Excel' },
  { id: 'pr3', name: 'Inventory Audit Report', type: 'Inventory', period: 'April 2026', generated: 'Apr 20, 2026', size: '3.1 MB', format: 'PDF' },
  { id: 'pr4', name: 'Team Performance Q1', type: 'Team', period: 'Jan–Mar 2026', generated: 'Apr 1, 2026', size: '1.2 MB', format: 'PDF' },
  { id: 'pr5', name: 'Customer Retention Analysis', type: 'Customers', period: 'Q1 2026', generated: 'Apr 5, 2026', size: '2.0 MB', format: 'Excel' },
  { id: 'pr6', name: 'WhatsApp Campaign ROI', type: 'Marketing', period: 'March 2026', generated: 'Apr 2, 2026', size: '0.9 MB', format: 'PDF' },
];

const kpiData = [
  { label: 'Total Revenue (Apr)', value: 'GHS 84,320', change: '+12.4%', up: true, color: '#1E5FBE' },
  { label: 'Total Orders', value: '109', change: '+8.2%', up: true, color: '#0A1F4A' },
  { label: 'Avg Order Value', value: 'GHS 773', change: '+3.8%', up: true, color: '#F5A623' },
  { label: 'Gross Profit', value: 'GHS 9,430', change: '+24.1%', up: true, color: '#25D366' },
  { label: 'Profit Margin', value: '11.2%', change: '+1.8pp', up: true, color: '#154290' },
  { label: 'New Customers', value: '34', change: '+18.5%', up: true, color: '#E05A2B' },
  { label: 'Repair Revenue', value: 'GHS 12,400', change: '+6.3%', up: true, color: '#1A52A8' },
  { label: 'Leads Converted', value: '23', change: '-4.2%', up: false, color: '#F5A623' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'history'>('overview');
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateFrom, setDateFrom] = useState('2026-04-01');
  const [dateTo, setDateTo] = useState('2026-04-30');
  const [format, setFormat] = useState('PDF');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <AdminLayout title="Reports & Export" subtitle="Generate · Download · Share business reports">
      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpiData.slice(0, 4).map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{kpi.label}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border border-slate-200 rounded-xl p-1 bg-white mb-5 w-fit">
        {[['overview', 'Overview'], ['generate', 'Generate Report'], ['history', 'Report History']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'overview' | 'generate' | 'history')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === id ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
            style={activeTab === id ? { background: '#1E5FBE' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* All KPIs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">April 2026 — Key Metrics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map(kpi => (
                <div key={kpi.label} className="p-3 rounded-xl" style={{ background: `${kpi.color}08` }}>
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <i className={`${kpi.up ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-xs`} style={{ color: kpi.up ? '#25D366' : '#E05A2B' }} />
                    <span className="text-[10px] font-semibold" style={{ color: kpi.up ? '#25D366' : '#E05A2B' }}>{kpi.change} vs last month</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Generate */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Generate</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {reportTypes.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => { setSelectedReport(rt.id); setActiveTab('generate'); }}
                  className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${rt.color}15` }}>
                    <i className={`${rt.icon} text-sm`} style={{ color: rt.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{rt.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{rt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Report Type Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Report Type</h3>
            <div className="space-y-1">
              {reportTypes.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => setSelectedReport(rt.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${selectedReport === rt.id ? 'text-white' : 'hover:bg-slate-50'}`}
                  style={selectedReport === rt.id ? { background: '#1E5FBE' } : {}}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: selectedReport === rt.id ? 'rgba(255,255,255,0.2)' : `${rt.color}15` }}>
                    <i className={`${rt.icon} text-xs`} style={{ color: selectedReport === rt.id ? '#fff' : rt.color }} />
                  </div>
                  <span className="text-xs font-semibold">{rt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Config + Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Report Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Date From</label>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Date To</label>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Quick Date Range</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Today', 'This Week', 'This Month', 'Last Month', 'Q1 2026', 'YTD'].map(range => (
                      <button key={range} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer whitespace-nowrap border border-slate-200">
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Export Format</label>
                  <div className="flex gap-2">
                    {['PDF', 'Excel', 'CSV'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${format === f ? 'text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
                        style={format === f ? { background: '#1E5FBE' } : {}}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Include Sections</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Summary', 'Charts', 'Detailed Tables', 'Comparisons', 'Recommendations', 'Raw Data'].map(section => (
                      <label key={section} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-xs text-slate-700">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {generated ? (
              <div className="bg-white rounded-2xl border border-green-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#25D36615' }}>
                    <i className="ri-check-double-line text-lg" style={{ color: '#25D366' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Report Ready!</p>
                    <p className="text-xs text-slate-400">{reportTypes.find(r => r.id === selectedReport)?.name} · {format} · {dateFrom} to {dateTo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                    <i className="ri-download-line mr-1" /> Download {format}
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 cursor-pointer whitespace-nowrap">
                    <i className="ri-mail-send-line mr-1" /> Email Report
                  </button>
                  <button onClick={() => setGenerated(false)} className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 cursor-pointer whitespace-nowrap">
                    New Report
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white cursor-pointer whitespace-nowrap transition-all"
                style={{ background: generating ? '#94A3B8' : 'linear-gradient(135deg, #0A1F4A, #1E5FBE)' }}
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin" /> Generating Report...
                  </span>
                ) : (
                  <span><i className="ri-file-chart-line mr-2" />Generate {reportTypes.find(r => r.id === selectedReport)?.name}</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Generated Reports</h3>
            <span className="text-xs text-slate-400">{prebuiltReports.length} reports</span>
          </div>
          <div className="divide-y divide-slate-100">
            {prebuiltReports.map(report => (
              <div key={report.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: report.format === 'PDF' ? '#E05A2B15' : '#25D36615' }}>
                  <i className={`${report.format === 'PDF' ? 'ri-file-pdf-line' : 'ri-file-excel-line'} text-sm`} style={{ color: report.format === 'PDF' ? '#E05A2B' : '#25D366' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{report.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-400">
                    <span>{report.type}</span>
                    <span>{report.period}</span>
                    <span>Generated: {report.generated}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${report.format === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {report.format}
                  </span>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                    <i className="ri-download-line text-slate-400 text-sm" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                    <i className="ri-share-forward-line text-slate-400 text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}