import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: 'blue' | 'yellow' | 'green' | 'purple' | 'red' | 'indigo';
  className?: string;
  onClick?: () => void;
  subtitle?: string;
}

const gradientClasses = {
  blue: 'from-blue-50 to-indigo-50 border-blue-100',
  yellow: 'from-yellow-50 to-amber-50 border-yellow-100',
  green: 'from-green-50 to-emerald-50 border-green-100',
  purple: 'from-purple-50 to-pink-50 border-purple-100',
  red: 'from-red-50 to-rose-50 border-red-100',
  indigo: 'from-indigo-50 to-blue-50 border-indigo-100',
};

const iconGradientClasses = {
  blue: 'from-blue-500 to-indigo-600',
  yellow: 'from-yellow-500 to-amber-600',
  green: 'from-green-500 to-emerald-600',
  purple: 'from-purple-500 to-pink-600',
  red: 'from-red-500 to-rose-600',
  indigo: 'from-indigo-500 to-blue-600',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  gradient = 'blue',
  className = '',
  onClick,
  subtitle,
}: StatCardProps) {
  const baseClasses = `bg-gradient-to-br ${gradientClasses[gradient]} rounded-xl shadow-lg border p-6 transition-all duration-300`;
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-xl hover:scale-105'
    : 'hover:shadow-xl';

  const content = (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${iconGradientClasses[gradient]} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

