import React, { forwardRef } from 'react';
import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/forms/FormField';

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      description,
      required = false,
      leftIcon,
      rightIcon,
      containerClassName,
      inputClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `auth-input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
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
          <Input
            id={inputId}
            ref={ref}
            label="" // Empty label since we handle it above
            error={error}
            description={description}
            required={required}
            className={cn(
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

