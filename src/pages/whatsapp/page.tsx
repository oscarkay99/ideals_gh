import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { waContacts, waConversations, waBroadcasts, waStats } from '@/mocks/whatsapp';

type Tab = 'inbox' | 'broadcasts' | 'automations';

const statusColors: Record<string, string> = {
  hot_lead: 'bg-rose-100 text-rose-600',
  trade_in: 'bg-amber-100 text-amber-600',
  inquiry: 'bg-sky-100 text-sky-600',
  repair: 'bg-violet-100 text-violet-600',
  customer: 'bg-emerald-100 text-emerald-600',
};

const statusLabels: Record<string, string> = {
  hot_lead: 'Hot Lead',
  trade_in: 'Trade-In',
  inquiry: 'Inquiry',
  repair: 'Repair',
  customer: 'Customer',
};

export default function WhatsAppPage() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [selectedContact, setSelectedContact] = useState(waContacts[0]);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(waConversations);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = conversations[selectedContact.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact, conversations]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { from: 'agent' as const, text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
    <AdminLayout title="WhatsApp Command Center" subtitle="Live customer conversations, AI auto-replies & broadcast campaigns">
      {/* Stats Strip */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[
          { label: 'Total Chats', value: waStats.totalChats.toLocaleString(), icon: 'ri-chat-3-line', color: 'text-emerald-600' },
          { label: 'Active Now', value: waStats.activeChats.toString(), icon: 'ri-radio-button-line', color: 'text-rose-500' },
          { label: 'Avg Response', value: waStats.avgResponseTime, icon: 'ri-time-line', color: 'text-amber-500' },
          { label: 'AI Handled', value: waStats.aiHandled, icon: 'ri-robot-2-line', color: 'text-violet-500' },
          { label: 'Conversion', value: waStats.conversionRate, icon: 'ri-arrow-up-circle-line', color: 'text-sky-500' },
          { label: 'Today', value: waStats.todayMessages.toString(), icon: 'ri-message-2-line', color: 'text-teal-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`${s.icon} text-sm ${s.color}`} />
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-5">
        {(['inbox', 'broadcasts', 'automations'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t === 'inbox' && <><i className="ri-inbox-line mr-1.5" />Inbox</>}
            {t === 'broadcasts' && <><i className="ri-broadcast-line mr-1.5" />Broadcasts</>}
            {t === 'automations' && <><i className="ri-robot-2-line mr-1.5" />AI Automations</>}
          </button>
        ))}
      </div>

      {tab === 'inbox' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ height: '620px' }}>
          <div className="flex h-full">
            {/* Contact List */}
            <div className="w-[300px] border-r border-slate-100 flex flex-col flex-shrink-0">
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700 outline-none" placeholder="Search chats..." />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {waContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-start gap-3 p-3 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer text-left ${selectedContact.id === contact.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${contact.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                        {contact.avatar}
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
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[contact.status]}`}>
                          {statusLabels[contact.status]}
                        </span>
                        {contact.unread > 0 && (
                          <span className="w-4 h-4 bg-emerald-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
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
                  <div className={`w-9 h-9 rounded-full ${selectedContact.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                    {selectedContact.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{selectedContact.name}</p>
                    <p className="text-xs text-slate-400">{selectedContact.phone} · {selectedContact.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-slate-500">AI Auto-Reply</span>
                    <button
                      onClick={() => setAiEnabled(!aiEnabled)}
                      className={`relative w-8 h-4 rounded-full transition-all cursor-pointer ${aiEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${aiEnabled ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                    <i className="ri-phone-line text-slate-500 text-sm" />
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
                    <div className={`max-w-[70%] ${msg.from === 'customer' ? '' : ''}`}>
                      {msg.from !== 'customer' && (
                        <div className="flex items-center gap-1 mb-1 justify-end">
                          {msg.aiGenerated && (
                            <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-medium">
                              <i className="ri-robot-2-line mr-0.5" />AI
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{msg.from === 'ai' ? 'AI Agent' : 'You'}</span>
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                          msg.from === 'customer'
                            ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
                            : 'text-white rounded-tr-sm'
                        }`}
                        style={msg.from !== 'customer' ? { background: msg.aiGenerated ? '#1E5FBE' : '#154290' } : {}}
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
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full bg-transparent text-sm text-slate-700 outline-none resize-none"
                    />
                  </div>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer">
                    <i className="ri-attachment-2 text-slate-500 text-sm" />
                  </button>
                  <button
                    onClick={sendMessage}
                    className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer hover:opacity-90"
                    style={{ background: '#1E5FBE' }}
                  >
                    <i className="ri-send-plane-fill text-white text-sm" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button className="text-xs cursor-pointer flex items-center gap-1" style={{ color: '#1E5FBE' }}>
                    <i className="ri-sparkling-2-line" />Generate AI Reply
                  </button>
                  <button className="text-xs cursor-pointer flex items-center gap-1" style={{ color: '#F5A623' }}>
                    <i className="ri-file-add-line" />Create Quote
                  </button>
                  <button className="text-xs cursor-pointer flex items-center gap-1" style={{ color: '#154290' }}>
                    <i className="ri-user-star-line" />Convert to Lead
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel — Contact Info */}
            <div className="w-[220px] border-l border-slate-100 p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="text-center">
                <div className={`w-14 h-14 rounded-full ${selectedContact.avatarColor} flex items-center justify-center text-white text-lg font-bold mx-auto mb-2`}>
                  {selectedContact.avatar}
                </div>
                <p className="text-sm font-bold text-slate-800">{selectedContact.name}</p>
                <p className="text-xs text-slate-400">{selectedContact.phone}</p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[selectedContact.status]}`}>
                  {statusLabels[selectedContact.status]}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Quick Actions</p>
                {[
                  { label: 'Create Quote', icon: 'ri-file-add-line', color: 'text-emerald-600' },
                  { label: 'Add to Leads', icon: 'ri-user-star-line', color: 'text-amber-600' },
                  { label: 'View Profile', icon: 'ri-user-line', color: 'text-sky-600' },
                  { label: 'Send Catalog', icon: 'ri-store-2-line', color: 'text-violet-600' },
                  { label: 'Book Repair', icon: 'ri-tools-line', color: 'text-rose-600' },
                ].map(a => (
                  <button key={a.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-left">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${a.icon} text-sm ${a.color}`} />
                    </div>
                    <span className="text-xs text-slate-700">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'broadcasts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Broadcast Campaigns</h3>
            <button
              onClick={() => setBroadcastModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ background: '#1E5FBE' }}
            >
              <i className="ri-add-line" />New Broadcast
            </button>
          </div>
          <div className="space-y-3">
            {waBroadcasts.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{b.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${b.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {b.status === 'completed' ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{b.segment} · {b.date}</p>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                    <i className="ri-more-2-line text-slate-400 text-sm" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 mb-4 leading-relaxed">{b.message}</p>
                {b.status === 'completed' && (
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Sent', value: b.sent, icon: 'ri-send-plane-line', color: 'text-slate-500' },
                      { label: 'Delivered', value: b.delivered, icon: 'ri-check-double-line', color: 'text-sky-500' },
                      { label: 'Read', value: b.read, icon: 'ri-eye-line', color: 'text-emerald-500' },
                      { label: 'Replied', value: b.replied, icon: 'ri-reply-line', color: 'text-violet-500' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className="w-5 h-5 flex items-center justify-center mx-auto mb-1">
                          <i className={`${s.icon} text-sm ${s.color}`} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{s.value}</p>
                        <p className="text-[10px] text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'automations' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-robot-2-line text-xl" />
              </div>
              <div>
                <h3 className="font-bold">AI Auto-Reply Engine</h3>
                <p className="text-violet-200 text-xs">Handles 78% of incoming messages automatically</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-violet-200">Active</span>
                <div className="w-10 h-5 bg-white/30 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                trigger: 'Price Inquiry',
                keywords: ['price', 'cost', 'how much', 'GHS'],
                response: 'Sends product price, stock status, and a reserve link',
                handled: 342,
                converted: 89,
                icon: 'ri-price-tag-3-line',
                color: 'bg-emerald-50 border-emerald-200',
                iconColor: 'text-emerald-600',
              },
              {
                trigger: 'Trade-In Request',
                keywords: ['trade', 'swap', 'exchange', 'sell my'],
                response: 'Sends trade-in value estimate and books appointment',
                handled: 128,
                converted: 54,
                icon: 'ri-exchange-line',
                color: 'bg-amber-50 border-amber-200',
                iconColor: 'text-amber-600',
              },
              {
                trigger: 'Repair Inquiry',
                keywords: ['repair', 'fix', 'broken', 'screen', 'battery'],
                response: 'Sends repair price list and books a slot',
                handled: 97,
                converted: 71,
                icon: 'ri-tools-line',
                color: 'bg-sky-50 border-sky-200',
                iconColor: 'text-sky-600',
              },
              {
                trigger: 'Order Status',
                keywords: ['order', 'delivery', 'where', 'track', 'status'],
                response: 'Fetches order status and sends tracking link',
                handled: 203,
                converted: 203,
                icon: 'ri-truck-line',
                color: 'bg-violet-50 border-violet-200',
                iconColor: 'text-violet-600',
              },
              {
                trigger: 'Availability Check',
                keywords: ['available', 'in stock', 'do you have'],
                response: 'Checks inventory and sends stock status with alternatives',
                handled: 189,
                converted: 67,
                icon: 'ri-archive-line',
                color: 'bg-rose-50 border-rose-200',
                iconColor: 'text-rose-600',
              },
              {
                trigger: 'Installment Plan',
                keywords: ['installment', 'monthly', 'pay later', 'credit'],
                response: 'Sends payment plan options and application link',
                handled: 76,
                converted: 31,
                icon: 'ri-calendar-line',
                color: 'bg-teal-50 border-teal-200',
                iconColor: 'text-teal-600',
              },
            ].map(rule => (
              <div key={rule.trigger} className={`rounded-2xl border p-4 ${rule.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                      <i className={`${rule.icon} text-sm ${rule.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{rule.trigger}</p>
                      <p className="text-xs text-slate-500">{rule.response}</p>
                    </div>
                  </div>
                  <div className="w-8 h-4 bg-emerald-500 rounded-full relative flex-shrink-0 mt-1">
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
                  <span><strong className="text-emerald-600">{Math.round((rule.converted / rule.handled) * 100)}%</strong> rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {broadcastModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">New Broadcast Campaign</h3>
              <button onClick={() => setBroadcastModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Campaign Name</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="e.g. May Flash Sale" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Target Segment</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                  <option>All Customers</option>
                  <option>VIP Customers</option>
                  <option>Warm Leads</option>
                  <option>Repair Customers</option>
                  <option>At-Risk Customers</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Message</label>
                <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none" rows={4} placeholder="Type your broadcast message..." maxLength={500} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Schedule</label>
                <input type="datetime-local" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setBroadcastModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => setBroadcastModal(false)} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#1E5FBE' }}>Schedule Broadcast</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
