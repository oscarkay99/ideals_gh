import { igStats } from '@/mocks/instagram';

const igGradient = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

export default function IgStatsStrip() {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
      {[
        { label: 'Followers', value: igStats.followers, icon: 'ri-user-follow-line' },
        { label: 'Weekly Reach', value: igStats.weeklyReach, icon: 'ri-eye-line' },
        { label: 'Active DMs', value: igStats.activeDMs.toString(), icon: 'ri-message-3-line' },
        { label: 'Engagement', value: igStats.engagementRate, icon: 'ri-heart-line' },
        { label: 'Conversion', value: igStats.conversionRate, icon: 'ri-arrow-up-circle-line' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 flex items-center justify-center rounded-md" style={{ background: igGradient }}>
              <i className={`${s.icon} text-[10px] text-white`} />
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
