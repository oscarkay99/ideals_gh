export const inventoryProducts = [
  { id: 'P001', name: 'iPhone 15 Pro Max 256GB', category: 'Phones', condition: 'New', price: 'GHS 8,200', stock: 3, imei: '358123456789012', location: 'Main Store', supplier: 'Apple Authorized', lastRestocked: 'Apr 15, 2026', fastMover: true },
  { id: 'P002', name: 'MacBook Air M2 8GB/256GB', category: 'Laptops', condition: 'New', price: 'GHS 12,400', stock: 5, imei: 'C02XYZ123456', location: 'Main Store', supplier: 'Apple Authorized', lastRestocked: 'Apr 10, 2026', fastMover: true },
  { id: 'P003', name: 'Samsung Galaxy S24 Ultra', category: 'Phones', condition: 'New', price: 'GHS 6,800', stock: 1, imei: '358987654321098', location: 'Main Store', supplier: 'Samsung Ghana', lastRestocked: 'Apr 8, 2026', fastMover: true },
  { id: 'P004', name: 'AirPods Pro 2nd Gen', category: 'Accessories', condition: 'New', price: 'GHS 1,600', stock: 8, imei: '—', location: 'Main Store', supplier: 'Apple Authorized', lastRestocked: 'Apr 12, 2026', fastMover: false },
  { id: 'P005', name: 'iPhone 14 Pro Max 128GB', category: 'Phones', condition: 'Used - Excellent', price: 'GHS 5,200', stock: 2, imei: '358111222333444', location: 'Main Store', supplier: 'Trade-in', lastRestocked: 'Apr 5, 2026', fastMover: false },
  { id: 'P006', name: 'iPad Pro 12.9" M2', category: 'Tablets', condition: 'New', price: 'GHS 8,800', stock: 4, imei: '358555666777888', location: 'Main Store', supplier: 'Apple Authorized', lastRestocked: 'Apr 14, 2026', fastMover: false },
  { id: 'P007', name: 'Samsung Galaxy A54', category: 'Phones', condition: 'Refurbished', price: 'GHS 2,400', stock: 6, imei: '358999000111222', location: 'Back Room', supplier: 'Refurb Partner', lastRestocked: 'Apr 2, 2026', fastMover: false },
  { id: 'P008', name: 'MacBook Pro 14" M3', category: 'Laptops', condition: 'New', price: 'GHS 18,500', stock: 2, imei: 'C02ABC789012', location: 'Main Store', supplier: 'Apple Authorized', lastRestocked: 'Apr 18, 2026', fastMover: false },
  { id: 'P009', name: 'Apple Watch Series 9', category: 'Accessories', condition: 'New', price: 'GHS 3,200', stock: 0, imei: '—', location: 'Main Store', supplier: 'Apple Authorized', lastRestocked: 'Mar 28, 2026', fastMover: false },
  { id: 'P010', name: 'Google Pixel 8 Pro', category: 'Phones', condition: 'Used - Good', price: 'GHS 3,800', stock: 1, imei: '358333444555666', location: 'Back Room', supplier: 'Trade-in', lastRestocked: 'Mar 20, 2026', fastMover: false },
];

export const inventoryStats = [
  { label: 'Total Products', value: '142', change: '+8', icon: 'ri-archive-line', accent: 'bg-blue-500' },
  { label: 'Low Stock Items', value: '9', change: '-2', icon: 'ri-alert-line', accent: 'bg-amber-500' },
  { label: 'Out of Stock', value: '3', change: '+1', icon: 'ri-close-circle-line', accent: 'bg-red-500' },
  { label: 'Total Value', value: 'GHS 284K', change: '+12%', icon: 'ri-money-dollar-circle-line', accent: 'bg-emerald-500' },
];