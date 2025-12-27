import { Eye, Trash2, Download, LucideIcon } from 'lucide-react';

interface ActionButton {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple';
  show?: boolean;
}

interface ActionButtonsProps {
  actions: ActionButton[];
  className?: string;
}

const colorClasses = {
  blue: 'text-blue-600 hover:text-blue-800',
  red: 'text-red-600 hover:text-red-800',
  green: 'text-green-600 hover:text-green-800',
  yellow: 'text-yellow-600 hover:text-yellow-800',
  purple: 'text-purple-600 hover:text-purple-800',
};

export function ActionButtons({ actions, className = '' }: ActionButtonsProps) {
  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      {actions
        .filter((action) => action.show !== false)
        .map((action, index) => {
          const Icon = action.icon;
          const color = action.color || 'blue';
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`${colorClasses[color]} transition-colors`}
              title={action.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
    </div>
  );
}

