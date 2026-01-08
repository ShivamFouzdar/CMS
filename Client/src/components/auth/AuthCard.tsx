import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  glass?: boolean;
}

export function AuthCard({
  children,
  title,
  description,
  footer,
  className,
  contentClassName,
  glass = false,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <Card
        className={cn(
          'shadow-2xl border-gray-100 transition-all duration-300',
          glass && 'bg-white/70 backdrop-blur-xl border-white/20',
          className
        )}
      >
        <CardContent className={cn('p-8 sm:p-10', contentClassName)}>
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
          <div className="px-8 pb-8 pt-0 text-center text-sm text-gray-500">
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
