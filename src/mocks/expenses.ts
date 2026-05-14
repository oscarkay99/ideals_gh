export const expenseCategories = [
  { id: 'rent', name: 'Rent & Utilities', budget: 0, spent: 0, color: '#0D1F4A' },
  { id: 'salaries', name: 'Staff Salaries', budget: 0, spent: 0, color: '#07101F' },
  { id: 'stock', name: 'Stock Purchases', budget: 0, spent: 0, color: '#F5A623' },
  { id: 'marketing', name: 'Marketing & Ads', budget: 0, spent: 0, color: '#E05A2B' },
  { id: 'repairs', name: 'Repair Parts', budget: 0, spent: 0, color: '#1552A8' },
  { id: 'delivery', name: 'Delivery & Logistics', budget: 0, spent: 0, color: '#0E3D8A' },
  { id: 'utilities', name: 'Internet & Phone', budget: 0, spent: 0, color: '#2D7DD2' },
  { id: 'misc', name: 'Miscellaneous', budget: 0, spent: 0, color: '#8B9DC3' },
];

export const monthlyExpenses = [
  { month: 'Jan', revenue: 0, expenses: 0, profit: 0 },
  { month: 'Feb', revenue: 0, expenses: 0, profit: 0 },
  { month: 'Mar', revenue: 0, expenses: 0, profit: 0 },
  { month: 'Apr', revenue: 0, expenses: 0, profit: 0 },
  { month: 'May', revenue: 0, expenses: 0, profit: 0 },
  { month: 'Jun', revenue: 0, expenses: 0, profit: 0 },
];

export const recentTransactions: never[] = [];

export const expenseStats = {
  totalRevenue: 0,
  totalExpenses: 0,
  grossProfit: 0,
  profitMargin: 0,
  ytdRevenue: 0,
  ytdExpenses: 0,
  ytdProfit: 0,
  outstandingPayments: 0,
  pendingInvoices: 0,
};
