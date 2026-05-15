import { useState, useEffect } from 'react';
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent } from '@/services/events';
import type { CalendarEvent } from '@/services/events';
import { useToast } from '@/contexts/ToastContext';

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getCalendarEvents()
      .then(data => setEvents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = async (e: Omit<CalendarEvent, 'id'>) => {
    try {
      const created = await createCalendarEvent(e);
      setEvents(prev => [...prev, created]);
      showToast('Event created');
      return created;
    } catch {
      const local: CalendarEvent = { ...e, id: `EVT-${Date.now()}` };
      setEvents(prev => [...prev, local]);
      showToast('Event saved locally — sync failed', 'warning');
      return local;
    }
  };

  const update = (id: string, patch: Partial<Omit<CalendarEvent, 'id'>>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
    updateCalendarEvent(id, patch)
      .then(() => showToast('Event updated'))
      .catch(() => showToast('Could not sync changes', 'warning'));
  };

  return { events, loading, add, update };
}
