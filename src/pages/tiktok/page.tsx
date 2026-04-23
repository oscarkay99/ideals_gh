import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { tiktokChats, tiktokVideos, tiktokCampaigns, tiktokAutomations } from '@/mocks/tiktok';
import TikTokDMInbox from './components/TikTokDMInbox';
import TikTokVideos from './components/TikTokVideos';
import TikTokCampaigns from './components/TikTokCampaigns';
import TikTokAutomations from './components/TikTokAutomations';
import ScheduleVideoModal from './components/ScheduleVideoModal';

const tabs = ['DM Inbox', 'Videos', 'Ad Campaigns', 'AI Automations'];

export default function TikTokPage() {
  const [activeTab, setActiveTab] = useState('DM Inbox');
  const [selectedChat, setSelectedChat] = useState(tiktokChats[0]);
  const [chatInput, setChatInput] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const totalReach = tiktokCampaigns.reduce((s, c) => s + c.reach, 0);
  const totalLeads = tiktokCampaigns.reduce((s, c) => s + c.leads, 0);
  const totalSpent = tiktokCampaigns.reduce((s, c) => s + c.spent, 0);
  const activeCampaigns = tiktokCampaigns.filter(c => c.status === 'Active').length;

  const formatNumber = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  return (
    <AdminLayout title="TikTok" subtitle="Command Center · @idealstechhub">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Reach', value: formatNumber(totalReach), icon: 'ri-eye-line', color: '#FE2C55' },
          { label: 'Leads Generated', value: `${totalLeads}`, icon: 'ri-user-add-line', color: '#25F4EE' },
          { label: 'Ad Spend', value: `GHS ${totalSpent.toLocaleString()}`, icon: 'ri-money-dollar-circle-line', color: '#FE2C55' },
          { label: 'Active Campaigns', value: `${activeCampaigns}`, icon: 'ri-fire-line', color: '#25F4EE' },
        ].map((s) => (
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

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'text-slate-800 border-b-2'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === tab ? { borderColor: '#FE2C55' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'DM Inbox' && (
            <TikTokDMInbox
              chats={tiktokChats}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
              chatInput={chatInput}
              onChatInputChange={setChatInput}
            />
          )}

          {activeTab === 'Videos' && (
            <TikTokVideos
              videos={tiktokVideos}
              onNewVideo={() => setShowNewPost(true)}
              formatNumber={formatNumber}
            />
          )}

          {activeTab === 'Ad Campaigns' && (
            <TikTokCampaigns campaigns={tiktokCampaigns} formatNumber={formatNumber} />
          )}

          {activeTab === 'AI Automations' && (
            <TikTokAutomations automations={tiktokAutomations} />
          )}
        </div>
      </div>

      <ScheduleVideoModal open={showNewPost} onClose={() => setShowNewPost(false)} />
    </AdminLayout>
  );
}
