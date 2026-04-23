import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'sale' | 'lead' | 'repair' | 'payment' | 'alert';
  title: string;
  message: string;
  amount?: number;
  time: Date;
  read: boolean;
}

const sampleNotifications: Omit<Notification, 'id' | 'time' | 'read'>[] = [
  { type: 'sale', title: 'New Sale!', message: 'Kwame Mensah just bought iPhone 15 Pro Max', amount: 8200 },
  { type: 'lead', title: 'Hot Lead!', message: 'Abena Osei is interested in Samsung S24 Ultra', amount: 9400 },
  { type: 'payment', title: 'Payment Received', message: 'MoMo payment confirmed from Kofi Agyeman', amount: 12500 },
  { type: 'repair', title: 'Repair Complete', message: 'iPhone 13 screen replacement ready for pickup' },
  { type: 'sale', title: 'New Sale!', message: 'Ama Darko just bought AirPods Pro 2', amount: 2100 },
  { type: 'alert', title: 'Low Stock Alert', message: 'iPhone 15 Pro Max 256GB — only 2 units left' },
];

let notifCounter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${++notifCounter}-${Date.now()}`,
      time: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    setToasts(prev => [...prev, newNotif]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newNotif.id));
    }, 4500);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Simulate live notifications
  useEffect(() => {
    const intervals = [8000, 18000, 30000, 45000, 60000];
    const timers: ReturnType<typeof setTimeout>[] = [];

    intervals.forEach((delay, i) => {
      const timer = setTimeout(() => {
        const sample = sampleNotifications[i % sampleNotifications.length];
        addNotification(sample);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, toasts, unreadCount, addNotification, markAllRead, dismissToast };
}
