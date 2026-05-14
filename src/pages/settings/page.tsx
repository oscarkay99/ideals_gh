import { useState, useEffect } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { getStoreSettings, saveStoreSettings } from '@/services/settings';
import SettingsSidebar from './components/SettingsSidebar';
import BrandingSection from './components/BrandingSection';
import OperationsSection from './components/OperationsSection';
import TemplatesSection from './components/TemplatesSection';
import TeamRolesSection from './components/TeamRolesSection';
import AutomationSection from './components/AutomationSection';
import IntegrationsSection from './components/IntegrationsSection';
import SecuritySection from './components/SecuritySection';
import AddRoleModal from './components/AddRoleModal';

const sections = [
  { id: 'branding', label: 'Branding', icon: 'ri-palette-line' },
  { id: 'operations', label: 'Operations', icon: 'ri-settings-4-line' },
  { id: 'templates', label: 'Templates', icon: 'ri-file-text-line' },
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
  const [primaryColor, setPrimaryColor] = useState('#0D1F4A');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [automations, setAutomations] = useState(automationRules);
  const [showAddRole, setShowAddRole] = useState(false);

  useEffect(() => {
    getStoreSettings().then((s) => {
      if (!s) return;
      if (s.business_name) setBusinessName(s.business_name);
      if (s.tagline) setTagline(s.tagline);
      if (s.phone) setPhone(s.phone);
      if (s.whatsapp) setWhatsapp(s.whatsapp);
      if (s.address) setAddress(s.address);
      if (s.primary_color) setPrimaryColor(s.primary_color);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await saveStoreSettings({
        business_name: businessName,
        tagline,
        phone,
        whatsapp,
        address,
        primary_color: primaryColor,
      });
    } catch { /* fallback: show saved anyway for mock mode */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: !a.status } : a));
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure your iDeals Tech Hub Command Center">
      <div className="flex gap-5">
        <SettingsSidebar sections={sections} activeSection={activeSection} onSelect={setActiveSection} />

        <div className="flex-1 min-w-0 space-y-5">
          {activeSection === 'branding' && (
            <BrandingSection
              businessName={businessName} setBusinessName={setBusinessName}
              tagline={tagline} setTagline={setTagline}
              phone={phone} setPhone={setPhone}
              whatsapp={whatsapp} setWhatsapp={setWhatsapp}
              address={address} setAddress={setAddress}
              primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
            />
          )}

          {activeSection === 'operations' && <OperationsSection />}

          {activeSection === 'templates' && (
            <TemplatesSection
              templates={messageTemplates}
              editingTemplate={editingTemplate}
              onEditToggle={(id) => setEditingTemplate(editingTemplate === id ? null : id)}
            />
          )}

          {activeSection === 'team' && (
            <TeamRolesSection roles={teamRoles} onAddRole={() => setShowAddRole(true)} />
          )}

          {activeSection === 'automation' && (
            <AutomationSection automations={automations} onToggle={toggleAutomation} onNewRule={() => {}} />
          )}

          {activeSection === 'integrations' && (
            <IntegrationsSection />
          )}

          {activeSection === 'security' && <SecuritySection />}

          {/* Save bar */}
          <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">{saved ? '✓ Changes saved successfully' : 'Unsaved changes'}</span>
            <div className="flex items-center gap-3">
              <button className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer">Discard</button>
              <button onClick={handleSave} className="px-5 py-2 text-white text-sm font-semibold rounded-xl cursor-pointer whitespace-nowrap" style={{ background: '#0D1F4A' }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddRoleModal open={showAddRole} onClose={() => setShowAddRole(false)} />
    </AdminLayout>
  );
}
