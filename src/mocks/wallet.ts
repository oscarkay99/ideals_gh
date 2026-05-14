export const walletCustomers: never[] = [];

export const walletStats = {
  totalWalletBalance: 0,
  totalCustomers: 0,
  avgBalance: 0,
  totalDepositsThisMonth: 0,
  totalSpentThisMonth: 0,
  activeWallets: 0,
};

export const walletTiers = [
  { name: 'Bronze', minBalance: 0, bonus: '2%', color: 'text-amber-700', bg: 'bg-amber-100' },
  { name: 'Silver', minBalance: 1000, bonus: '5%', color: 'text-slate-600', bg: 'bg-slate-100' },
  { name: 'Gold', minBalance: 3000, bonus: '8%', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { name: 'Platinum', minBalance: 7000, bonus: '12%', color: 'text-violet-600', bg: 'bg-violet-100' },
];
