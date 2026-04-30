import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { systemUsers, rolePermissions } from '@/mocks/users';
import type { SystemUser } from '@/mocks/users';
import type { UserRole } from '@/hooks/useAuth';
import UserStatsStrip from './components/UserStatsStrip';
import UserTable from './components/UserTable';
import UserDetailPanel from './components/UserDetailPanel';
import UserFormModal from './components/UserFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

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

  const handleFieldChange = (field: keyof SystemUser, value: string) => {
    setEditingUser(prev => prev ? { ...prev, [field]: value } : prev);
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

  const handleSelect = (id: string) => {
    setSelectedUser(selectedUser === id ? null : id);
  };

  return (
    <AdminLayout title="User Management" subtitle="Add users · Assign roles · Control access">
      <UserStatsStrip users={users} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <UserTable
          filtered={filtered}
          selectedUser={selectedUser}
          onSelect={handleSelect}
          onEdit={openEditModal}
          onDelete={(id) => setShowDeleteConfirm(id)}
          onToggleStatus={toggleStatus}
          search={search}
          onSearch={setSearch}
          filterRole={filterRole}
          onFilterRole={setFilterRole}
          onAddUser={openAddModal}
        />

        <UserDetailPanel
          user={selected}
          onEdit={openEditModal}
          onToggleStatus={toggleStatus}
        />
      </div>

      <UserFormModal
        open={showModal}
        isEditing={isEditing}
        editingUser={editingUser}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onRoleChange={handleRoleChange}
        onTogglePermission={togglePermission}
        onFieldChange={handleFieldChange}
      />

      <DeleteConfirmModal
        userId={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(null)}
      />
    </AdminLayout>
  );
}
