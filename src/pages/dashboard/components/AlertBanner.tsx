import { useState } from 'react';
import { alerts } from '@/mocks/dashboard';

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = alerts.filter((_, i) => !dismissed.includes(i));
  if (visible.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 flex items-center justify-center text-amber-600">
          <i className="ri-alert-line text-sm" />
        </div>
        <span className="text-sm font-semibold text-amber-800">Needs Attention</span>
        <span className="ml-auto text-xs text-amber-600">{visible.length} alerts</span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => {
          if (dismissed.includes(i)) return null;
          return (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-amber-100">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
              <p className="text-xs text-slate-700 flex-1">{alert.message}</p>
              <button
                onClick={() => setDismissed([...dismissed, i])}
                className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-pointer"
              >
                <i className="ri-close-line text-sm" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
