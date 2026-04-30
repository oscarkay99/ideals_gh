import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { roleLabels, roleColors } from '@/mocks/users';
import { canAccessModule, type AppModule } from '@/utils/access';
import idealsTechHubLogo from '@/assets/ideals-tech-hub-logo.png';

function TransparentLogo({ width = 150 }: { width?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.src = idealsTechHubLogo;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 235 && g > 235 && b > 235) { data[i + 3] = 0; continue; }
        const max = Math.max(r, g, b);
        const saturation = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
        if (saturation < 0.25) {
          const darkness = 1 - r / 255;
          data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
          data[i + 3] = Math.round(darkness * data[i + 3]);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: 'auto',
        filter: 'drop-shadow(0 0 12px rgba(30,95,190,0.4)) drop-shadow(0 0 6px rgba(245,166,35,0.2))',
      }}
    />
  );
}

const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/', module: 'Dashboard' as AppModule },
      { label: 'Analytics', icon: 'ri-bar-chart-2-line', path: '/analytics', module: 'Analytics' as AppModule },
      { label: 'AI Studio', icon: 'ri-sparkling-2-line', path: '/ai-studio', module: 'AI Studio' as AppModule },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'POS', icon: 'ri-store-3-line', path: '/pos', module: 'POS' as AppModule },
      { label: 'Inventory', icon: 'ri-archive-line', path: '/inventory', module: 'Inventory' as AppModule },
      { label: 'Leads', icon: 'ri-user-star-line', path: '/leads', module: 'Leads' as AppModule },
      { label: 'Sales', icon: 'ri-shopping-bag-3-line', path: '/sales', module: 'Sales' as AppModule },
      { label: 'Payments', icon: 'ri-bank-card-line', path: '/payments', module: 'Payments' as AppModule },
      { label: 'Customers', icon: 'ri-group-line', path: '/customers', module: 'Customers' as AppModule },
      { label: 'Repairs', icon: 'ri-tools-line', path: '/repairs', module: 'Repairs' as AppModule },
      { label: 'Warranty', icon: 'ri-shield-check-line', path: '/warranty', module: 'Warranty' as AppModule },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'WhatsApp', icon: 'ri-whatsapp-line', path: '/whatsapp', module: 'WhatsApp' as AppModule },
      { label: 'Instagram', icon: 'ri-instagram-line', path: '/instagram', module: 'Instagram' as AppModule },
      { label: 'TikTok', icon: 'ri-tiktok-line', path: '/tiktok', module: 'TikTok' as AppModule },
      { label: 'SMS', icon: 'ri-message-3-line', path: '/sms', module: 'SMS' as AppModule },
      { label: 'Price Intel', icon: 'ri-line-chart-line', path: '/price-intel', module: 'Price Intel' as AppModule },
      { label: 'Trade-In', icon: 'ri-exchange-line', path: '/trade-in', module: 'Trade-In' as AppModule },
      { label: 'Delivery', icon: 'ri-truck-line', path: '/delivery', module: 'Delivery' as AppModule },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Wallet', icon: 'ri-wallet-3-line', path: '/wallet', module: 'Wallet' as AppModule },
      { label: 'Expenses', icon: 'ri-calculator-line', path: '/expenses', module: 'Expenses' as AppModule },
      { label: 'Suppliers', icon: 'ri-store-2-line', path: '/suppliers', module: 'Suppliers' as AppModule },
      { label: 'Reports', icon: 'ri-file-chart-line', path: '/reports', module: 'Reports' as AppModule },
      { label: 'Marketing', icon: 'ri-megaphone-line', path: '/marketing', module: 'Marketing' as AppModule },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Loyalty', icon: 'ri-vip-crown-line', path: '/loyalty', module: 'Loyalty' as AppModule },
      { label: 'Calendar', icon: 'ri-calendar-event-line', path: '/calendar', module: 'Calendar' as AppModule },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Authentication', icon: 'ri-shield-check-line', path: '/authentication', module: 'Authentication' as AppModule },
      { label: 'Team', icon: 'ri-team-line', path: '/team', module: 'Team' as AppModule },
      { label: 'Users', icon: 'ri-user-settings-line', path: '/users', module: 'Users' as AppModule },
      { label: 'Settings', icon: 'ri-settings-4-line', path: '/settings', module: 'Settings' as AppModule },
    ],
  },
];

const publicItems = [
  { label: 'Storefront', icon: 'ri-store-2-line', path: '/store' },
];

function IDealsLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldArc" x1="20" y1="90" x2="30" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
      </defs>
      {/* Gold arc swoosh on the left */}
      <path
        d="M32 88 Q5 58 30 22"
        stroke="url(#goldArc)"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blue body — large rounded teardrop */}
      <path
        d="M88 65 C88 88 74 102 55 102 C36 102 22 88 22 65 C22 42 36 30 55 30 C74 30 88 42 88 65 Z"
        fill="#1E5FBE"
      />
      {/* White inner smile cutout */}
      <path
        d="M38 90 Q55 76 72 86"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blue head circle */}
      <circle cx="63" cy="16" r="13" fill="#1E5FBE" />
    </svg>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessModule(user?.role, item.module)),
    }))
    .filter((group) => group.items.length > 0);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      style={{ background: 'linear-gradient(180deg, #0A1F4A 0%, #0F3070 60%, #0A1F4A 100%)' }}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-white/10 ${collapsed ? 'justify-center px-3 py-4' : 'px-5 py-4'}`}>
        {collapsed ? <IDealsLogoMark size={34} /> : <TransparentLogo width={148} />}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="text-white/25 text-[9px] uppercase tracking-widest px-3 pb-1.5 pt-1">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap group ${
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  } ${collapsed ? 'justify-center' : ''}`}
                  style={isActive(item.path) ? { background: 'rgba(30, 95, 190, 0.35)' } : {}}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i
                      className={`${item.icon} text-base`}
                      style={isActive(item.path) ? { color: '#F5A623' } : {}}
                    />
                  </div>
                  {!collapsed && (
                    <span className={`text-sm font-medium ${isActive(item.path) ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {!collapsed && isActive(item.path) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#F5A623' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-2">
          {!collapsed && (
            <p className="text-white/25 text-[9px] uppercase tracking-widest px-3 pb-1.5">Public</p>
          )}
          {publicItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap ${
                isActive(item.path)
                  ? 'text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
              style={isActive(item.path) ? { background: 'rgba(30, 95, 190, 0.35)' } : {}}
              title={collapsed ? item.label : undefined}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i
                  className={`${item.icon} text-base`}
                  style={isActive(item.path) ? { color: '#F5A623' } : {}}
                />
              </div>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {user && !collapsed && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer w-full text-left"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ background: user.role ? roleColors[user.role] : '#1E5FBE' }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-white/40 text-[10px] truncate">{user.role ? roleLabels[user.role] : ''}</p>
            </div>
            <i className="ri-arrow-right-s-line text-white/20 text-sm flex-shrink-0" />
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
          title="Sign Out"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-logout-box-line text-base" />
          </div>
          {!collapsed && <span className="text-xs">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-base`} />
          </div>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
