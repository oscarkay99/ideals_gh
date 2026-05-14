import { tiktokChats } from '@/mocks/tiktok';

type TikTokChat = typeof tiktokChats[number];

interface TikTokDMInboxProps {
  chats: TikTokChat[];
  selectedChat: TikTokChat | null;
  onSelectChat: (chat: TikTokChat) => void;
  chatInput: string;
  onChatInputChange: (val: string) => void;
}

export default function TikTokDMInbox({
  chats,
  selectedChat,
  onSelectChat,
  chatInput,
  onChatInputChange,
}: TikTokDMInboxProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[500px]">
      {/* Chat List */}
      <div className="lg:border-r border-slate-100 lg:pr-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}>
            <i className="ri-tiktok-fill text-white text-sm" />
          </div>
          <span className="text-sm font-bold text-slate-800">Direct Messages</span>
          <span className="ml-auto text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-semibold">
            {chats.reduce((s, c) => s + c.unread, 0)} new
          </span>
        </div>
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                selectedChat?.id === chat.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img loading="lazy" decoding="async" src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
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
              <img loading="lazy" decoding="async" src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
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
                  onChange={(e) => onChatInputChange(e.target.value)}
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
  );
}
