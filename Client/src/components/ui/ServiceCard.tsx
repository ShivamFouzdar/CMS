import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import React, { ReactNode } from 'react';

export interface ServiceCardProps {
  icon: ReactNode | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  href?: string;
  gradient: string;
  bgGradient: string;
  className?: string;
  showFeatures?: number; // Number of features to show (default: 3)
  animationDelay?: number;
}

export function ServiceCard({
  icon,
  title,
  description,
  features,
  href,
  gradient,
  bgGradient,
  className = '',
  showFeatures = 3,
  animationDelay = 0,
}: ServiceCardProps) {
  // Render icon helper function
  const renderIcon = (): ReactNode => {
    // If it's already a valid React element, return it directly
    if (React.isValidElement(icon)) {
      return icon;
    }

    // If it's a function (component constructor), instantiate it using JSX
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-6 h-6 text-white" />;
    }

    // Check if it's a React component object (has $$typeof)
    if (icon && typeof icon === 'object' && '$$typeof' in icon) {
      // This is likely a component that needs to be instantiated
      // Try to use it as a component
      if ('render' in icon || 'prototype' in icon) {
        const IconComponent = icon as unknown as React.ComponentType<{ className?: string }>;
        return <IconComponent className="w-6 h-6 text-white" />;
      }
    }

    // If it's null/undefined, return null
    if (icon === null || icon === undefined) {
      return null;
    }

    // For any other case, return null and log a warning
    console.warn('ServiceCard received an unexpected icon type. Ensure icon is a ReactNode or a LucideIcon component.', icon);
    return null;
  };

  return (
    <motion.div
      className={`group relative ${className} h-full`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: animationDelay }
        }
      }}
    >
      <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ring-1 ring-gray-900/5">
        {/* Gradient Background on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with Icon and Title Side-by-Side */}
          <div className="flex items-start gap-5 mb-6">
            {/* Icon with Gradient Background */}
            <div
              className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-0 transition-all duration-500 ring-4 ring-white/50`}
            >
              {renderIcon()}
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300 leading-tight pt-1">
              {title}
            </h3>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3 text-[0.95rem]">
            {description}
          </p>

          {/* Features List - Pushed to bottom if space allows, but in this layout it flows naturally */}
          {features && features.length > 0 && (
            <ul className="space-y-3 mb-8 flex-grow">
              {features.slice(0, showFeatures).map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}
                  >
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA Button */}
          {href && (
            <div className="mt-auto pt-4 border-t border-gray-100 group-hover:border-gray-200/50 transition-colors">
              <a
                href={href}
                className="inline-flex items-center gap-2 group/btn"
              >
                <span
                  className={`text-sm font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover/btn:gap-3 transition-all duration-300`}
                >
                  Learn More
                </span>
                <ArrowRight
                  className={`w-4 h-4 text-${gradient.split('-')[1]}-500 transform group-hover/btn:translate-x-1 transition-all duration-300`}
                />
              </a>
            </div>
          )}
        </div>

        {/* Decorative Corner Element */}
        <div
          className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none`}
        />
        <div
          className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr ${gradient} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none`}
        />
      </div>
    </motion.div>
  );
}

