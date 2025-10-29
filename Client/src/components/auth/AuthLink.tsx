import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AuthLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted';
}

export function AuthLink({ to, children, className, variant = 'default' }: AuthLinkProps) {
  const variants = {
    default: 'text-blue-600 hover:text-blue-700 font-medium',
    muted: 'text-gray-600 hover:text-gray-700',
  };

  return (
    <Link
      to={to}
      className={cn(
        'text-sm transition-colors duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}

