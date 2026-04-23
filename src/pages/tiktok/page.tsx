import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { tiktokChats, tiktokVideos, tiktokCampaigns, tiktokAutomations } from '@/mocks/tiktok';

const tabs = ['DM Inbox', 'Videos', 'Ad Campaigns', 'AI Automations'];

const typeColors: Record<string, string> = {
  repair: '#E05A2B',
  consultation: '#1E5FBE',
  tradein: '#F5A623',
  internal: '#0A1F4A',
  marketing: '#F5A623',
  delivery: '#154290',
};

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
          {/* DM Inbox */}
          {activeTab === 'DM Inbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[500px]">
              {/* Chat List */}
              <div className="lg:border-r border-slate-100 lg:pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}>
                    <i className="ri-tiktok-fill text-white text-sm" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Direct Messages</span>
                  <span className="ml-auto text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-semibold">
                    {tiktokChats.reduce((s, c) => s + c.unread, 0)} new
                  </span>
                </div>
                <div className="space-y-1">
                  {tiktokChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                        selectedChat?.id === chat.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                        {chat.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: '#25F4EE' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-800 truncate">{chat.name}</span>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">{chat.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{chat.source}</span>
                          <span className="text-[10px] text-slate-400">{chat.followerCount.toLocaleString()} followers</span>
                        </div>
                      </div>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: '#FE2C55' }}>
                          {chat.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2 flex flex-col">
                {selectedChat && (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{selectedChat.name}</p>
                        <p className="text-xs text-slate-400">{selectedChat.followerCount.toLocaleString()} followers · {selectedChat.online ? 'Online' : 'Offline'}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                          <i className="ri-phone-line text-slate-400" />
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                          <i className="ri-more-2-fill text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 py-4 space-y-3 overflow-y-auto">
                      {selectedChat.storyReply && (
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{selectedChat.storyReply}</span>
                        </div>
                      )}
                      {selectedChat.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'them' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                            msg.sender === 'them'
                              ? 'bg-slate-100 text-slate-700 rounded-tl-sm'
                              : msg.sender === 'ai'
                                ? 'text-white rounded-tr-sm'
                                : 'bg-white border border-slate-200 text-slate-700 rounded-tr-sm'
                          }`}
                          style={msg.sender === 'ai' ? { background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' } : {}}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.sender === 'ai' ? 'text-white/60' : 'text-slate-400'}`}>{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                          <i className="ri-attachment-2 text-slate-400" />
                        </button>
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}>
                          <i className="ri-send-plane-fill text-sm" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {['Send Product Photo', 'Trade-In Valuation', 'Book Appointment'].map((action) => (
                          <button key={action} className="text-[10px] px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Videos */}
          {activeTab === 'Videos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Recent Videos</h3>
                <button
                  onClick={() => setShowNewPost(true)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}
                >
                  <i className="ri-add-line mr-1" /> New Video
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tiktokVideos.map((video) => (
                  <div key={video.id} className="bg-slate-50 rounded-2xl overflow-hidden">
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.caption} className="w-full h-48 object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white" style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}>
                        {video.type}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2">{video.caption}</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 mb-2">
                        <span><i className="ri-eye-line mr-1" />{formatNumber(video.views)}</span>
                        <span><i className="ri-heart-3-line mr-1" />{formatNumber(video.likes)}</span>
                        <span><i className="ri-chat-1-line mr-1" />{formatNumber(video.comments)}</span>
                        <span><i className="ri-share-forward-line mr-1" />{formatNumber(video.shares)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{video.posted}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: '#FE2C55' }}>
                          {video.leads} leads
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-500">Engagement</span>
                          <span className="font-semibold" style={{ color: '#FE2C55' }}>{video.engagementRate}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(video.engagementRate * 8, 100)}%`, background: 'linear-gradient(90deg, #FE2C55, #25F4EE)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Campaigns */}
          {activeTab === 'Ad Campaigns' && (
            <div className="space-y-3">
              {tiktokCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: campaign.status === 'Active' ? '#FE2C5515' : campaign.status === 'Completed' ? '#25F4EE15' : '#F5A62315' }}>
                    <i className={`${campaign.status === 'Active' ? 'ri-fire-line' : campaign.status === 'Completed' ? 'ri-check-line' : 'ri-time-line'} text-lg`} style={{ color: campaign.status === 'Active' ? '#FE2C55' : campaign.status === 'Completed' ? '#25F4EE' : '#F5A623' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{campaign.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        campaign.status === 'Active' ? 'text-white' : campaign.status === 'Completed' ? 'text-slate-700' : 'text-slate-600'
                      }`}
                      style={{ background: campaign.status === 'Active' ? '#FE2C55' : campaign.status === 'Completed' ? '#25F4EE' : '#F5A623' }}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500">
                      <span>Budget: GHS {campaign.budget.toLocaleString()}</span>
                      <span>Spent: GHS {campaign.spent.toLocaleString()}</span>
                      <span>Reach: {formatNumber(campaign.reach)}</span>
                      <span>Clicks: {formatNumber(campaign.clicks)}</span>
                      <span>Leads: {campaign.leads}</span>
                      <span>CTR: {campaign.ctr}%</span>
                      <span>CPL: GHS {campaign.cpl}</span>
                    </div>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(campaign.spent / campaign.budget) * 100}%`, background: 'linear-gradient(90deg, #FE2C55, #25F4EE)' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-right">{Math.round((campaign.spent / campaign.budget) * 100)}% spent</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Automations */}
          {activeTab === 'AI Automations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiktokAutomations.map((rule) => (
                <div key={rule.id} className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${rule.color}15` }}>
                      <i className="ri-robot-2-line text-sm" style={{ color: rule.color }} />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${rule.status === 'Active' ? 'text-white' : 'text-slate-600'}`} style={{ background: rule.status === 'Active' ? rule.color : '#E5E7EB' }}>
                      {rule.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">{rule.name}</p>
                  <p className="text-xs text-slate-500 mb-3">{rule.trigger}</p>
                  <div className="bg-white rounded-xl p-3 mb-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Action</p>
                    <p className="text-xs text-slate-700">{rule.action}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Triggered: <span className="font-semibold text-slate-700">{rule.triggered}</span></span>
                    <span className="text-slate-500">Converted: <span className="font-semibold" style={{ color: rule.color }}>{rule.converted}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Schedule New Video</h3>
              <button onClick={() => setShowNewPost(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Caption</label>
                <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none" rows={3} placeholder="Write your caption..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Schedule Date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Time</label>
                  <input type="time" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <i className="ri-video-upload-line text-3xl text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">Drop video here or click to upload</p>
              </div>
              <button
                onClick={() => setShowNewPost(false)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}
              >
                Schedule Video
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}