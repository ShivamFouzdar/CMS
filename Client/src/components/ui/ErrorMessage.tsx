import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6 ${className}`}>
      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
    </div>
  );
}

