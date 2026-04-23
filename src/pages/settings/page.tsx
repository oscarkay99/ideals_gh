import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';

const sections = [
  { id: 'branding', label: 'Branding', icon: 'ri-palette-line' },
  { id: 'operations', label: 'Operations', icon: 'ri-settings-4-line' },
  { id: 'templates', label: 'Templates', icon: 'ri-file-text-line' },
  { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
  { id: 'team', label: 'Team & Roles', icon: 'ri-team-line' },
  { id: 'automation', label: 'Automation', icon: 'ri-robot-line' },
  { id: 'integrations', label: 'Integrations', icon: 'ri-plug-line' },
  { id: 'security', label: 'Security', icon: 'ri-shield-keyhole-line' },
];

const messageTemplates = [
  { id: 'mt1', name: 'Quote Ready', channel: 'WhatsApp', message: 'Hi {name}, your quote for {product} is ready! Total: GHS {amount}. Valid until {date}. Reply YES to confirm. — iDeals Tech Hub' },
  { id: 'mt2', name: 'Repair Complete', channel: 'SMS', message: 'Hi {name}, your {device} repair is complete! Total: GHS {amount}. Pick up at iDeals Tech Hub. Open till 7PM today.' },
  { id: 'mt3', name: 'Payment Reminder', channel: 'WhatsApp', message: 'Hi {name}, friendly reminder that your payment of GHS {amount} is due {date}. Pay via MTN Momo: 0244-XXX-XXX. Thank you!' },
  { id: 'mt4', name: 'Delivery Update', channel: 'SMS', message: 'Your order #{order} has been dispatched! Expected delivery: {date}. Track: {link}. iDeals Tech Hub' },
  { id: 'mt5', name: 'Trade-In Valuation', channel: 'WhatsApp', message: 'Hi {name}, your {device} trade-in is valued at GHS {value}. Ready to upgrade? Visit us or reply to confirm. — iDeals Tech Hub' },
  { id: 'mt6', name: 'Birthday Offer', channel: 'SMS', message: 'Happy Birthday {name}! Enjoy 10% OFF any purchase today. Show this SMS at checkout. Valid today only. iDeals Tech Hub' },
  { id: 'mt7', name: 'Warranty Expiry', channel: 'WhatsApp', message: 'Hi {name}, your warranty for {device} expires on {date}. Extend for GHS {price}. Reply EXTEND to proceed. — iDeals Tech Hub' },
  { id: 'mt8', name: 'New Arrival Alert', channel: 'SMS', message: 'NEW ARRIVAL! {product} now in stock at iDeals Tech Hub. Limited units. Call 0244-XXX-XXX or visit us today!' },
];

const teamRoles = [
  { id: 'r1', name: 'Admin', members: 1, permissions: ['All access', 'Settings', 'Financial reports', 'Team management', 'Delete records'] },
  { id: 'r2', name: 'Sales Manager', members: 1, permissions: ['Sales', 'Leads', 'Customers', 'Inventory view', 'Reports view', 'Team view'] },
  { id: 'r3', name: 'Sales Rep', members: 2, permissions: ['Sales', 'Leads', 'Customers', 'Inventory view'] },
  { id: 'r4', name: 'Technician', members: 1, permissions: ['Repairs', 'Inventory view', 'Customers view'] },
  { id: 'r5', name: 'Inventory Manager', members: 1, permissions: ['Inventory', 'Purchase Orders', 'Suppliers', 'Reports view'] },
];

const automationRules = [
  { id: 'ar1', name: 'Lead Follow-up Reminder', trigger: 'Lead not contacted in 48 hours', action: 'Send push notification to assigned rep', status: true, runs: 234 },
  { id: 'ar2', name: 'Low Stock Alert', trigger: 'Product stock drops below threshold', action: 'Notify inventory manager + create restock task', status: true, runs: 89 },
  { id: 'ar3', name: 'Payment Overdue', trigger: 'Payment due date passed by 3 days', action: 'Send WhatsApp reminder to customer', status: true, runs: 45 },
  { id: 'ar4', name: 'Repair Status Update', trigger: 'Repair status changes to Ready', action: 'Send SMS to customer automatically', status: true, runs: 156 },
  { id: 'ar5', name: 'Birthday Greeting', trigger: 'Customer birthday (8:00 AM)', action: 'Send birthday SMS with 10% discount code', status: false, runs: 67 },
  { id: 'ar6', name: 'Warranty Expiry Warning', trigger: '30 days before warranty expires', action: 'Send WhatsApp message with renewal offer', status: true, runs: 34 },
  { id: 'ar7', name: 'New Lead Assignment', trigger: 'New lead created from any channel', action: 'Auto-assign to least-busy sales rep', status: true, runs: 312 },
  { id: 'ar8', name: 'Quote Expiry Reminder', trigger: 'Quote expires in 24 hours', action: 'Send WhatsApp reminder to customer', status: false, runs: 28 },
];

const integrations = [
  { id: 'i1', name: 'WhatsApp Business API', icon: 'ri-whatsapp-line', color: '#25D366', status: 'connected', description: 'Send automated messages and manage DMs', lastSync: '2 min ago' },
  { id: 'i2', name: 'Instagram Graph API', icon: 'ri-instagram-line', color: '#E1306C', status: 'connected', description: 'Manage DMs, comments, and ad campaigns', lastSync: '5 min ago' },
  { id: 'i3', name: 'TikTok for Business', icon: 'ri-tiktok-line', color: '#FE2C55', status: 'connected', description: 'Manage DMs, videos, and ad campaigns', lastSync: '10 min ago' },
  { id: 'i4', name: 'MTN Mobile Money', icon: 'ri-smartphone-line', color: '#FFCC00', status: 'connected', description: 'Accept MoMo payments and auto-reconcile', lastSync: '1 min ago' },
  { id: 'i5', name: 'DHL Express API', icon: 'ri-truck-line', color: '#D40511', status: 'connected', description: 'Auto-create shipments and track deliveries', lastSync: '15 min ago' },
  { id: 'i6', name: 'Google Analytics', icon: 'ri-bar-chart-2-line', color: '#F4B400', status: 'disconnected', description: 'Track storefront traffic and conversions', lastSync: 'Never' },
  { id: 'i7', name: 'Mailchimp', icon: 'ri-mail-line', color: '#FFE01B', status: 'disconnected', description: 'Email marketing campaigns and automation', lastSync: 'Never' },
  { id: 'i8', name: 'QuickBooks', icon: 'ri-book-2-line', color: '#2CA01C', status: 'disconnected', description: 'Sync sales and expenses to accounting', lastSync: 'Never' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('branding');
  const [saved, setSaved] = useState(false);
  const [businessName, setBusinessName] = useState('iDeals Tech Hub');
  const [tagline, setTagline] = useState('Premium Gadgets in Accra');
  const [phone, setPhone] = useState('+233 24 000 0000');
  const [whatsapp, setWhatsapp] = useState('+233 24 000 0000');
  const [address, setAddress] = useState('Accra Mall, Accra, Ghana');
  const [primaryColor, setPrimaryColor] = useState('#1E5FBE');
  const [autoFollowUp, setAutoFollowUp] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [paymentReminder, setPaymentReminder] = useState(false);
  const [repairUpdates, setRepairUpdates] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [automations, setAutomations] = useState(automationRules);
  const [showAddRole, setShowAddRole] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: !a.status } : a));
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure your iDeals Tech Hub Command Center">
      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-2 space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
                  activeSection === s.id ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
                style={activeSection === s.id ? { background: '#1E5FBE' } : {}}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${s.icon} text-sm`} />
                </div>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* BRANDING */}
          {activeSection === 'branding' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-5">Brand Identity</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl border border-slate-100 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A1F4A, #1E5FBE)' }}>
                      <i className="ri-smartphone-line text-2xl text-white" />
                    </div>
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">Change Logo</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Business Name</label>
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Tagline</label>
                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">WhatsApp Number</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Business Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Brand Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer" />
                    <div className="flex gap-2">
                      {['#1E5FBE', '#0A1F4A', '#F5A623', '#E05A2B', '#154290'].map((c) => (
                        <button key={c} onClick={() => setPrimaryColor(c)} className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${primaryColor === c ? 'border-slate-400 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OPERATIONS */}
          {activeSection === 'operations' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-5">Operational Settings</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Default Warranty (New)', type: 'select', options: ['12 Months', '6 Months', '3 Months'], default: '12 Months' },
                    { label: 'Default Warranty (Used)', type: 'select', options: ['3 Months', '6 Months', '1 Month'], default: '3 Months' },
                    { label: 'Quote Validity (Days)', type: 'number', default: 7 },
                    { label: 'Low Stock Threshold', type: 'number', default: 2 },
                    { label: 'Repair Turnaround Target', type: 'select', options: ['Same Day', '24 Hours', '48 Hours', '3 Days'], default: '48 Hours' },
                    { label: 'Default Delivery Fee (GHS)', type: 'number', default: 50 },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-xs font-medium text-slate-600 block mb-1.5">{field.label}</label>
                      {field.type === 'select' ? (
                        <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400">
                          {field.options?.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type="number" defaultValue={field.default as number} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400" />
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Business Hours</label>
                  <div className="space-y-2">
                    {[{ day: 'Mon–Fri', hours: '8:00 AM – 8:00 PM' }, { day: 'Saturday', hours: '9:00 AM – 7:00 PM' }, { day: 'Sunday', hours: '10:00 AM – 6:00 PM' }].map((row) => (
                      <div key={row.day} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-20">{row.day}</span>
                        <input type="text" defaultValue={row.hours} className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Currency & Tax</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Currency</label>
                      <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400">
                        <option>GHS — Ghana Cedi</option>
                        <option>USD — US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">VAT Rate (%)</label>
                      <input type="number" defaultValue={15} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">NHIL Rate (%)</label>
                      <input type="number" defaultValue={2.5} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATES */}
          {activeSection === 'templates' && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Message Templates</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Used for WhatsApp, SMS, and automated messages</p>
                </div>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                  <i className="ri-add-line mr-1" /> New Template
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {messageTemplates.map((t) => (
                  <div key={t.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${t.channel === 'WhatsApp' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {t.channel}
                          </span>
                        </div>
                        {editingTemplate === t.id ? (
                          <textarea
                            defaultValue={t.message}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
                            rows={3}
                          />
                        ) : (
                          <p className="text-xs text-slate-500 leading-relaxed">{t.message}</p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1">Variables: {'{name}'}, {'{product}'}, {'{amount}'}, {'{date}'}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => setEditingTemplate(editingTemplate === t.id ? null : t.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        >
                          <i className={`${editingTemplate === t.id ? 'ri-check-line text-green-500' : 'ri-edit-line text-slate-400'} text-sm`} />
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                          <i className="ri-file-copy-line text-slate-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-5">Notification Preferences</h3>
              <div className="space-y-1">
                {[
                  { label: 'Auto Follow-up Reminders', desc: "Get notified when leads haven't been contacted in 48 hours", value: autoFollowUp, set: setAutoFollowUp },
                  { label: 'Low Stock Alerts', desc: 'Alert when any product drops below threshold', value: lowStockAlert, set: setLowStockAlert },
                  { label: 'Payment Reminders', desc: 'Remind customers with outstanding balances', value: paymentReminder, set: setPaymentReminder },
                  { label: 'Repair Status Updates', desc: 'Notify customers when repair status changes', value: repairUpdates, set: setRepairUpdates },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4 border-b border-slate-50">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button onClick={() => item.set(!item.value)} className={`relative w-11 h-6 rounded-full transition-all cursor-pointer flex-shrink-0 ${item.value ? 'bg-blue-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${item.value ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM & ROLES */}
          {activeSection === 'team' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Roles & Permissions</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Control what each role can access</p>
                  </div>
                  <button onClick={() => setShowAddRole(true)} className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                    <i className="ri-add-line mr-1" /> Add Role
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {teamRoles.map((role) => (
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
                    { name: 'Kwame Asante', email: 'kwame@idealstechhub.com', role: 'Admin', avatar: 'KA', status: 'active' },
                    { name: 'Kofi Mensah', email: 'kofi@idealstechhub.com', role: 'Sales Manager', avatar: 'KM', status: 'active' },
                    { name: 'Abena Frimpong', email: 'abena@idealstechhub.com', role: 'Sales Rep', avatar: 'AF', status: 'active' },
                    { name: 'Yaw Darko', email: 'yaw@idealstechhub.com', role: 'Sales Rep', avatar: 'YD', status: 'active' },
                    { name: 'Ama Owusu', email: 'ama@idealstechhub.com', role: 'Technician', avatar: 'AO', status: 'active' },
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
                <button className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                  <i className="ri-user-add-line mr-1" /> Invite Team Member
                </button>
              </div>
            </div>
          )}

          {/* AUTOMATION */}
          {activeSection === 'automation' && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Automation Rules</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{automations.filter(a => a.status).length} of {automations.length} rules active</p>
                </div>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                  <i className="ri-add-line mr-1" /> New Rule
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {automations.map((rule) => (
                  <div key={rule.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: rule.status ? '#1E5FBE15' : '#F1F5F9' }}>
                      <i className="ri-robot-2-line text-sm" style={{ color: rule.status ? '#1E5FBE' : '#94A3B8' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800">{rule.name}</p>
                        <span className="text-[10px] text-slate-400">{rule.runs} runs</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-0.5"><span className="font-medium text-slate-600">Trigger:</span> {rule.trigger}</p>
                      <p className="text-xs text-slate-500"><span className="font-medium text-slate-600">Action:</span> {rule.action}</p>
                    </div>
                    <button onClick={() => toggleAutomation(rule.id)} className={`relative w-11 h-6 rounded-full transition-all cursor-pointer flex-shrink-0 ${rule.status ? 'bg-blue-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${rule.status ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${integration.color}15` }}>
                    <i className={`${integration.icon} text-lg`} style={{ color: integration.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-800">{integration.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${integration.status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{integration.description}</p>
                    {integration.status === 'connected' && (
                      <p className="text-[10px] text-slate-400">Last sync: {integration.lastSync}</p>
                    )}
                  </div>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 ${integration.status === 'connected' ? 'border border-slate-200 text-slate-500 hover:bg-slate-50' : 'text-white'}`}
                    style={integration.status !== 'connected' ? { background: '#1E5FBE' } : {}}>
                    {integration.status === 'connected' ? 'Manage' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins', enabled: true },
                    { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                    { label: 'Login Notifications', desc: 'Email alert on new device login', enabled: false },
                    { label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses', enabled: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`relative w-11 h-6 rounded-full transition-all cursor-pointer flex-shrink-0 ${item.enabled ? 'bg-blue-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${item.enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Login Activity</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Accra, Ghana', time: 'Today, 9:42 AM', current: true },
                    { device: 'Safari on iPhone', location: 'Accra, Ghana', time: 'Yesterday, 6:15 PM', current: false },
                    { device: 'Chrome on MacBook', location: 'Kumasi, Ghana', time: 'Apr 20, 2026', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1E5FBE15' }}>
                        <i className="ri-computer-line text-sm" style={{ color: '#1E5FBE' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">{session.device}</p>
                        <p className="text-[10px] text-slate-400">{session.location} · {session.time}</p>
                      </div>
                      {session.current ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">Current</span>
                      ) : (
                        <button className="text-[10px] text-red-400 hover:text-red-600 cursor-pointer">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">{saved ? '✓ Changes saved successfully' : 'Unsaved changes'}</span>
            <div className="flex items-center gap-3">
              <button className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer">Discard</button>
              <button onClick={handleSave} className="px-5 py-2 text-white text-sm font-semibold rounded-xl cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Create New Role</h3>
              <button onClick={() => setShowAddRole(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Role Name</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. Store Manager" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Dashboard', 'Sales', 'Inventory', 'Customers', 'Repairs', 'Payments', 'Analytics', 'Settings', 'Team', 'Reports'].map((perm) => (
                    <label key={perm} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-xs text-slate-700">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowAddRole(false)} className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap" style={{ background: '#1E5FBE' }}>
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}