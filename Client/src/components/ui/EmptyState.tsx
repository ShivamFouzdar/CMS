import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colSpan?: number;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  colSpan = 6,
  className = '',
}: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-6 py-12 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <Icon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium">{title}</p>
          <p className="text-gray-400 text-sm mt-2">{description}</p>
        </div>
      </td>
    </tr>
  );
}

