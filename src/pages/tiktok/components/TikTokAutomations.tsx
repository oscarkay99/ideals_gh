interface TikTokAutomation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: string;
  triggered: number;
  converted: number;
  color: string;
}

interface TikTokAutomationsProps {
  automations: TikTokAutomation[];
}

export default function TikTokAutomations({ automations }: TikTokAutomationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {automations.map((rule) => (
        <div key={rule.id} className="bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${rule.color}15` }}>
              <i className="ri-robot-2-line text-sm" style={{ color: rule.color }} />
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${rule.status === 'Active' ? 'text-white' : 'text-slate-600'}`} style={{ background: rule.status === 'Active' ? rule.color : '#E5E7EB' }}>
              {rule.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-1">{rule.name}</p>
          <p className="text-xs text-slate-500 mb-3">{rule.trigger}</p>
          <div className="bg-white rounded-xl p-3 mb-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Action</p>
            <p className="text-xs text-slate-700">{rule.action}</p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Triggered: <span className="font-semibold text-slate-700">{rule.triggered}</span></span>
            <span className="text-slate-500">Converted: <span className="font-semibold" style={{ color: rule.color }}>{rule.converted}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}
