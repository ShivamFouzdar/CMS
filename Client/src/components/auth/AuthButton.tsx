import React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function AuthButton({
  children,
  loading = false,
  disabled = false,
  fullWidth = true,
  variant = 'primary',
  className,
  type = 'button',
  onClick,
  ...props
}: AuthButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  return (
    <Button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center space-x-2',
        fullWidth && 'w-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
    </Button>
  );
}

