import * as React from 'react';
import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
  rows?: number;
};

const inputBaseClasses =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:bg-gray-100 text-gray-900 bg-white';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      description,
      required = false,
      className,
      containerClassName,
      id,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputBaseClasses,
              leftIcon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              className
            )}
            aria-invalid={!!error}
            aria-required={required}
            aria-describedby={
              error ? `${inputId}-error` : description ? `${inputId}-description` : undefined
            }
            {...props}
          />
        </div>
        
        {description && !error && (
          <p id={`${inputId}-description`} className="text-sm text-gray-500">
            {description}
          </p>
        )}
        
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      description,
      required = false,
      className,
      containerClassName,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            inputBaseClasses,
            'resize-none',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={
            error ? `${textareaId}-error` : description ? `${textareaId}-description` : undefined
          }
          {...props}
        />
        
        {description && !error && (
          <p id={`${textareaId}-description`} className="text-sm text-gray-500">
            {description}
          </p>
        )}
        
        {error && (
          <p id={`${textareaId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  label: string;
  options: SelectOption[];
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
  className?: string;
  id?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      description,
      required = false,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900',
              'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-no-repeat',
              'bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]',
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              className
            )}
            style={{ color: '#111827' }}
            aria-invalid={!!error}
            aria-required={required}
            aria-describedby={
              error ? `${selectId}-error` : description ? `${selectId}-description` : undefined
            }
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {description && !error && (
          <p id={`${selectId}-description`} className="text-sm text-gray-500">
            {description}
          </p>
        )}
        
        {error && (
          <p id={`${selectId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
