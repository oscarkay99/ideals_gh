import type { StatCard as StatCardType } from '@/types/common';

interface StatCardProps extends StatCardType {
  onClick?: () => void;
}

export function StatCard({ label, value, change, icon, accent, onClick }: StatCardProps) {
  const isPositive = change.startsWith('+');
  const isNegative = change.startsWith('-');

  return (
    <div
      className={`bg-[#0F2147] border border-[#1E3A6E] rounded-xl p-5 ${onClick ? 'cursor-pointer hover:border-[#1E5FBE]/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${accent} bg-opacity-15 rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-lg text-white`} />
        </div>
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
