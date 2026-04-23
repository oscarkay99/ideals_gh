import { calendarEvents } from '@/mocks/marketing';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// April 2026 starts on Wednesday (index 3)
const startOffset = 3;
const totalDays = 30;

export default function CampaignCalendar() {
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const getEvents = (day: number) => calendarEvents.filter((e) => e.day === day);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Campaign Calendar</h3>
          <p className="text-xs text-slate-400 mt-0.5">April 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer transition-all">
            <i className="ri-arrow-left-s-line text-base" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer transition-all">
            <i className="ri-arrow-right-s-line text-base" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {days.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          const events = day ? getEvents(day) : [];
          const isToday = day === 23;
          return (
            <div
              key={i}
              className={`min-h-[64px] rounded-xl p-1.5 transition-all ${
                day ? 'hover:bg-slate-50 cursor-pointer' : ''
              } ${isToday ? 'bg-emerald-50 ring-1 ring-emerald-200' : ''}`}
            >
              {day && (
                <>
                  <p className={`text-xs font-semibold mb-1 ${isToday ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {day}
                  </p>
                  <div className="space-y-0.5">
                    {events.map((ev, j) => (
                      <div
                        key={j}
                        className={`text-[9px] text-white font-medium px-1.5 py-0.5 rounded-md truncate ${ev.color}`}
                        title={ev.label}
                      >
                        {ev.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-50 flex-wrap">
        {[
          { color: 'bg-emerald-500', label: 'WhatsApp' },
          { color: 'bg-pink-500', label: 'Instagram' },
          { color: 'bg-amber-500', label: 'Ending Soon' },
          { color: 'bg-slate-400', label: 'Draft' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[10px] text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
