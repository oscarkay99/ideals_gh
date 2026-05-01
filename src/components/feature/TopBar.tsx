import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { roleLabels } from '@/mocks/users';

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
  sale: { icon: 'ri-shopping-bag-3-line', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  lead: { icon: 'ri-user-star-line', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  payment: { icon: 'ri-bank-card-line', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  repair: { icon: 'ri-tools-line', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  alert: { icon: 'ri-alert-line', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const roleGradients: Record<string, string> = {
  admin: 'linear-gradient(135deg, #07101F, #2463BE)',
  sales_manager: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  sales_rep: 'linear-gradient(135deg, #059669, #34D399)',
  technician: 'linear-gradient(135deg, #D97706, #F59E0B)',
  inventory_manager: 'linear-gradient(135deg, #DC2626, #F87171)',
};

export default function TopBar({
  title, subtitle, notifications = [], unreadCount = 0, onMarkAllRead, isDark, onToggleDark,
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const avatarGradient = user?.role ? roleGradients[user.role] : roleGradients.admin;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-30"
      style={{
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--topbar-border)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.03), 0 4px 24px rgba(7,16,31,0.05)',
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-ink)' }}>{title}</h1>
        {subtitle && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-ink-40)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 rounded-2xl px-3.5 py-2 w-60 transition-all duration-200"
          style={{
            background: 'var(--surface-raised, rgba(7,16,31,0.06))',
            border: '1px solid var(--topbar-border)',
          }}
          onFocus={() => {}}
        >
          <i className="ri-search-line text-sm flex-shrink-0" style={{ color: 'rgba(7,16,31,0.45)' }} />
          <input
            type="text"
            placeholder="Search anything…"
            className="bg-transparent text-[13px] outline-none flex-1 min-w-0"
            style={{ color: '#07101F' }}
          />
          <div
            className="hidden md:flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{ background: 'rgba(7,16,31,0.07)', color: 'rgba(7,16,31,0.45)' }}
          >
            <i className="ri-command-line text-[9px]" />K
          </div>
        </div>

        {/* Dark Mode */}
        {onToggleDark && (
          <button
            onClick={onToggleDark}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer"
            style={{ background: 'rgba(7,16,31,0.06)', color: 'rgba(7,16,31,0.5)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(7,16,31,0.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(7,16,31,0.06)'; }}
          >
            <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-[15px]`} />
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer"
            style={{ background: 'rgba(7,16,31,0.06)', color: 'rgba(7,16,31,0.5)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(7,16,31,0.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(7,16,31,0.06)'; }}
          >
            <i className="ri-notification-3-line text-[15px]" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full text-white text-[9px] flex items-center justify-center px-1 font-bold"
                style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {unreadCount === 0 && (
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: '#F5A623' }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-12 w-[340px] rounded-2xl overflow-hidden z-50"
              style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--topbar-border)',
                boxShadow: '0 8px 40px rgba(7,16,31,0.12)',
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(7,16,31,0.07)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold" style={{ color: 'var(--text-ink)' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] font-semibold cursor-pointer transition-opacity hover:opacity-70"
                  style={{ color: '#0D1F4A' }}
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {displayNotifs.map((n) => {
                  const cfg = typeConfig[n.type];
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                      style={{
                        borderBottom: '1px solid rgba(7,16,31,0.04)',
                        background: !n.read ? 'rgba(245,166,35,0.04)' : 'transparent',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(7,16,31,0.04)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = !n.read ? 'rgba(245,166,35,0.04)' : 'transparent'; }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <i className={`${cfg.icon} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold leading-tight" style={{ color: '#07101F' }}>{n.title}</p>
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(10,31,74,0.5)' }}>{n.message}</p>
                        <p className="text-[10px] mt-1" style={{ color: 'rgba(10,31,74,0.35)' }}>{formatTime(n.time)}</p>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#F5A623' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className="px-4 py-2.5"
                style={{ borderTop: '1px solid rgba(7,16,31,0.07)' }}
              >
                <button
                  onClick={() => { setNotifOpen(false); navigate('/'); }}
                  className="text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(10,31,74,0.45)' }}
                >
                  View all activity →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'rgba(7,16,31,0.1)' }} />

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-80 rounded-2xl px-2 py-1.5"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(7,16,31,0.05)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{
              background: avatarGradient,
              boxShadow: '0 2px 8px rgba(10,31,74,0.2)',
            }}
          >
            {user?.avatar ?? 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text-ink)' }}>{user?.name ?? 'User'}</p>
            <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--text-ink-40)' }}>
              {user?.role ? roleLabels[user.role] : ''}
            </p>
          </div>
          <i className="ri-arrow-down-s-line text-sm hidden md:block" style={{ color: 'var(--text-ink-30)' }} />
        </button>
      </div>
    </header>
  );
}
