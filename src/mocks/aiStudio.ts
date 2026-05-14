export const promptTemplates = [
  { id: 't1', category: 'Follow-ups', name: 'Warm Lead Re-engagement', description: "Re-engage a warm lead who hasn't responded in 48 hours", icon: 'ri-message-3-line' },
  { id: 't2', category: 'Follow-ups', name: 'Post-Purchase Thank You', description: 'Send a warm thank you with warranty activation reminder', icon: 'ri-heart-line' },
  { id: 't3', category: 'Follow-ups', name: 'Repair Status Update', description: 'Notify customer of repair progress with ETA', icon: 'ri-tools-line' },
  { id: 't4', category: 'Campaigns', name: 'WhatsApp Promo Blast', description: 'Create a compelling WhatsApp broadcast for a product promo', icon: 'ri-whatsapp-line' },
  { id: 't5', category: 'Campaigns', name: 'Instagram Caption Generator', description: 'Generate engaging captions for product posts', icon: 'ri-instagram-line' },
  { id: 't6', category: 'Campaigns', name: 'Flash Sale Announcement', description: 'Urgent, conversion-focused flash sale message', icon: 'ri-flashlight-line' },
  { id: 't7', category: 'Summaries', name: 'Daily Sales Summary', description: "Summarize today's sales, leads, and key metrics", icon: 'ri-bar-chart-line' },
  { id: 't8', category: 'Summaries', name: 'Customer Conversation Summary', description: 'Summarize a customer chat for CRM notes', icon: 'ri-chat-3-line' },
];

export const recentGenerations: never[] = [];

export const automationIdeas = [
  { title: 'Auto Follow-up Sequence', description: 'Automatically send follow-up messages to leads after 24h, 48h, and 72h of no response', status: 'available' },
  { title: 'Low Stock Alert', description: 'Notify the team on WhatsApp when any product drops below 2 units', status: 'available' },
  { title: 'Payment Reminder', description: 'Send gentle payment reminders to customers with outstanding balances', status: 'available' },
  { title: 'Repair Status Updates', description: 'Auto-notify customers when their repair status changes', status: 'coming_soon' },
  { title: 'Birthday Offers', description: 'Send personalized birthday discount messages to VIP customers', status: 'coming_soon' },
];
