export type LeadStatus = 'hot' | 'warm' | 'cold';
export type LeadSource = 'WhatsApp' | 'Instagram' | 'TikTok' | 'SMS' | 'Walk-in' | 'Referral' | 'Website';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  product: string;
  budget: string;
  lastContact: string;
  assigned: string;
  notes: string;
  followUp: string;
  quoteReady: boolean;
}

export interface LeadStat {
  label: string;
  value: string;
  change: string;
  icon: string;
  accent: string;
}
