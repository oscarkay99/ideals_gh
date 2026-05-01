import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/feature/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { roleLabels, roleColors, rolePermissions } from '@/mocks/users';
import type { UserRole } from '@/hooks/useAuth';
import { canAccessModule } from '@/utils/access';
import { isSupabaseConfigured, supabase } from '@/services/supabase';

const allModulePermissions = ['Dashboard', 'Analytics', 'POS', 'Inventory', 'Leads', 'Sales', 'Payments', 'Customers', 'Repairs', 'Warranty', 'WhatsApp', 'Instagram', 'TikTok', 'SMS', 'Marketing', 'Price Intel', 'Trade-In', 'Delivery', 'Wallet', 'Expenses', 'Suppliers', 'Reports', 'Loyalty', 'Calendar', 'Team', 'Settings', 'Authentication', 'AI Studio'];

const activityLog = [
  { id: 1, action: 'Signed in', detail: 'Chrome on Windows · Accra, Ghana', time: 'Today, 9:42 AM', icon: 'ri-login-box-line', color: '#0D1F4A' },
  { id: 2, action: 'Created sale', detail: 'iPhone 15 Pro · GHS 12,500 · Kwame Asante', time: 'Today, 10:15 AM', icon: 'ri-shopping-bag-3-line', color: '#25D366' },
  { id: 3, action: 'Updated inventory', detail: 'Samsung S24 Ultra — restocked 8 units', time: 'Today, 11:00 AM', icon: 'ri-archive-line', color: '#F5A623' },
  { id: 4, action: 'Generated report', detail: 'Monthly Sales Summary · PDF', time: 'Yesterday, 4:30 PM', icon: 'ri-file-chart-line', color: '#07101F' },
  { id: 5, action: 'Added customer', detail: 'Efua Boateng · +233 24 000 0006', time: 'Yesterday, 2:00 PM', icon: 'ri-user-add-line', color: '#E05A2B' },
  { id: 6, action: 'Signed out', detail: 'Session ended', time: 'Yesterday, 7:00 PM', icon: 'ri-logout-box-line', color: '#94A3B8' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('+233 24 000 0001');
  const [email] = useState(user?.email || '');
  const [bio, setBio] = useState('System administrator at iDeals Tech Hub. Managing all operations and team performance.');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const roleColor = user?.role ? roleColors[user.role] : '#0D1F4A';
  const roleLabel = user?.role ? roleLabels[user.role] : 'User';
  const userPermissions = user?.role ? rolePermissions[user.role] : [];
  const quickActions = [
    { label: 'Go to Dashboard', icon: 'ri-dashboard-3-line', path: '/', module: 'Dashboard' as const },
    { label: 'User Management', icon: 'ri-user-settings-line', path: '/users', module: 'Users' as const },
    { label: 'System Settings', icon: 'ri-settings-4-line', path: '/settings', module: 'Settings' as const },
  ].filter((item) => canAccessModule(user?.role, item.module));

  const handleSaveProfile = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!currentPassword) { setPasswordError('Please enter your current password'); return; }
    if (newPassword.length < 10) { setPasswordError('New password must be at least 10 characters'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    setPasswordLoading(true);

    if (isSupabaseConfigured && user?.email) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordLoading(false);
        setPasswordError('Current password is incorrect');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPasswordLoading(false);
        setPasswordError(updateError.message);
        return;
      }
    }

    setPasswordLoading(false);
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  const passwordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { score: 1, label: 'Weak', color: '#E05A2B' },
      { score: 2, label: 'Fair', color: '#F5A623' },
      { score: 3, label: 'Good', color: '#0D1F4A' },
      { score: 4, label: 'Strong', color: '#25D366' },
    ];
    return levels[score - 1] || { score: 0, label: '', color: '' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <AdminLayout title="My Profile" subtitle="Manage your account, security and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — Profile Card */}
        <div className="space-y-4">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto"
                style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}CC)` }}
              >
                {user.avatar}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                <i className="ri-camera-line text-slate-500 text-xs" />
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-800">{user.name}</h3>
            <p className="text-xs text-slate-400 mb-3">{user.email}</p>
            <span className="text-xs px-3 py-1 rounded-full font-semibold text-white" style={{ background: roleColor }}>
              {roleLabel}
            </span>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-slate-800">{userPermissions.length}</p>
                <p className="text-[10px] text-slate-400">Modules Access</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{user.lastLogin}</p>
                <p className="text-[10px] text-slate-400">Last Login</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-700 mb-3">Quick Actions</p>
            <div className="space-y-1">
              {quickActions.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0D1F4A15' }}>
                    <i className={`${item.icon} text-xs`} style={{ color: '#0D1F4A' }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{item.label}</span>
                  <i className="ri-arrow-right-s-line text-slate-300 ml-auto" />
                </button>
              ))}
              <button
                onClick={handleLogout}
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

        {/* Right — Tabs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Bar */}
          <div className="flex border border-slate-200 rounded-xl p-1 bg-white w-fit">
            {[['profile', 'Profile Info'], ['security', 'Security'], ['activity', 'Activity Log']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'profile' | 'security' | 'activity')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === id ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                style={activeTab === id ? { background: '#0D1F4A' } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-800">Personal Information</h3>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                    <i className="ri-edit-line mr-1" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 cursor-pointer whitespace-nowrap">Cancel</button>
                    <button onClick={handleSaveProfile} className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#0D1F4A' }}>Save Changes</button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 mb-4">
                  <i className="ri-check-double-line text-green-500 text-sm" />
                  <p className="text-xs text-green-600 font-medium">Profile updated successfully!</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">Full Name</label>
                    {editMode ? (
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-200" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 py-2.5">{name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">Phone Number</label>
                    {editMode ? (
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-200" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 py-2.5">{phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email Address</label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 py-2.5 flex-1">{email}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">Verified</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Bio</label>
                  {editMode ? (
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-200 resize-none" />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed py-1">{bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Role</label>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-white" style={{ background: roleColor }}>{roleLabel}</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Member Since</label>
                    <p className="text-sm font-semibold text-slate-800">Jan 1, 2026</p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Your Module Access ({userPermissions.length}/{allModulePermissions.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {allModulePermissions.map(perm => (
                    <span
                      key={perm}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${userPermissions.includes(perm) ? 'text-white' : 'bg-slate-100 text-slate-400'}`}
                      style={userPermissions.includes(perm) ? { background: roleColor } : {}}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-5">Change Password</h3>

                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 mb-4">
                    <i className="ri-check-double-line text-green-500 text-sm" />
                    <p className="text-xs text-green-600 font-medium">Password changed successfully!</p>
                  </div>
                )}

                {passwordError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 mb-4">
                    <i className="ri-error-warning-line text-red-500 text-sm" />
                    <p className="text-xs text-red-600">{passwordError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Current Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                        <i className="ri-lock-line text-slate-400 text-sm" />
                      </div>
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-200"
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        <i className={`${showCurrent ? 'ri-eye-off-line' : 'ri-eye-line'} text-slate-400 text-sm`} />
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">New Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                        <i className="ri-lock-password-line text-slate-400 text-sm" />
                      </div>
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-200"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        <i className={`${showNew ? 'ri-eye-off-line' : 'ri-eye-line'} text-slate-400 text-sm`} />
                      </button>
                    </div>
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= strength.score ? strength.color : '#E2E8F0' }} />
                          ))}
                        </div>
                        <p className="text-[10px] font-semibold" style={{ color: strength.color }}>{strength.label}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                        <i className="ri-lock-password-line text-slate-400 text-sm" />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 border ${confirmPassword && confirmPassword !== newPassword ? 'border-red-300' : 'border-slate-200'}`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        <i className={`${showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'} text-slate-400 text-sm`} />
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 font-semibold mb-1">Password Requirements</p>
                    {[
                      { rule: 'At least 10 characters', met: newPassword.length >= 10 },
                      { rule: 'At least one uppercase letter', met: /[A-Z]/.test(newPassword) },
                      { rule: 'At least one number', met: /[0-9]/.test(newPassword) },
                      { rule: 'At least one special character', met: /[^A-Za-z0-9]/.test(newPassword) },
                    ].map(item => (
                      <div key={item.rule} className="flex items-center gap-2 mt-1">
                        <i className={`${item.met ? 'ri-check-line text-green-500' : 'ri-close-line text-slate-300'} text-xs`} />
                        <span className={`text-[10px] ${item.met ? 'text-green-600' : 'text-slate-400'}`}>{item.rule}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #07101F, #0D1F4A)' }}
                  >
                    {passwordLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Accra, Ghana', time: 'Now', current: true, icon: 'ri-computer-line' },
                    { device: 'Safari on iPhone 15', location: 'Accra, Ghana', time: 'Yesterday, 6:15 PM', current: false, icon: 'ri-smartphone-line' },
                    { device: 'Chrome on MacBook', location: 'Kumasi, Ghana', time: 'Apr 20, 2026', current: false, icon: 'ri-macbook-line' },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0D1F4A15' }}>
                        <i className={`${session.icon} text-sm`} style={{ color: '#0D1F4A' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{session.device}</p>
                        <p className="text-[10px] text-slate-400">{session.location} · {session.time}</p>
                      </div>
                      {session.current ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold whitespace-nowrap">Current</span>
                      ) : (
                        <button className="text-[10px] text-red-400 hover:text-red-600 cursor-pointer whitespace-nowrap">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                <span className="text-xs text-slate-400">Last 7 days</span>
              </div>
              <div className="divide-y divide-slate-100">
                {activityLog.map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}15` }}>
                      <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
