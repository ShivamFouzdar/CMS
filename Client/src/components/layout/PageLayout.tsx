import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageLayout component that provides proper spacing from the fixed navbar
 * Accounts for responsive navbar heights:
 * - Mobile: 56px (h-14)
 * - Small screens: 64px (h-16)
 * - Large screens: 72px (h-18)
 */
export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div 
      className={`pt-14 sm:pt-16 lg:pt-[4.5rem] ${className}`}
    >
      {children}
    </div>
  );
}

