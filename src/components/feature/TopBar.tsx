import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/hooks/useNotifications';

interface TopBarProps {
  title: string;
  subtitle?: string;
  notifications?: Notification[];
  unreadCount?: number;
  onMarkAllRead?: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
}

const typeConfig = {
  sale: { icon: 'ri-shopping-bag-3-line', color: 'text-emerald-500' },
  lead: { icon: 'ri-user-star-line', color: 'text-amber-500' },
  payment: { icon: 'ri-bank-card-line', color: 'text-sky-500' },
  repair: { icon: 'ri-tools-line', color: 'text-violet-500' },
  alert: { icon: 'ri-alert-line', color: 'text-rose-500' },
};

export default function TopBar({ title, subtitle, notifications = [], unreadCount = 0, onMarkAllRead, isDark, onToggleDark }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const displayNotifs = notifications.length > 0 ? notifications.slice(0, 8) : [
    { id: 'default-1', type: 'alert' as const, title: 'Low Stock', message: 'Samsung Galaxy S24 — only 1 unit left', time: new Date(), read: false },
    { id: 'default-2', type: 'payment' as const, title: 'Payment Pending', message: 'GHS 4,200 payment pending verification', time: new Date(), read: false },
    { id: 'default-3', type: 'lead' as const, title: 'Leads Waiting', message: '5 leads uncontacted for 48+ hours', time: new Date(), read: true },
  ];

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30" style={{ borderBottomColor: '#E8EEF8' }}>
      <div>
        <h1 className="text-[15px] font-semibold text-slate-800 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56">
          <div className="w-4 h-4 flex items-center justify-center text-slate-400">
            <i className="ri-search-line text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
          />
        </div>

        {/* Dark Mode Toggle */}
        {onToggleDark && (
          <button
            onClick={onToggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-base`} />
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <i className="ri-notification-3-line text-base" />
            {(unreadCount > 0 || notifications.length === 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#F5A623' }} />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 rounded-full text-white text-[9px] flex items-center justify-center px-0.5 font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">{unreadCount} new</span>
                  )}
                </div>
                <button onClick={onMarkAllRead} className="text-xs cursor-pointer" style={{ color: '#1E5FBE' }}>Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {displayNotifs.map((n) => {
                  const cfg = typeConfig[n.type];
                  return (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${!n.read ? 'bg-emerald-50/30' : ''}`}>
                      <div className={`w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 ${cfg.color}`}>
                        <i className={`${cfg.icon} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(n.time)}</p>
                      </div>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#F5A623' }} />}
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-2 border-t border-slate-100">
                <button onClick={() => { setNotifOpen(false); navigate('/'); }} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer">View all activity</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1E5FBE' }}>
            KA
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-700 leading-tight">Kwame Asante</p>
            <p className="text-[10px] text-slate-400">Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
