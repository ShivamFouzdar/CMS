import { motion } from 'framer-motion';
import { ArrowRight, Check, LucideIcon } from 'lucide-react';
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
        const IconComponent = icon as React.ComponentType<{ className?: string }>;
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
      className={`group relative ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, delay: animationDelay }
        }
      }}
    >
      {/* Card with modern design */}
      <div className="relative h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Gradient Background on Hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        
        {/* Icon with Gradient Background */}
        <div 
          className={`relative mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
        >
          {renderIcon()}
          <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Features List */}
          {features && features.length > 0 && (
            <ul className="space-y-3 mb-8">
              {features.slice(0, showFeatures).map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div 
                    className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA Button */}
          {href && (
            <a 
              href={href} 
              className="inline-flex items-center gap-2 group/btn"
            >
              <span 
                className={`text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover/btn:gap-3 transition-all duration-300`}
              >
                Learn More
              </span>
              <ArrowRight 
                className={`w-5 h-5 bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover/btn:translate-x-1 transition-transform duration-300`} 
              />
            </a>
          )}
        </div>

        {/* Decorative Corner Element */}
        <div 
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity duration-500`}
        />
      </div>
    </motion.div>
  );
}

