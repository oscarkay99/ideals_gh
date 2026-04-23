export const tradeInBrands = [
  { id: 'apple', name: 'Apple', icon: 'ri-apple-fill' },
  { id: 'samsung', name: 'Samsung', icon: 'ri-smartphone-line' },
  { id: 'google', name: 'Google', icon: 'ri-google-fill' },
  { id: 'xiaomi', name: 'Xiaomi', icon: 'ri-smartphone-line' },
  { id: 'tecno', name: 'Tecno', icon: 'ri-smartphone-line' },
  { id: 'infinix', name: 'Infinix', icon: 'ri-smartphone-line' },
];

export const tradeInModels: Record<string, { name: string; baseValue: number }[]> = {
  apple: [
    { name: 'iPhone 15 Pro Max', baseValue: 5800 },
    { name: 'iPhone 15 Pro', baseValue: 5200 },
    { name: 'iPhone 15 Plus', baseValue: 4400 },
    { name: 'iPhone 15', baseValue: 3900 },
    { name: 'iPhone 14 Pro Max', baseValue: 4200 },
    { name: 'iPhone 14 Pro', baseValue: 3600 },
    { name: 'iPhone 14', baseValue: 2800 },
    { name: 'iPhone 13 Pro Max', baseValue: 3000 },
    { name: 'iPhone 13', baseValue: 2200 },
    { name: 'iPhone 12', baseValue: 1500 },
    { name: 'iPhone 11', baseValue: 900 },
  ],
  samsung: [
    { name: 'Galaxy S25 Ultra', baseValue: 5400 },
    { name: 'Galaxy S24 Ultra', baseValue: 4600 },
    { name: 'Galaxy S24+', baseValue: 3400 },
    { name: 'Galaxy S24', baseValue: 2800 },
    { name: 'Galaxy S23 Ultra', baseValue: 3200 },
    { name: 'Galaxy S23', baseValue: 2000 },
    { name: 'Galaxy S22', baseValue: 1600 },
    { name: 'Galaxy A54', baseValue: 900 },
    { name: 'Galaxy A34', baseValue: 650 },
  ],
  google: [
    { name: 'Pixel 9 Pro XL', baseValue: 3800 },
    { name: 'Pixel 9 Pro', baseValue: 3200 },
    { name: 'Pixel 9', baseValue: 2600 },
    { name: 'Pixel 8 Pro', baseValue: 2400 },
    { name: 'Pixel 8', baseValue: 1800 },
    { name: 'Pixel 7 Pro', baseValue: 1600 },
    { name: 'Pixel 7', baseValue: 1200 },
  ],
  xiaomi: [
    { name: 'Xiaomi 14 Ultra', baseValue: 2800 },
    { name: 'Xiaomi 14', baseValue: 2200 },
    { name: 'Redmi Note 13 Pro', baseValue: 800 },
    { name: 'Redmi Note 12', baseValue: 550 },
  ],
  tecno: [
    { name: 'Tecno Phantom X2 Pro', baseValue: 1200 },
    { name: 'Tecno Camon 30 Pro', baseValue: 700 },
    { name: 'Tecno Spark 20 Pro', baseValue: 400 },
  ],
  infinix: [
    { name: 'Infinix Zero 40', baseValue: 900 },
    { name: 'Infinix Note 40 Pro', baseValue: 650 },
    { name: 'Infinix Hot 40 Pro', baseValue: 380 },
  ],
};

export const conditionMultipliers = {
  excellent: 1.0,
  good: 0.82,
  fair: 0.60,
  poor: 0.35,
};

export const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
export const storageMultipliers: Record<string, number> = {
  '64GB': 0.88,
  '128GB': 0.94,
  '256GB': 1.0,
  '512GB': 1.08,
  '1TB': 1.15,
};

export const recentTradeIns = [
  { customer: 'Kwame A.', device: 'iPhone 13 Pro', condition: 'Good', value: 2600, date: 'Apr 22' },
  { customer: 'Abena O.', device: 'Samsung S22', condition: 'Excellent', value: 1600, date: 'Apr 21' },
  { customer: 'Kofi M.', device: 'iPhone 12', condition: 'Fair', value: 900, date: 'Apr 20' },
  { customer: 'Ama D.', device: 'Pixel 7 Pro', condition: 'Good', value: 1312, date: 'Apr 19' },
  { customer: 'Yaw B.', device: 'Galaxy S23', condition: 'Excellent', value: 2000, date: 'Apr 18' },
];
