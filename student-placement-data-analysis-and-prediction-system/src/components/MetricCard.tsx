import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    trend: 'up' | 'down' | 'neutral';
  };
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  accentColor = '#0d9488',
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {value}
            </span>
            {badge && (
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                  badge.trend === 'up'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                    : badge.trend === 'down'
                    ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
        </div>

        <div
          className="p-2.5 rounded-lg shrink-0"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtitle && (
        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
