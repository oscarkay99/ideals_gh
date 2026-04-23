import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationToast from './NotificationToast';
import { useNotifications } from '@/hooks/useNotifications';
import { useDarkMode } from '@/hooks/useDarkMode';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { notifications, toasts, unreadCount, markAllRead, dismissToast } = useNotifications();
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen flex" style={{ background: '#F0F4FA' }}>
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen transition-all duration-300">
        <TopBar
          title={title}
          subtitle={subtitle}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          isDark={isDark}
          onToggleDark={toggle}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
