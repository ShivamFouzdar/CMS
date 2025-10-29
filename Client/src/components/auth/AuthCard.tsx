import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AuthCard({
  children,
  title,
  description,
  footer,
  className,
  contentClassName,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        'w-full max-w-md mx-auto shadow-lg border-gray-200',
        className
      )}
    >
      <CardContent className={cn('p-8', contentClassName)}>
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
        {children}
      </CardContent>
      {footer && (
        <div className="px-8 pb-6 pt-0 text-center text-sm text-gray-600">
          {footer}
        </div>
      )}
    </Card>
  );
}

