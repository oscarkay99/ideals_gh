export const waContacts: never[] = [];

export const waConversations: Record<string, { from: 'customer' | 'agent' | 'ai'; text: string; time: string; aiGenerated?: boolean }[]> = {};

export const waBroadcasts: never[] = [];

export const waStats = {
  totalChats: 0,
  activeChats: 0,
  avgResponseTime: '—',
  aiHandled: '0%',
  conversionRate: '0%',
  todayMessages: 0,
};
