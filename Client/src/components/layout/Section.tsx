import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
};

export function Section({
  id,
  children,
  className,
  fullWidth = false,
  noPadding = false,
}: SectionProps) {
  return (
    <section id={id} className={cn(
      'relative',
      !noPadding && 'py-16 md:py-24 lg:py-28',
      className
    )}>
      <div className={cn(
        'mx-auto',
        fullWidth ? 'w-full' : 'w-full px-4 sm:px-6 lg:px-8 max-w-7xl',
        'text-gray-100' // Default text color for all children
      )}>
        {children}
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  subtitle,
  description,
  className,
  titleClassName,
  subtitleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <motion.div 
      className={cn('text-center max-w-3xl mx-auto mb-12', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {subtitle && (
        <span className={cn(
          'text-purple-400 font-semibold text-sm uppercase tracking-wider mb-2 block',
          subtitleClassName
        )}>
          {subtitle}
        </span>
      )}
      <h2 className={cn(
        'text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4',
        titleClassName
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          'text-lg text-gray-300 mt-4',
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
