export const analyticsKPIs = [
  { label: 'Total Revenue', value: 'GHS 0', change: '0%', trend: 'up', icon: 'ri-money-dollar-circle-line', accent: 'bg-emerald-500', sub: '6-month total' },
  { label: 'Total Orders', value: '0', change: '0%', trend: 'up', icon: 'ri-shopping-bag-3-line', accent: 'bg-blue-500', sub: 'Completed sales' },
  { label: 'Avg Order Value', value: 'GHS 0', change: '0%', trend: 'up', icon: 'ri-bar-chart-box-line', accent: 'bg-violet-500', sub: 'Per transaction' },
  { label: 'Customer LTV', value: 'GHS 0', change: '0%', trend: 'up', icon: 'ri-user-heart-line', accent: 'bg-amber-500', sub: 'Avg lifetime value' },
];

export const monthlyData = [
  { month: 'Jan', revenue: 0, orders: 0, leads: 0, repairs: 0, target: 0 },
  { month: 'Feb', revenue: 0, orders: 0, leads: 0, repairs: 0, target: 0 },
  { month: 'Mar', revenue: 0, orders: 0, leads: 0, repairs: 0, target: 0 },
  { month: 'Apr', revenue: 0, orders: 0, leads: 0, repairs: 0, target: 0 },
  { month: 'May', revenue: 0, orders: 0, leads: 0, repairs: 0, target: 0 },
  { month: 'Jun', revenue: 0, orders: 0, leads: 0, repairs: 0, target: 0 },
];

export const topSellingProducts: never[] = [];

export const customerSegmentData = [
  { segment: 'VIP', count: 0, revenue: 'GHS 0', avgLTV: 'GHS 0', pct: 0 },
  { segment: 'Repeat', count: 0, revenue: 'GHS 0', avgLTV: 'GHS 0', pct: 0 },
  { segment: 'New', count: 0, revenue: 'GHS 0', avgLTV: 'GHS 0', pct: 0 },
  { segment: 'At-Risk', count: 0, revenue: 'GHS 0', avgLTV: 'GHS 0', pct: 0 },
];

export const repairMetrics = [
  { month: 'Jan', completed: 0, revenue: 0 },
  { month: 'Feb', completed: 0, revenue: 0 },
  { month: 'Mar', completed: 0, revenue: 0 },
  { month: 'Apr', completed: 0, revenue: 0 },
  { month: 'May', completed: 0, revenue: 0 },
  { month: 'Jun', completed: 0, revenue: 0 },
];

export const salesFunnel = [
  { stage: 'Leads', value: 0, color: '#3B82F6' },
  { stage: 'Contacted', value: 0, color: '#6366F1' },
  { stage: 'Quoted', value: 0, color: '#8B5CF6' },
  { stage: 'Negotiating', value: 0, color: '#D97706' },
  { stage: 'Closed', value: 0, color: '#059669' },
];

export const stockHealthData = [
  { label: 'Healthy Stock', value: 0, pct: 0, color: 'bg-emerald-500' },
  { label: 'Low Stock', value: 0, pct: 0, color: 'bg-amber-400' },
  { label: 'Out of Stock', value: 0, pct: 0, color: 'bg-red-400' },
];
