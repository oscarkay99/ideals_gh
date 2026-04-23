interface ProfileHeaderProps {
  avatar: string;
  name: string;
  email: string;
  roleLabel: string;
  roleColor: string;
  userPermissionsCount: number;
  allPermissionsCount: number;
  lastLogin: string;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export default function ProfileHeader({
  avatar,
  name,
  email,
  roleLabel,
  roleColor,
  userPermissionsCount,
  allPermissionsCount,
  lastLogin,
  onLogout,
  onNavigate,
}: ProfileHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
        <div className="relative inline-block mb-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto"
            style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}CC)` }}
          >
            {avatar}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
            <i className="ri-camera-line text-slate-500 text-xs" />
          </button>
        </div>
        <h3 className="text-base font-bold text-slate-800">{name}</h3>
        <p className="text-xs text-slate-400 mb-3">{email}</p>
        <span className="text-xs px-3 py-1 rounded-full font-semibold text-white" style={{ background: roleColor }}>
          {roleLabel}
        </span>
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-slate-800">{userPermissionsCount}</p>
            <p className="text-[10px] text-slate-400">Modules Access</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{lastLogin}</p>
            <p className="text-[10px] text-slate-400">Last Login</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">Quick Actions</p>
        <div className="space-y-1">
          {[
            { label: 'Go to Dashboard', icon: 'ri-dashboard-3-line', path: '/' },
            { label: 'User Management', icon: 'ri-user-settings-line', path: '/users' },
            { label: 'System Settings', icon: 'ri-settings-4-line', path: '/settings' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1E5FBE15' }}>
                <i className={`${item.icon} text-xs`} style={{ color: '#1E5FBE' }} />
              </div>
              <span className="text-xs font-medium text-slate-700">{item.label}</span>
              <i className="ri-arrow-right-s-line text-slate-300 ml-auto" />
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50">
              <i className="ri-logout-box-line text-xs text-red-400" />
            </div>
            <span className="text-xs font-medium text-red-500">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
