import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import MarketingStats from './components/MarketingStats';
import AnalyticsSection from './components/AnalyticsSection';
import CampaignList from './components/CampaignList';
import CampaignCalendar from './components/CampaignCalendar';
import TopCreatives from './components/TopCreatives';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line' },
  { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-2-line' },
  { id: 'campaigns', label: 'Campaigns', icon: 'ri-megaphone-line' },
  { id: 'calendar', label: 'Calendar', icon: 'ri-calendar-line' },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout title="Marketing" subtitle="Campaigns, analytics, and performance insights">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 mb-5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${tab.icon} text-sm`} />
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <MarketingStats />

          {/* Quick insight banner */}
          <div className="bg-[#0F172A] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/20 flex-shrink-0">
              <i className="ri-sparkling-2-line text-emerald-400 text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">AI Marketing Insight</p>
              <p className="text-xs text-white/60 mt-0.5">
                WhatsApp is your highest-converting channel at 46% of leads. The iPhone 15 Flash Sale has a 5.1x ROI — consider extending it by 3 days. 3 leads from Instagram went cold this week — a re-engagement broadcast could recover 20–30%.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-sparkling-2-line text-xs" />
              </div>
              Generate Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <CampaignList />
            </div>
            <div className="space-y-5">
              <TopCreatives />
              {/* Channel breakdown mini */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Active Campaigns</h3>
                <div className="space-y-3">
                  {[
                    { name: 'iPhone 15 Flash Sale', status: 'active', ends: '2 days left', roi: '5.1x', color: 'bg-emerald-500' },
                    { name: 'MacBook Air M2 Promo', status: 'active', ends: '5 days left', roi: '4.8x', color: 'bg-emerald-500' },
                    { name: 'Repair Service Awareness', status: 'paused', ends: 'Paused', roi: '3.4x', color: 'bg-red-400' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.ends}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{c.roi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <MarketingStats />

          {/* Period selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Performance Analytics</h2>
            <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1">
              {['This Month', 'Last Month', 'Last 3 Months'].map((p) => (
                <button
                  key={p}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer whitespace-nowrap first:bg-slate-900 first:text-white"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <AnalyticsSection />

          {/* ROI breakdown table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Campaign ROI Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Campaign', 'Budget', 'Spent', 'Revenue Generated', 'ROI', 'Leads', 'Cost/Lead', 'Conv. Rate'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Refurbished Phones Drive', budget: 'GHS 500', spent: 'GHS 500', revenue: 'GHS 3,100', roi: '6.2x', leads: 92, cpl: 'GHS 5.4', cvr: '33.7%' },
                    { name: 'iPhone 15 Flash Sale', budget: 'GHS 800', spent: 'GHS 620', revenue: 'GHS 3,162', roi: '5.1x', leads: 68, cpl: 'GHS 9.1', cvr: '32.4%' },
                    { name: 'MacBook Air M2 Promo', budget: 'GHS 600', spent: 'GHS 480', revenue: 'GHS 2,304', roi: '4.8x', leads: 44, cpl: 'GHS 10.9', cvr: '31.8%' },
                    { name: 'Repair Service Awareness', budget: 'GHS 350', spent: 'GHS 210', revenue: 'GHS 714', roi: '3.4x', leads: 38, cpl: 'GHS 5.5', cvr: '31.6%' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{row.budget}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{row.spent}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800">{row.revenue}</td>
                      <td className="px-4 py-3 text-xs font-bold text-emerald-600">{row.roi}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">{row.leads}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{row.cpl}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-16">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: row.cvr }} />
                          </div>
                          <span className="text-xs font-medium text-slate-700">{row.cvr}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-5">
          <MarketingStats />
          <CampaignList />
          <TopCreatives />
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <CampaignCalendar />
            </div>
            <div className="space-y-4">
              {/* Upcoming events */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Upcoming This Week</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Apr 23', label: 'Story Post — iPhone 15', channel: 'instagram', color: 'text-pink-500', icon: 'ri-instagram-line' },
                    { day: 'Apr 25', label: 'iPhone Flash Sale Ends', channel: 'whatsapp', color: 'text-[#25D366]', icon: 'ri-whatsapp-line' },
                    { day: 'Apr 27', label: 'Accessories Bundle Launches', channel: 'instagram', color: 'text-pink-500', icon: 'ri-instagram-line' },
                    { day: 'Apr 28', label: 'MacBook Promo Ends', channel: 'whatsapp', color: 'text-[#25D366]', icon: 'ri-whatsapp-line' },
                    { day: 'Apr 30', label: 'Monthly Broadcast', channel: 'whatsapp', color: 'text-[#25D366]', icon: 'ri-whatsapp-line' },
                  ].map((ev, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-center w-10 flex-shrink-0">
                        <p className="text-[10px] text-slate-400 leading-tight">{ev.day.split(' ')[0]}</p>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{ev.day.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{ev.label}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className={`w-3 h-3 flex items-center justify-center ${ev.color}`}>
                            <i className={`${ev.icon} text-xs`} />
                          </div>
                          <span className="text-[10px] text-slate-400 capitalize">{ev.channel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule new */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-100 mb-3">
                  <i className="ri-add-circle-line text-emerald-600 text-base" />
                </div>
                <p className="text-sm font-semibold text-emerald-800 mb-1">Schedule a Campaign</p>
                <p className="text-xs text-emerald-600 mb-3">Plan your next WhatsApp broadcast or Instagram post.</p>
                <button className="w-full py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
                  + New Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
