export const marketingStats = [
  { label: 'Total Reach', value: '18,420', change: '+22%', trend: 'up', icon: 'ri-eye-line', accent: 'bg-blue-500' },
  { label: 'Leads Generated', value: '312', change: '+18%', trend: 'up', icon: 'ri-user-star-line', accent: 'bg-emerald-500' },
  { label: 'Conversions', value: '87', change: '+9%', trend: 'up', icon: 'ri-shopping-bag-3-line', accent: 'bg-amber-500' },
  { label: 'Campaign ROI', value: '4.2x', change: '+0.6x', trend: 'up', icon: 'ri-line-chart-line', accent: 'bg-violet-500' },
];

export const campaigns = [
  {
    id: 'c1',
    name: 'iPhone 15 Flash Sale',
    channels: ['whatsapp', 'instagram'],
    status: 'active',
    reach: 4200,
    leads: 68,
    conversions: 22,
    budget: 'GHS 800',
    spent: 'GHS 620',
    startDate: 'Apr 18',
    endDate: 'Apr 25',
    roi: '5.1x',
  },
  {
    id: 'c2',
    name: 'MacBook Air M2 Promo',
    channels: ['instagram', 'sms'],
    status: 'active',
    reach: 3100,
    leads: 44,
    conversions: 14,
    budget: 'GHS 600',
    spent: 'GHS 480',
    startDate: 'Apr 20',
    endDate: 'Apr 28',
    roi: '4.8x',
  },
  {
    id: 'c3',
    name: 'Refurbished Phones Drive',
    channels: ['whatsapp', 'sms'],
    status: 'completed',
    reach: 5800,
    leads: 92,
    conversions: 31,
    budget: 'GHS 500',
    spent: 'GHS 500',
    startDate: 'Apr 5',
    endDate: 'Apr 15',
    roi: '6.2x',
  },
  {
    id: 'c4',
    name: 'Accessories Bundle Offer',
    channels: ['instagram'],
    status: 'draft',
    reach: 0,
    leads: 0,
    conversions: 0,
    budget: 'GHS 400',
    spent: 'GHS 0',
    startDate: 'Apr 27',
    endDate: 'May 5',
    roi: '—',
  },
  {
    id: 'c5',
    name: 'Repair Service Awareness',
    channels: ['whatsapp', 'instagram', 'sms'],
    status: 'paused',
    reach: 2100,
    leads: 38,
    conversions: 12,
    budget: 'GHS 350',
    spent: 'GHS 210',
    startDate: 'Apr 10',
    endDate: 'Apr 30',
    roi: '3.4x',
  },
];

export const leadSources = [
  { source: 'WhatsApp', leads: 142, pct: 46, color: '#25D366' },
  { source: 'Instagram', leads: 89, pct: 29, color: '#E1306C' },
  { source: 'Walk-in', leads: 48, pct: 15, color: '#059669' },
  { source: 'SMS', leads: 21, pct: 7, color: '#D97706' },
  { source: 'Referral', leads: 12, pct: 4, color: '#6366F1' },
];

export const conversionFunnel = [
  { stage: 'Reached', value: 18420, pct: 100 },
  { stage: 'Engaged', value: 4210, pct: 23 },
  { stage: 'Leads', value: 312, pct: 7.4 },
  { stage: 'Quoted', value: 148, pct: 3.5 },
  { stage: 'Converted', value: 87, pct: 2.1 },
];

export const weeklyPerformance = [
  { week: 'Mar W3', reach: 3200, leads: 48, conversions: 14 },
  { week: 'Mar W4', reach: 4100, leads: 62, conversions: 18 },
  { week: 'Apr W1', reach: 3800, leads: 55, conversions: 16 },
  { week: 'Apr W2', reach: 5200, leads: 78, conversions: 24 },
  { week: 'Apr W3', reach: 6400, leads: 94, conversions: 28 },
  { week: 'Apr W4', reach: 7100, leads: 108, conversions: 31 },
];

export const calendarEvents = [
  { day: 18, label: 'iPhone Flash Sale', color: 'bg-emerald-500', channel: 'whatsapp' },
  { day: 20, label: 'MacBook Promo', color: 'bg-pink-500', channel: 'instagram' },
  { day: 23, label: 'Story Post', color: 'bg-pink-400', channel: 'instagram' },
  { day: 25, label: 'Flash Sale Ends', color: 'bg-amber-500', channel: 'whatsapp' },
  { day: 27, label: 'Accessories Bundle', color: 'bg-slate-400', channel: 'instagram' },
  { day: 28, label: 'MacBook Promo Ends', color: 'bg-pink-500', channel: 'instagram' },
  { day: 30, label: 'Monthly Broadcast', color: 'bg-emerald-500', channel: 'whatsapp' },
];

export const topCreatives = [
  {
    id: 'cr1',
    title: 'iPhone 15 Pro Max — Titanium',
    channel: 'instagram',
    impressions: '4,200',
    clicks: '312',
    ctr: '7.4%',
    image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20Max%20titanium%20premium%20product%20advertisement%20creative%20with%20dark%20elegant%20background%20and%20bold%20typography%2C%20marketing%20visual&width=300&height=300&seq=cr1&orientation=squarish',
  },
  {
    id: 'cr2',
    title: 'MacBook Air M2 — Flash Deal',
    channel: 'whatsapp',
    impressions: '3,100',
    clicks: '228',
    ctr: '7.4%',
    image: 'https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%20premium%20product%20advertisement%20creative%20with%20clean%20white%20background%20and%20bold%20sale%20typography%2C%20marketing%20visual&width=300&height=300&seq=cr2&orientation=squarish',
  },
  {
    id: 'cr3',
    title: 'Refurbished Phones — Trust',
    channel: 'sms',
    impressions: '5,800',
    clicks: '348',
    ctr: '6.0%',
    image: 'https://readdy.ai/api/search-image?query=refurbished%20smartphones%20collection%20premium%20advertisement%20creative%20with%20clean%20background%20and%20trust%20badge%2C%20marketing%20visual&width=300&height=300&seq=cr3&orientation=squarish',
  },
];
