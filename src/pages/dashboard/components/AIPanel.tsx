import { useState } from 'react';
import { aiInsights } from '@/mocks/dashboard';

export default function AIPanel() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const insightDetails: string[] = [];

  return (
    <div className="rounded-2xl p-5 text-white h-full flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #07101F 0%, #0D1F4A 55%, #1552A8 100%)' }}>
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(245,166,35,0.1)' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(36,99,190,0.2)' }} />

      <div className="relative flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F5A623, #D4890A)' }}>
          <i className="ri-sparkling-2-fill text-white text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">AI Intelligence</h3>
          <p className="text-[10px] text-white/40">Live insights</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F5A623' }} />
          <span className="text-[10px] font-medium" style={{ color: '#F5A623' }}>Active</span>
        </div>
      </div>

      <div className="relative flex-1 space-y-2 overflow-y-auto">
        {aiInsights.map((insight, i) => (
          <div
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="group cursor-pointer"
          >
            <div className={`flex items-start gap-2.5 p-3 rounded-xl transition-all ${expanded === i ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <i className="ri-checkbox-circle-fill text-sm" style={{ color: '#F5A623' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/75 leading-relaxed">{insight}</p>
                {expanded === i && (
                  <p className="text-[11px] text-white/50 leading-relaxed mt-2 border-t border-white/10 pt-2">
                    {insightDetails[i]}
                  </p>
                )}
              </div>
              <div className={`w-4 h-4 flex items-center justify-center text-white/20 transition-transform flex-shrink-0 ${expanded === i ? 'rotate-180' : ''}`}>
                <i className="ri-arrow-down-s-line text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 pt-4 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(16,185,129,0.12))' }}>
          <i className="ri-sparkling-2-line text-xs" />
          Generate Full AI Report
        </button>
      </div>
    </div>
  );
}