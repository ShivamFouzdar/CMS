import { Clock, AlertCircle, CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
  className?: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: LucideIcon; label: string }> = {
  new: {
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: Clock,
    label: 'New',
  },
  in_progress: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: AlertCircle,
    label: 'In Progress',
  },
  completed: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: CheckCircle,
    label: 'Completed',
  },
  closed: {
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    icon: XCircle,
    label: 'Closed',
  },
};

export function StatusBadge({ status, className = '', onClick }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;
  const Icon = config.icon;
  const displayLabel = config.label || status.replace('_', ' ');

  const content = (
    <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 border ${config.bg} ${config.color} ${config.border} ${className}`}>
      <Icon className="h-3 w-3" />
      <span>{displayLabel}</span>
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="outline-none"
        title="Click to change status"
      >
        {content}
      </motion.button>
    );
  }

  return content;
}
