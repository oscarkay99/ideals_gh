export const suppliers = [
  { id: 'S001', name: 'Apple Ghana Authorized', contact: 'James Osei', phone: '+233 24 100 0001', email: 'james@applegh.com', category: 'Apple', totalOrders: 24, totalValue: 'GHS 1,240,000', lastOrder: 'Apr 18, 2026', rating: 5, status: 'active', paymentTerms: 'Net 30', leadTime: '3-5 days' },
  { id: 'S002', name: 'Samsung West Africa', contact: 'Kweku Boateng', phone: '+233 20 200 0002', email: 'kweku@samsungwa.com', category: 'Samsung', totalOrders: 18, totalValue: 'GHS 890,000', lastOrder: 'Apr 15, 2026', rating: 4, status: 'active', paymentTerms: 'Net 14', leadTime: '2-4 days' },
  { id: 'S003', name: 'Xiaomi Africa Dist.', contact: 'Ama Sarpong', phone: '+233 54 300 0003', email: 'ama@xiaomiafrica.com', category: 'Xiaomi', totalOrders: 31, totalValue: 'GHS 420,000', lastOrder: 'Apr 20, 2026', rating: 4, status: 'active', paymentTerms: 'Prepaid', leadTime: '1-3 days' },
  { id: 'S004', name: 'Tecno Mobile Ghana', contact: 'Yaw Asante', phone: '+233 27 400 0004', email: 'yaw@tecnomobile.gh', category: 'Tecno', totalOrders: 22, totalValue: 'GHS 280,000', lastOrder: 'Apr 10, 2026', rating: 3, status: 'active', paymentTerms: 'Net 7', leadTime: '1-2 days' },
  { id: 'S005', name: 'Accessories Hub GH', contact: 'Efua Mensah', phone: '+233 24 500 0005', email: 'efua@acchub.gh', category: 'Accessories', totalOrders: 45, totalValue: 'GHS 95,000', lastOrder: 'Apr 22, 2026', rating: 5, status: 'active', paymentTerms: 'Prepaid', leadTime: 'Same day' },
];

export const purchaseOrders = [
  { id: 'PO-2026-041', supplier: 'Apple Ghana Authorized', items: [{ name: 'iPhone 15 Pro 256GB', qty: 10, unitCost: 10800, total: 108000 }, { name: 'iPhone 15 128GB', qty: 8, unitCost: 8800, total: 70400 }], totalValue: 178400, status: 'delivered', orderedDate: 'Apr 15, 2026', expectedDate: 'Apr 18, 2026', deliveredDate: 'Apr 18, 2026', notes: 'Urgent restock for iPhone 15 series' },
  { id: 'PO-2026-040', supplier: 'Samsung West Africa', items: [{ name: 'Samsung S24 Ultra 256GB', qty: 8, unitCost: 11000, total: 88000 }, { name: 'Samsung A55 5G 128GB', qty: 15, unitCost: 2800, total: 42000 }], totalValue: 130000, status: 'in_transit', orderedDate: 'Apr 20, 2026', expectedDate: 'Apr 24, 2026', deliveredDate: null, notes: 'Regular monthly restock' },
  { id: 'PO-2026-039', supplier: 'Xiaomi Africa Dist.', items: [{ name: 'Redmi Note 13 Pro 256GB', qty: 20, unitCost: 2200, total: 44000 }, { name: 'Redmi Note 13 128GB', qty: 15, unitCost: 1800, total: 27000 }], totalValue: 71000, status: 'delivered', orderedDate: 'Apr 12, 2026', expectedDate: 'Apr 15, 2026', deliveredDate: 'Apr 14, 2026', notes: 'Budget phone restock — high demand' },
  { id: 'PO-2026-038', supplier: 'Accessories Hub GH', items: [{ name: 'Tempered Glass x100', qty: 100, unitCost: 15, total: 1500 }, { name: 'Phone Cases x80', qty: 80, unitCost: 20, total: 1600 }, { name: 'USB-C Cables x50', qty: 50, unitCost: 25, total: 1250 }], totalValue: 4350, status: 'pending', orderedDate: 'Apr 22, 2026', expectedDate: 'Apr 23, 2026', deliveredDate: null, notes: 'Accessories restock' },
  { id: 'PO-2026-037', supplier: 'Tecno Mobile Ghana', items: [{ name: 'Tecno Camon 30 Pro', qty: 20, unitCost: 1400, total: 28000 }], totalValue: 28000, status: 'cancelled', orderedDate: 'Apr 8, 2026', expectedDate: 'Apr 10, 2026', deliveredDate: null, notes: 'Cancelled — supplier out of stock' },
];

export const supplierStats = {
  totalSuppliers: 5,
  activeOrders: 2,
  totalSpentMonth: 383750,
  pendingDeliveries: 2,
  avgLeadTime: '2.4 days',
};