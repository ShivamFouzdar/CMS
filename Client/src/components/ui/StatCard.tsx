import { memo } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: 'blue' | 'yellow' | 'green' | 'purple' | 'red' | 'indigo';
  className?: string;
  onClick?: () => void;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const gradientClasses = {
  blue: 'from-blue-500 to-indigo-600',
  yellow: 'from-amber-400 to-orange-500',
  green: 'from-emerald-400 to-teal-600',
  purple: 'from-violet-500 to-purple-600',
  red: 'from-rose-500 to-red-600',
  indigo: 'from-indigo-500 to-blue-600',
};

const shadowColors = {
  blue: 'rgba(59, 130, 246, 0.15)',
  yellow: 'rgba(251, 191, 36, 0.15)',
  green: 'rgba(16, 185, 129, 0.15)',
  purple: 'rgba(139, 92, 246, 0.15)',
  red: 'rgba(244, 63, 94, 0.15)',
  indigo: 'rgba(99, 102, 241, 0.15)',
};

export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  gradient = 'blue',
  className = '',
  onClick,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl p-5 sm:p-6
        bg-white dark:bg-slate-900/50
        border border-gray-100 dark:border-white/5
        hover:border-gray-200 dark:hover:border-white/10
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1' : ''}
        ${className}
      `}
      style={{
        boxShadow: `0 4px 24px -4px ${shadowColors[gradient]}`
      }}
    >
      {/* Background Glow */}
      <div
        className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${gradientClasses[gradient]} opacity-[0.08] blur-3xl group-hover:opacity-[0.12] transition-opacity duration-500`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>

          {/* Trend Indicator */}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}

          {/* Subtitle */}
          {subtitle && !trend && (
            <span className="text-xs text-gray-400 dark:text-slate-500 mt-2 truncate">
              {subtitle}
            </span>
          )}
        </div>

        {/* Icon */}
        <div className={`
          w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0
          bg-gradient-to-br ${gradientClasses[gradient]} 
          rounded-xl flex items-center justify-center 
          shadow-lg group-hover:scale-105 group-hover:rotate-3 
          transition-transform duration-300
        `}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );
});
