interface TeamRole {
  id: string;
  name: string;
  members: number;
  permissions: string[];
}

interface TeamRolesSectionProps {
  roles: TeamRole[];
  onAddRole: () => void;
}

export default function TeamRolesSection({ roles, onAddRole }: TeamRolesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Roles & Permissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control what each role can access</p>
          </div>
          <button onClick={onAddRole} className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
            <i className="ri-add-line mr-1" /> Add Role
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {roles.map((role) => (
            <div key={role.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#1E5FBE15' }}>
                <i className="ri-shield-user-line text-sm" style={{ color: '#1E5FBE' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-800">{role.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{role.members} member{role.members !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm) => (
                    <span key={perm} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{perm}</span>
                  ))}
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer flex-shrink-0">
                <i className="ri-edit-line text-slate-400 text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Team Members</h3>
        <div className="space-y-3">
          {[
            { name: 'Kwame Asante', email: 'kwame@idealstechhub.com', role: 'Admin', avatar: 'KA' },
            { name: 'Kofi Mensah', email: 'kofi@idealstechhub.com', role: 'Sales Manager', avatar: 'KM' },
            { name: 'Abena Frimpong', email: 'abena@idealstechhub.com', role: 'Sales Rep', avatar: 'AF' },
            { name: 'Yaw Darko', email: 'yaw@idealstechhub.com', role: 'Sales Rep', avatar: 'YD' },
            { name: 'Ama Owusu', email: 'ama@idealstechhub.com', role: 'Technician', avatar: 'AO' },
          ].map((member) => (
            <div key={member.email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1E5FBE' }}>
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                <p className="text-xs text-slate-400">{member.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{member.role}</span>
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            </div>
          ))}
        </div>
        <button onClick={onAddRole} className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
          <i className="ri-user-add-line mr-1" /> Invite Team Member
        </button>
      </div>
    </div>
  );
}
