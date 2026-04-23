import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { igContacts, igConversations, igPosts, igStats, igCampaigns } from '@/mocks/instagram';

type Tab = 'inbox' | 'posts' | 'campaigns' | 'automations';

const statusColors: Record<string, string> = {
  hot_lead: 'bg-rose-100 text-rose-600',
  inquiry: 'bg-amber-100 text-amber-600',
  customer: 'bg-blue-100 text-blue-700',
};
const statusLabels: Record<string, string> = {
  hot_lead: 'Hot Lead',
  inquiry: 'Inquiry',
  customer: 'Customer',
};

// Instagram gradient
const igGradient = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

export default function InstagramPage() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [selectedContact, setSelectedContact] = useState(igContacts[0]);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(igConversations);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [postModal, setPostModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = conversations[selectedContact.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact, conversations]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      from: 'agent' as const,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AdminLayout title="Instagram Command Center" subtitle="DM inbox, post analytics, ad campaigns & AI auto-replies">
      {/* Stats Strip */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Followers', value: igStats.followers, icon: 'ri-user-follow-line' },
          { label: 'Weekly Reach', value: igStats.weeklyReach, icon: 'ri-eye-line' },
          { label: 'Active DMs', value: igStats.activeDMs.toString(), icon: 'ri-message-3-line' },
          { label: 'Engagement', value: igStats.engagementRate, icon: 'ri-heart-line' },
          { label: 'Conversion', value: igStats.conversionRate, icon: 'ri-arrow-up-circle-line' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 flex items-center justify-center rounded-md" style={{ background: igGradient }}>
                <i className={`${s.icon} text-[10px] text-white`} />
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-5">
        {(['inbox', 'posts', 'campaigns', 'automations'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t === 'inbox' && <><i className="ri-message-3-line mr-1.5" />DM Inbox</>}
            {t === 'posts' && <><i className="ri-image-line mr-1.5" />Posts & Reels</>}
            {t === 'campaigns' && <><i className="ri-advertisement-line mr-1.5" />Ad Campaigns</>}
            {t === 'automations' && <><i className="ri-robot-2-line mr-1.5" />AI Automations</>}
          </button>
        ))}
      </div>

      {/* ── INBOX ── */}
      {tab === 'inbox' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ height: '620px' }}>
          <div className="flex h-full">
            {/* Contact List */}
            <div className="w-[300px] border-r border-slate-100 flex flex-col flex-shrink-0">
              {/* IG Header */}
              <div className="p-3 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: igGradient }}>
                    <i className="ri-instagram-line text-white text-sm" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">@ideals_techhub</span>
                  <span className="ml-auto text-[10px] text-slate-400">{igStats.followers} followers</span>
                </div>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700 outline-none" placeholder="Search DMs..." />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {igContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-start gap-3 p-3 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer text-left ${selectedContact.id === contact.id ? 'bg-pink-50' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      {/* IG story ring */}
                      <div className="w-10 h-10 rounded-full p-0.5" style={{ background: contact.online ? igGradient : '#e2e8f0' }}>
                        <div className={`w-full h-full rounded-full ${contact.avatarColor} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}>
                          {contact.avatar}
                        </div>
                      </div>
                      {contact.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-slate-800 truncate">{contact.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{contact.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">{contact.source}</span>
                        </div>
                        {contact.unread > 0 && (
                          <span className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold" style={{ background: igGradient }}>
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full p-0.5" style={{ background: igGradient }}>
                    <div className={`w-full h-full rounded-full ${selectedContact.avatarColor} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}>
                      {selectedContact.avatar}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{selectedContact.name}</p>
                    <p className="text-xs text-slate-400">{selectedContact.displayName} · {selectedContact.followers} followers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-slate-500">AI Auto-Reply</span>
                    <button
                      onClick={() => setAiEnabled(!aiEnabled)}
                      className="relative w-8 h-4 rounded-full transition-all cursor-pointer"
                      style={{ background: aiEnabled ? undefined : '#cbd5e1' }}
                    >
                      {aiEnabled && <span className="absolute inset-0 rounded-full" style={{ background: igGradient }} />}
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all z-10 ${aiEnabled ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                    <i className="ri-instagram-line text-slate-500 text-sm" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                    <i className="ri-more-2-line text-slate-500 text-sm" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {currentMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'customer' ? 'justify-start' : 'justify-end'}`}>
                    <div className="max-w-[70%]">
                      {msg.from !== 'customer' && (
                        <div className="flex items-center gap-1 mb-1 justify-end">
                          {msg.aiGenerated && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ background: igGradient }}>
                              <i className="ri-robot-2-line mr-0.5" />AI
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{msg.from === 'ai' ? 'AI Agent' : 'You'}</span>
                        </div>
                      )}
                      {msg.mediaType && (
                        <div className="mb-1 flex items-center gap-1 text-[10px] text-slate-400">
                          <i className={`${msg.mediaType === 'story' ? 'ri-slideshow-line' : msg.mediaType === 'reel' ? 'ri-film-line' : 'ri-image-line'} text-xs`} />
                          Replied to your {msg.mediaType}
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                          msg.from === 'customer'
                            ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
                            : 'text-white rounded-tr-sm'
                        }`}
                        style={msg.from !== 'customer' ? { background: msg.aiGenerated ? igGradient : '#1E5FBE' } : {}}
                      >
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-slate-400 mt-1 ${msg.from === 'customer' ? 'text-left' : 'text-right'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Send a DM..."
                      rows={1}
                      className="w-full bg-transparent text-sm text-slate-700 outline-none resize-none"
                    />
                  </div>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer">
                    <i className="ri-image-line text-slate-500 text-sm" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer">
                    <i className="ri-heart-line text-slate-500 text-sm" />
                  </button>
                  <button
                    onClick={sendMessage}
                    className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer hover:opacity-90"
                    style={{ background: igGradient }}
                  >
                    <i className="ri-send-plane-fill text-white text-sm" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button className="text-xs cursor-pointer flex items-center gap-1" style={{ color: '#dc2743' }}>
                    <i className="ri-sparkling-2-line" />Generate AI Reply
                  </button>
                  <button className="text-xs cursor-pointer flex items-center gap-1" style={{ color: '#F5A623' }}>
                    <i className="ri-file-add-line" />Create Quote
                  </button>
                  <button className="text-xs cursor-pointer flex items-center gap-1" style={{ color: '#1E5FBE' }}>
                    <i className="ri-user-star-line" />Convert to Lead
                  </button>
                  <button className="text-xs cursor-pointer flex items-center gap-1 text-slate-500">
                    <i className="ri-image-2-line" />Send Product Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-[220px] border-l border-slate-100 p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full p-0.5 mx-auto mb-2" style={{ background: igGradient }}>
                  <div className={`w-full h-full rounded-full ${selectedContact.avatarColor} flex items-center justify-center text-white text-lg font-bold border-2 border-white`}>
                    {selectedContact.avatar}
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800">{selectedContact.displayName}</p>
                <p className="text-xs text-slate-400">@{selectedContact.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedContact.followers} followers</p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[selectedContact.status] || 'bg-slate-100 text-slate-500'}`}>
                  {statusLabels[selectedContact.status] || selectedContact.status}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Source</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: igGradient }}>
                    <i className="ri-instagram-line text-white text-[9px]" />
                  </div>
                  <span className="text-xs text-slate-700">{selectedContact.source}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Quick Actions</p>
                {[
                  { label: 'Create Quote', icon: 'ri-file-add-line', color: '#1E5FBE' },
                  { label: 'Add to Leads', icon: 'ri-user-star-line', color: '#F5A623' },
                  { label: 'View Profile', icon: 'ri-instagram-line', color: '#dc2743' },
                  { label: 'Send Catalog', icon: 'ri-store-2-line', color: '#cc2366' },
                  { label: 'Book Repair', icon: 'ri-tools-line', color: '#e6683c' },
                ].map(a => (
                  <button key={a.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-left">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${a.icon} text-sm`} style={{ color: a.color }} />
                    </div>
                    <span className="text-xs text-slate-700">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── POSTS & REELS ── */}
      {tab === 'posts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Posts & Reels Performance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track engagement, reach and leads generated from each post</p>
            </div>
            <button
              onClick={() => setPostModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: igGradient }}
            >
              <i className="ri-add-line" />New Post
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {igPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <img src={post.thumbnail} alt={post.type} className="w-20 h-20 rounded-xl object-cover object-top" />
                    <span
                      className="absolute top-1 left-1 text-[9px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase"
                      style={{ background: igGradient }}
                    >
                      {post.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-2">{post.caption}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1"><i className="ri-heart-line text-rose-400" />{post.likes.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><i className="ri-chat-1-line text-sky-400" />{post.comments}</span>
                      <span className="flex items-center gap-1"><i className="ri-share-line text-violet-400" />{post.shares}</span>
                      <span className="flex items-center gap-1"><i className="ri-bookmark-line text-amber-400" />{post.saves}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Reach: <strong className="text-slate-700">{post.reach.toLocaleString()}</strong></span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#EEF4FF', color: '#1E5FBE' }}>
                        {post.leads} leads
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">{post.postedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min((post.likes / 4000) * 100, 100)}%`, background: igGradient }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-400">Engagement rate</span>
                    <span className="text-[10px] font-semibold text-slate-600">
                      {((post.likes + post.comments + post.shares) / post.reach * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AD CAMPAIGNS ── */}
      {tab === 'campaigns' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Instagram Ad Campaigns</h3>
            <button
              className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: igGradient }}
            >
              <i className="ri-add-line" />New Campaign
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Reach', value: '46.2K', icon: 'ri-eye-line' },
              { label: 'Total Clicks', value: '2,697', icon: 'ri-cursor-line' },
              { label: 'Leads Generated', value: '104', icon: 'ri-user-star-line' },
              { label: 'Total Spend', value: 'GHS 700', icon: 'ri-money-dollar-circle-line' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: igGradient }}>
                    <i className={`${s.icon} text-white text-sm`} />
                  </div>
                  <span className="text-xs text-slate-500">{s.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {igCampaigns.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        c.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                        c.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-pink-100 text-pink-600">{c.type}</span>
                    </div>
                    <p className="text-xs text-slate-400">Started {c.startDate} · Budget {c.budget}</p>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                    <i className="ri-more-2-line text-slate-400 text-sm" />
                  </button>
                </div>
                {c.status !== 'scheduled' && (
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Reach', value: c.reach.toLocaleString(), icon: 'ri-eye-line', color: '#dc2743' },
                      { label: 'Clicks', value: c.clicks.toLocaleString(), icon: 'ri-cursor-line', color: '#e6683c' },
                      { label: 'Leads', value: c.leads.toString(), icon: 'ri-user-star-line', color: '#1E5FBE' },
                      { label: 'Spent', value: c.spend, icon: 'ri-money-dollar-circle-line', color: '#F5A623' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ background: `${s.color}18` }}>
                          <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{s.value}</p>
                        <p className="text-[10px] text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
                {c.status === 'scheduled' && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <i className="ri-time-line text-amber-500 text-sm" />
                    <span className="text-xs text-amber-700">Scheduled to launch on {c.startDate}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI AUTOMATIONS ── */}
      {tab === 'automations' && (
        <div className="space-y-4">
          {/* Hero Banner */}
          <div className="rounded-2xl p-5 text-white" style={{ background: igGradient }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-robot-2-line text-xl" />
              </div>
              <div>
                <h3 className="font-bold">Instagram AI Auto-Reply Engine</h3>
                <p className="text-white/80 text-xs">Handles 71% of DMs automatically — comments, story replies & DMs</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-white/80">Active</span>
                <div className="w-10 h-5 bg-white/30 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Stats */}
          <div className="grid grid-cols-3 gap-3 mb-2">
            {[
              { label: 'DMs Handled', value: '847', sub: 'this month' },
              { label: 'Comment Replies', value: '2,341', sub: 'auto-replied' },
              { label: 'Story Replies', value: '412', sub: 'converted' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs font-semibold text-slate-600">{s.label}</p>
                <p className="text-[10px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                trigger: 'Price DM',
                keywords: ['price', 'cost', 'how much', 'GHS', '💰'],
                response: 'Sends price list, stock status and payment options',
                handled: 312,
                converted: 87,
                borderColor: '#dc2743',
                bg: '#fff0f3',
                icon: 'ri-price-tag-3-line',
              },
              {
                trigger: 'Product Availability',
                keywords: ['available', 'in stock', 'do you have', '👀'],
                response: 'Checks inventory and sends stock status with photos',
                handled: 198,
                converted: 71,
                borderColor: '#e6683c',
                bg: '#fff5f0',
                icon: 'ri-archive-line',
              },
              {
                trigger: 'Comment "PRICE"',
                keywords: ['PRICE', 'LINK', 'INFO', 'DM ME'],
                response: 'Auto-DMs anyone who comments keyword on posts',
                handled: 567,
                converted: 134,
                borderColor: '#cc2366',
                bg: '#fff0f8',
                icon: 'ri-chat-1-line',
              },
              {
                trigger: 'Story Reply',
                keywords: ['story reply', 'interested', '🔥', '😍'],
                response: 'Replies to story reactions with product details',
                handled: 234,
                converted: 89,
                borderColor: '#bc1888',
                bg: '#fdf0ff',
                icon: 'ri-slideshow-line',
              },
              {
                trigger: 'Shipping Inquiry',
                keywords: ['ship', 'deliver', 'Kumasi', 'Takoradi'],
                response: 'Sends delivery zones, fees and estimated times',
                handled: 143,
                converted: 56,
                borderColor: '#f09433',
                bg: '#fffbf0',
                icon: 'ri-truck-line',
              },
              {
                trigger: 'Trade-In DM',
                keywords: ['trade', 'swap', 'sell my', 'exchange'],
                response: 'Sends trade-in value estimate and books appointment',
                handled: 89,
                converted: 41,
                borderColor: '#1E5FBE',
                bg: '#EEF4FF',
                icon: 'ri-exchange-line',
              },
            ].map(rule => (
              <div
                key={rule.trigger}
                className="rounded-2xl border-2 p-4"
                style={{ borderColor: rule.borderColor, background: rule.bg }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                      <i className={`${rule.icon} text-sm`} style={{ color: rule.borderColor }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{rule.trigger}</p>
                      <p className="text-xs text-slate-500">{rule.response}</p>
                    </div>
                  </div>
                  <div className="w-8 h-4 rounded-full relative flex-shrink-0 mt-1" style={{ background: igGradient }}>
                    <span className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {rule.keywords.map(k => (
                    <span key={k} className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-600 border border-slate-200">{k}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span><strong className="text-slate-700">{rule.handled}</strong> handled</span>
                  <span><strong className="text-slate-700">{rule.converted}</strong> converted</span>
                  <span className="font-semibold" style={{ color: rule.borderColor }}>
                    {Math.round((rule.converted / rule.handled) * 100)}% rate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {postModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: igGradient }}>
                  <i className="ri-instagram-line text-white text-sm" />
                </div>
                <h3 className="font-bold text-slate-800">Schedule New Post</h3>
              </div>
              <button onClick={() => setPostModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Post Type</label>
                <div className="flex gap-2">
                  {['Reel', 'Carousel', 'Photo', 'Story'].map(t => (
                    <button key={t} className="flex-1 py-2 rounded-xl border-2 border-slate-100 text-xs font-medium text-slate-600 hover:border-pink-300 cursor-pointer whitespace-nowrap transition-all">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Caption</label>
                <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none resize-none" rows={3} placeholder="Write your caption... #iDealsGhana" maxLength={500} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Schedule Date & Time</label>
                <input type="datetime-local" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Boost Budget (optional)</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" placeholder="e.g. GHS 200" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setPostModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button
                onClick={() => setPostModal(false)}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90"
                style={{ background: igGradient }}
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
