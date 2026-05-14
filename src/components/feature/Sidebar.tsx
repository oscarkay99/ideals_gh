import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { roleLabels } from '@/mocks/users';
import { canAccessModule } from '@/utils/access';
import idealsTechHubLogo from '@/assets/ideals-tech-hub-logo.png';
import { navGroups, publicItems } from './navigation';

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
        filter: 'drop-shadow(0 0 8px rgba(245,166,35,0.25)) drop-shadow(0 0 4px rgba(245,166,35,0.2))',
      }}
    />
  );
}

const roleGradients: Record<string, string> = {
  admin: 'linear-gradient(135deg, #07101F, #2463BE)',
  sales_manager: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  sales_rep: 'linear-gradient(135deg, #059669, #34D399)',
  technician: 'linear-gradient(135deg, #D97706, #F59E0B)',
  inventory_manager: 'linear-gradient(135deg, #DC2626, #F87171)',
};

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldArcS" x1="20" y1="90" x2="30" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
      </defs>
      <path d="M32 88 Q5 58 30 22" stroke="url(#goldArcS)" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M88 65 C88 88 74 102 55 102 C36 102 22 88 22 65 C22 42 36 30 55 30 C74 30 88 42 88 65 Z" fill="#0D1F4A" />
      <path d="M38 90 Q55 76 72 86" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="63" cy="16" r="13" fill="#0D1F4A" />
    </svg>
  );
}

interface SidebarProps {
  onWidthChange?: (width: number) => void;
}

export default function Sidebar({ onWidthChange }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    onWidthChange?.(collapsed ? 72 : 260);
  }, [collapsed, onWidthChange]);

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessModule(user?.role, item.module)),
    }))
    .filter((group) => group.items.length > 0);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => { logout(); navigate('/signin'); };

  const avatarGradient = user?.role ? roleGradients[user.role] : roleGradients.admin;

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col z-40 transition-[width] duration-300 select-none`}
      style={{
        width: collapsed ? 72 : 260,
        background: 'linear-gradient(170deg, #07101F 0%, #0D1F4A 55%, #07101F 100%)',
      }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.7), rgba(245,166,35,0.3), transparent)' }} />

      {/* Logo */}
      <div
        className={`flex items-center flex-shrink-0 ${collapsed ? 'justify-center px-3 py-4' : 'px-5 py-4'}`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {collapsed ? <LogoMark size={34} /> : <TransparentLogo width={148} />}
      </div>

      {/* Nav */}
      <nav ref={navRef} className="sidebar-nav flex-1 overflow-y-auto py-3 px-2">
        {visibleGroups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-1' : ''}>
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: 'rgba(245,166,35,0.55)' }}
                >
                  {group.label}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            )}
            {collapsed && gi > 0 && (
              <div className="mx-3 my-2 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer group relative overflow-hidden ${
                      collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
                    }`}
                    style={active ? { background: '#F5A623', boxShadow: '0 4px 16px rgba(245,166,35,0.35)' } : undefined}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = '';
                    }}
                  >
                    {/* Icon */}
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0">
                      <i
                        className={`${item.icon} text-[15px]`}
                        style={{ color: active ? 'white' : 'rgba(255,255,255,0.32)' }}
                      />
                    </div>

                    {/* Label */}
                    {!collapsed && (
                      <span
                        className="text-[13px] font-semibold flex-1 text-left leading-none"
                        style={{ color: active ? 'white' : 'rgba(255,255,255,0.38)' }}
                      >
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Public */}
        <div className="mt-1">
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: 'rgba(245,166,35,0.55)' }}>Public</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          )}
          {collapsed && <div className="mx-3 my-2 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />}
          {publicItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer group relative overflow-hidden ${
                  collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
                }`}
                style={active ? { background: '#F5A623', boxShadow: '0 4px 16px rgba(245,166,35,0.35)' } : undefined}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0">
                  <i className={`${item.icon} text-[15px]`} style={{ color: active ? 'white' : 'rgba(255,255,255,0.32)' }} />
                </div>
                {!collapsed && (
                  <span className="text-[13px] font-semibold flex-1 text-left" style={{ color: active ? 'white' : 'rgba(255,255,255,0.38)' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom — user + actions */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* User card */}
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer mb-2 ${collapsed ? 'justify-center p-2' : 'gap-2.5 p-2.5'}`}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-lg"
              style={{ background: avatarGradient }}
            >
              {user.avatar}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white text-[12px] font-semibold truncate leading-tight">{user.name}</p>
                <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {user.role ? roleLabels[user.role] : ''}
                </p>
              </div>
            )}
            {!collapsed && <i className="ri-arrow-right-s-line text-sm flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />}
          </button>
        )}

        {/* Action row */}
        <div className={`flex ${collapsed ? 'flex-col items-center gap-1' : 'items-center gap-1'}`}>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className={`flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer ${collapsed ? 'w-10 h-9' : 'flex-1 py-2'}`}
            style={{ color: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
              (e.currentTarget as HTMLElement).style.color = '#F87171';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)';
            }}
          >
            <i className="ri-logout-box-line text-sm" />
            {!collapsed && <span className="text-[11px] font-medium">Sign Out</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer ${collapsed ? 'w-10 h-9' : 'flex-1 py-2'}`}
            style={{ color: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)';
            }}
          >
            <i className={`${collapsed ? 'ri-arrow-right-double-line' : 'ri-arrow-left-double-line'} text-sm`} />
            {!collapsed && <span className="text-[11px] font-medium">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
