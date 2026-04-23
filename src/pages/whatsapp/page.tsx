import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { waContacts, waConversations, waBroadcasts, waStats } from '@/mocks/whatsapp';
import WaStatsStrip from './components/WaStatsStrip';
import WaInbox from './components/WaInbox';
import WaBroadcasts from './components/WaBroadcasts';
import WaAutomations from './components/WaAutomations';
import NewBroadcastModal from './components/NewBroadcastModal';

type Tab = 'inbox' | 'broadcasts' | 'automations';

export default function WhatsAppPage() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [selectedContact, setSelectedContact] = useState(waContacts[0]);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(waConversations);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      <WaStatsStrip stats={waStats} />

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
        <WaInbox
          contacts={waContacts}
          conversations={conversations}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          message={message}
          onMessageChange={setMessage}
          onSendMessage={sendMessage}
          onKeyDown={handleKeyDown}
          aiEnabled={aiEnabled}
          onToggleAi={() => setAiEnabled(!aiEnabled)}
          messagesEndRef={messagesEndRef}
        />
      )}

      {tab === 'broadcasts' && (
        <WaBroadcasts broadcasts={waBroadcasts} onNewBroadcast={() => setBroadcastModal(true)} />
      )}

      {tab === 'automations' && (
        <WaAutomations />
      )}

      <NewBroadcastModal open={broadcastModal} onClose={() => setBroadcastModal(false)} />
    </AdminLayout>
  );
}
