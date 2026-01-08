import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface AuthPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export interface AuthPasswordInputRef {
  toggleVisibility: () => void;
  isVisible: boolean;
}

export const AuthPasswordInput = forwardRef<AuthPasswordInputRef, AuthPasswordInputProps>(
  (
    {
      label,
      error,
      description,
      required = false,
      leftIcon,
      containerClassName,
      inputClassName,
      id,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const inputId = id || `auth-password-input-${Math.random().toString(36).substr(2, 9)}`;

    useImperativeHandle(ref, () => ({
      toggleVisibility: () => setIsVisible(!isVisible),
      isVisible,
    }));

    return (
      <div className={cn('space-y-2', containerClassName)}>
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={isVisible ? 'text' : 'password'}
            className={cn(
              'w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 outline-none placeholder:text-slate-400',
              leftIcon && 'pl-11',
              'pr-11', // Space for toggle icon
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            aria-invalid={!!error}
            aria-required={required}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {description && !error && (
          <p className="text-sm text-gray-500">{description}</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

AuthPasswordInput.displayName = 'AuthPasswordInput';

