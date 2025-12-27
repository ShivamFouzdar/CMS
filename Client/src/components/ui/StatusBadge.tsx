import { Clock, AlertCircle, CheckCircle, XCircle, LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { color: string; icon: LucideIcon; label: string }> = {
  new: {
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
    label: 'New',
  },
  in_progress: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
    label: 'In Progress',
  },
  completed: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Completed',
  },
  closed: {
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
    label: 'Closed',
  },
};

export function StatusBadge({ status, className = '', onClick }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;
  const Icon = config.icon;
  const displayLabel = config.label || status.replace('_', ' ');

  const baseClasses = `px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 w-fit shadow-sm ${config.color}`;
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-md transition-all duration-200' : '';

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses} ${className}`}
        title="Click to change status"
      >
        <Icon className="h-4 w-4" />
        <span className="capitalize">{displayLabel}</span>
      </button>
    );
  }

  return (
    <span className={`${baseClasses} ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="capitalize">{displayLabel}</span>
    </span>
  );
}

