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
  labelClassName?: string;
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
      labelClassName,
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
          className={cn(
            "block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref as any}
            id={inputId}
            type={isVisible ? 'text' : 'password'}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              // Custom styles from AuthInput to match "premium" look if needed, but let's stick to standardizing first.
              // Wait, AuthPasswordInput had specific "premium" styles hardcoded: 
              // 'w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl ...'
              // while AuthInput uses the `Input` component which likely has shadcn-like styles.
              // Let's check FormField.tsx content first before committing to this change. 
              // If FormField uses different styles, I might break the "premium" look of Login.
              // For now, I will KEEP the hardcoded styles in AuthPasswordInput because I saw in the "Improving Login Design" task they wanted a premium look, 
              // and standardizing to a basic input might regress that.

              // ACTUALLY, looking at previous steps, `AuthInput` was NOT touched in the premium redesign?
              // `AuthInput` uses `Input` from `FormField`.
              // `AuthPasswordInput` uses raw `input` with `bg-slate-50...`.

              // Let's look at `FormField.tsx` content from the `view_file` call I just made (which will happen before this tool executes in reality, but I have to predict).
              // To be safe, I will simply deduplicate the LABEL logic and ensure `inputClassName` is respected.

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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
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
