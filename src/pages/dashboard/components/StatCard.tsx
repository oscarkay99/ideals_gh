import { useState } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  accentColor?: string;
  accent?: string;
  sub?: string;
}

export default function StatCard({ label, value, change, trend, icon, accentColor, sub }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = accentColor || '#0D1F4A';

  const isPositive = trend === 'up';

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden cursor-default transition-all duration-300"
      style={{
        background: 'white',
        border: '1px solid rgba(7,16,31,0.07)',
        boxShadow: hovered
          ? '0 4px 24px rgba(7,16,31,0.1), 0 1px 4px rgba(7,16,31,0.05), 0 0 0 1px rgba(255,255,255,0.9) inset'
          : '0 1px 3px rgba(7,16,31,0.04), 0 6px 24px rgba(7,16,31,0.06), 0 0 0 1px rgba(255,255,255,0.9) inset',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          opacity: hovered ? 1 : 0.6,
        }}
      />

      {/* Decorative corner orb */}
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none transition-opacity duration-300"
        style={{ background: color, opacity: hovered ? 0.06 : 0.04 }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3"
            style={{ color: 'rgba(10,31,74,0.38)' }}
          >
            {label}
          </p>

          {/* Value */}
          <p
            className="text-[28px] font-bold leading-none mb-1 figure"
            style={{ color: '#07101F', letterSpacing: '-0.03em' }}
          >
            {value}
          </p>

          {/* Sub label */}
          {sub && (
            <p className="text-[11px] mb-3" style={{ color: 'rgba(10,31,74,0.38)' }}>{sub}</p>
          )}

          {/* Trend badge */}
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold mt-2"
            style={{
              background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: isPositive ? '#059669' : '#DC2626',
            }}
          >
            <i className={`${isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-xs`} />
            {change} vs last month
          </div>
        </div>

        {/* Icon */}
        <div
          className="w-11 h-11 flex items-center justify-center rounded-2xl flex-shrink-0 ml-3 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}1A, ${color}0D)`,
            border: `1px solid ${color}1F`,
            boxShadow: hovered ? `0 4px 16px ${color}25` : 'none',
          }}
        >
          <i className={`${icon} text-xl`} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
