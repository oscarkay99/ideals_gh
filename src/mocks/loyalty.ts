export const loyaltyTiers = [
  {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 999,
    color: '#CD7F32',
    benefits: ['1 point per GHS 1 spent', 'Birthday discount 5%', 'Access to sales events'],
    icon: 'ri-medal-line',
    customers: 0,
  },
  {
    id: 'silver',
    name: 'Silver',
    minPoints: 1000,
    maxPoints: 4999,
    color: '#C0C0C0',
    benefits: ['1.5 points per GHS 1 spent', 'Birthday discount 10%', 'Free screen protector yearly', 'Priority repair queue'],
    icon: 'ri-vip-crown-line',
    customers: 0,
  },
  {
    id: 'gold',
    name: 'Gold',
    minPoints: 5000,
    maxPoints: 14999,
    color: '#FFD700',
    benefits: ['2 points per GHS 1 spent', 'Birthday discount 15%', 'Free case + protector yearly', 'Express delivery', 'Exclusive early access'],
    icon: 'ri-vip-diamond-line',
    customers: 0,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 15000,
    maxPoints: 999999,
    color: '#E5E4E2',
    benefits: ['3 points per GHS 1 spent', 'Birthday discount 20%', 'Free accessories bundle yearly', 'Personal account manager', 'VIP repair (same day)', 'Free delivery nationwide'],
    icon: 'ri-vip-crown-2-line',
    customers: 0,
  },
];

export const loyaltyCustomers: never[] = [];

export const loyaltyRewards = [
  { id: 'r1', name: 'GHS 20 Off', points: 1000, value: 20, category: 'Discount', redeemed: 0 },
  { id: 'r2', name: 'GHS 50 Off', points: 5000, value: 50, category: 'Discount', redeemed: 0 },
  { id: 'r3', name: 'GHS 100 Off', points: 10000, value: 100, category: 'Discount', redeemed: 0 },
  { id: 'r4', name: 'Free Screen Protector', points: 10000, value: 80, category: 'Accessory', redeemed: 0 },
  { id: 'r5', name: 'Free Phone Case', points: 20000, value: 150, category: 'Accessory', redeemed: 0 },
  { id: 'r6', name: 'Free Accessories Bundle', points: 50000, value: 400, category: 'Bundle', redeemed: 0 },
  { id: 'r7', name: 'Express Repair', points: 15000, value: 200, category: 'Service', redeemed: 0 },
  { id: 'r8', name: 'Free Delivery', points: 8000, value: 50, category: 'Service', redeemed: 0 },
];

export const loyaltyStats = {
  totalMembers: 0,
  activeMembers: 0,
  totalPointsIssued: 0,
  totalPointsRedeemed: 0,
  avgPointsPerMember: 0,
  retentionRate: 0,
  revenueFromLoyalty: 0,
  topTierPercentage: 0,
};
