import { useState, useEffect } from 'react';
import { getCalendarEvents, createCalendarEvent } from '@/services/events';
import type { CalendarEvent } from '@/services/events';

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
      return created;
    } catch {
      const local: CalendarEvent = { ...e, id: `EVT-${Date.now()}` };
      setEvents(prev => [...prev, local]);
      return local;
    }
  };

  return { events, loading, add };
}
