import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { igContacts, igConversations, igPosts, igCampaigns } from '@/mocks/instagram';
import IgStatsStrip from './components/IgStatsStrip';
import IgInbox from './components/IgInbox';
import IgPosts from './components/IgPosts';
import IgCampaigns from './components/IgCampaigns';
import IgAutomations from './components/IgAutomations';
import SchedulePostModal from './components/SchedulePostModal';

type Tab = 'inbox' | 'posts' | 'campaigns' | 'automations';

export default function InstagramPage() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [selectedContact, setSelectedContact] = useState(igContacts[0]);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(igConversations);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [postModal, setPostModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      <IgStatsStrip />

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

      {tab === 'inbox' && (
        <IgInbox
          contacts={igContacts}
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

      {tab === 'posts' && (
        <IgPosts posts={igPosts} onNewPost={() => setPostModal(true)} />
      )}

      {tab === 'campaigns' && (
        <IgCampaigns campaigns={igCampaigns} />
      )}

      {tab === 'automations' && (
        <IgAutomations />
      )}

      <SchedulePostModal open={postModal} onClose={() => setPostModal(false)} />
    </AdminLayout>
  );
}
