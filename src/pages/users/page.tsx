import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { systemUsers, roleLabels, roleColors, rolePermissions } from '@/mocks/users';
import type { SystemUser } from '@/mocks/users';
import type { UserRole } from '@/hooks/useAuth';

const allPermissions = ['Dashboard', 'Analytics', 'POS', 'Inventory', 'Leads', 'Sales', 'Payments', 'Customers', 'Repairs', 'Warranty', 'WhatsApp', 'Instagram', 'TikTok', 'SMS', 'Marketing', 'Price Intel', 'Trade-In', 'Delivery', 'Wallet', 'Expenses', 'Suppliers', 'Reports', 'Loyalty', 'Calendar', 'Team', 'Settings', 'Authentication', 'AI Studio'];

const statusConfig = {
  active: { label: 'Active', color: '#25D366', bg: '#25D36615' },
  inactive: { label: 'Inactive', color: '#94A3B8', bg: '#F1F5F9' },
  suspended: { label: 'Suspended', color: '#E05A2B', bg: '#E05A2B15' },
};

const emptyUser: Omit<SystemUser, 'id' | 'createdAt' | 'lastLogin'> = {
  name: '',
  email: '',
  role: 'sales_rep',
  avatar: '',
  status: 'active',
  phone: '',
  permissions: rolePermissions.sales_rep,
};

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(systemUsers);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<SystemUser> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const selected = users.find(u => u.id === selectedUser);

  const openAddModal = () => {
    setEditingUser({ ...emptyUser });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (user: SystemUser) => {
    setEditingUser({ ...user });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setEditingUser(prev => prev ? { ...prev, role, permissions: [...rolePermissions[role]] } : prev);
  };

  const togglePermission = (perm: string) => {
    setEditingUser(prev => {
      if (!prev) return prev;
      const perms = prev.permissions || [];
      return {
        ...prev,
        permissions: perms.includes(perm) ? perms.filter(p => p !== perm) : [...perms, perm],
      };
    });
  };

  const handleSave = () => {
    if (!editingUser?.name || !editingUser?.email) return;
    if (isEditing && editingUser.id) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editingUser } as SystemUser : u));
    } else {
      const newUser: SystemUser = {
        ...emptyUser,
        ...editingUser,
        id: `U${String(users.length + 1).padStart(3, '0')}`,
        avatar: (editingUser.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        createdAt: 'Apr 23, 2026',
        lastLogin: 'Never',
      } as SystemUser;
      setUsers(prev => [...prev, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (selectedUser === id) setSelectedUser(null);
    setShowDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <AdminLayout title="User Management" subtitle="Add users · Assign roles · Control access">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {[
          { label: 'Total Users', value: `${users.length}`, color: '#1E5FBE' },
          { label: 'Active', value: `${users.filter(u => u.status === 'active').length}`, color: '#25D366' },
          { label: 'Admins', value: `${users.filter(u => u.role === 'admin').length}`, color: '#1E5FBE' },
          { label: 'Sales Team', value: `${users.filter(u => u.role === 'sales_rep' || u.role === 'sales_manager').length}`, color: '#F5A623' },
          { label: 'Technicians', value: `${users.filter(u => u.role === 'technician').length}`, color: '#E05A2B' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User List */}
        <div className="lg:col-span-2">
          {/* Controls */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1">
              <i className="ri-search-line text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-slate-600 outline-none w-full"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 focus:outline-none"
            >
              <option value="all">All Roles</option>
              {(Object.keys(roleLabels) as UserRole[]).map(r => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap flex items-center gap-2"
              style={{ background: '#1E5FBE' }}
            >
              <i className="ri-user-add-line" /> Add User
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filtered.map(user => {
                const st = statusConfig[user.status];
                const rc = roleColors[user.role];
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-slate-50/50 ${selectedUser === user.id ? 'bg-blue-50/30' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: rc }}>
                      {user.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        {user.role === 'admin' && (
                          <i className="ri-shield-star-line text-xs" style={{ color: '#1E5FBE' }} />
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>

                    {/* Role */}
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white flex-shrink-0" style={{ background: rc }}>
                      {roleLabels[user.role]}
                    </span>

                    {/* Status */}
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0" style={{ color: st.color, background: st.bg }}>
                      {st.label}
                    </span>

                    {/* Last login */}
                    <p className="text-[10px] text-slate-400 flex-shrink-0 hidden lg:block w-32 text-right">{user.lastLogin}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                      >
                        <i className="ri-edit-line text-slate-400 text-sm" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`${user.status === 'active' ? 'ri-pause-circle-line text-amber-400' : 'ri-play-circle-line text-green-500'} text-sm`} />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line text-red-400 text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold" style={{ background: roleColors[selected.role] }}>
                  {selected.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-800">{selected.name}</p>
                  <p className="text-xs text-slate-400">{selected.email}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white mt-1 inline-block" style={{ background: roleColors[selected.role] }}>
                    {roleLabels[selected.role]}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-5 text-xs">
                {[
                  { label: 'Phone', value: selected.phone },
                  { label: 'Status', value: statusConfig[selected.status].label },
                  { label: 'Member Since', value: selected.createdAt },
                  { label: 'Last Login', value: selected.lastLogin },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-700 mb-2">Module Access ({selected.permissions.length}/{allPermissions.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {allPermissions.map(perm => (
                    <span
                      key={perm}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${selected.permissions.includes(perm) ? 'text-white' : 'bg-slate-100 text-slate-400'}`}
                      style={selected.permissions.includes(perm) ? { background: roleColors[selected.role] } : {}}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEditModal(selected)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                  <i className="ri-edit-line mr-1" /> Edit User
                </button>
                <button onClick={() => toggleStatus(selected.id)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 cursor-pointer whitespace-nowrap">
                  {selected.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#1E5FBE15' }}>
                <i className="ri-user-line text-xl" style={{ color: '#1E5FBE' }} />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Select a user</p>
              <p className="text-xs text-slate-400">Click any user to view their profile and permissions</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : prev)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="+233 24 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : prev)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="user@idealstechhub.com"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Temporary Password *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Set a temporary password"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">User will be prompted to change on first login</p>
                </div>
              )}

              {/* Role */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(roleLabels) as UserRole[]).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${editingUser.role === role ? 'border-transparent text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      style={editingUser.role === role ? { background: roleColors[role], borderColor: roleColors[role] } : {}}
                    >
                      <i className="ri-shield-user-line text-sm" />
                      <span className="text-xs font-semibold">{roleLabels[role]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600">Module Permissions</label>
                  <span className="text-[10px] text-slate-400">{(editingUser.permissions || []).length}/{allPermissions.length} selected</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-3 bg-slate-50 rounded-xl max-h-48 overflow-y-auto">
                  {allPermissions.map(perm => {
                    const checked = (editingUser.permissions || []).includes(perm);
                    return (
                      <label key={perm} className="flex items-center gap-1.5 cursor-pointer p-1 rounded-lg hover:bg-white transition-colors">
                        <div
                          onClick={() => togglePermission(perm)}
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer border transition-all ${checked ? 'border-transparent' : 'border-slate-300 bg-white'}`}
                          style={checked ? { background: roleColors[editingUser.role as UserRole] || '#1E5FBE' } : {}}
                        >
                          {checked && <i className="ri-check-line text-white text-[10px]" />}
                        </div>
                        <span className="text-[10px] text-slate-700">{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Status</label>
                <div className="flex gap-2">
                  {(['active', 'inactive'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditingUser(prev => prev ? { ...prev, status: s } : prev)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer capitalize ${editingUser.status === s ? 'text-white' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}
                      style={editingUser.status === s ? { background: s === 'active' ? '#25D366' : '#94A3B8' } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 cursor-pointer whitespace-nowrap">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
                  style={{ background: '#1E5FBE' }}
                >
                  {isEditing ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-50">
              <i className="ri-delete-bin-line text-xl text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete User?</h3>
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone. The user will lose all access immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap bg-red-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}