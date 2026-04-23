export const repairs = [
  { id: 'R-0042', customer: 'Kwame Asante', device: 'iPhone 14 Pro Max', issue: 'Screen replacement + battery', status: 'ready', technician: 'Ama O.', eta: 'Today', cost: 'GHS 850', started: 'Apr 20', warranty: true, parts: [{ name: 'OLED Display', status: 'installed' }, { name: 'Battery', status: 'installed' }], notes: ['Screen cracked from drop. Battery at 78% health.', 'Customer approved both repairs.'] },
  { id: 'R-0041', customer: 'Ama Owusu', device: 'MacBook Air M2', issue: 'Keyboard not responding', status: 'in_progress', technician: 'Ama O.', eta: 'Apr 24', cost: 'GHS 1,200', started: 'Apr 18', warranty: false, parts: [{ name: 'Top Case Assembly', status: 'ordered' }], notes: ['Liquid damage suspected. Diagnosing logic board.', 'Part ordered from supplier — ETA 2 days.'] },
  { id: 'R-0040', customer: 'Yaw Darko', device: 'Samsung Galaxy S24', issue: 'Charging port loose', status: 'diagnosed', technician: 'Ama O.', eta: 'Apr 25', cost: 'GHS 320', started: 'Apr 19', warranty: true, parts: [{ name: 'Charging Port Flex', status: 'pending' }], notes: ['Port physically damaged. Needs replacement.', 'Waiting for customer approval on quote.'] },
  { id: 'R-0039', customer: 'Abena Frimpong', device: 'iPhone 13', issue: 'Back glass cracked', status: 'parts_pending', technician: 'Ama O.', eta: 'Apr 26', cost: 'GHS 450', started: 'Apr 17', warranty: false, parts: [{ name: 'Back Glass Panel', status: 'ordered' }], notes: ['Cosmetic damage only. Phone fully functional.', 'Customer wants original color match.'] },
  { id: 'R-0038', customer: 'Kofi Mensah', device: 'iPad Pro 12.9"', issue: 'No power / won\'t charge', status: 'received', technician: 'Ama O.', eta: 'Apr 27', cost: 'TBD', started: 'Apr 22', warranty: true, parts: [], notes: ['Device completely dead. Needs full diagnostic.', 'Under warranty — no cost to customer.'] },
  { id: 'R-0037', customer: 'Akosua Boateng', device: 'MacBook Pro 14"', issue: 'Trackpad erratic', status: 'ready', technician: 'Ama O.', eta: 'Today', cost: 'GHS 380', started: 'Apr 15', warranty: false, parts: [{ name: 'Trackpad Assembly', status: 'installed' }], notes: ['Trackpad cable loose. Re-seated and tested.', 'Quality check passed. Ready for pickup.'] },
];

export const repairStats = [
  { label: 'Active Repairs', value: '6', change: '+1', icon: 'ri-tools-line', accent: 'bg-blue-500' },
  { label: 'Ready for Pickup', value: '2', change: '+1', icon: 'ri-check-double-line', accent: 'bg-emerald-500' },
  { label: 'Avg Turnaround', value: '3.2 days', change: '-0.4', icon: 'ri-time-line', accent: 'bg-amber-500' },
  { label: 'Pending Approval', value: '1', change: '0', icon: 'ri-hourglass-line', accent: 'bg-red-500' },
];