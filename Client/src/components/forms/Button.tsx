import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * The visual style of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * The loading text to show when isLoading is true
   */
  loadingText?: string;
  
  /**
   * The icon to display before the button text
   */
  leftIcon?: ReactNode;
  
  /**
   * The icon to display after the button text
   */
  rightIcon?: ReactNode;
  
  /**
   * Whether the button should take up the full width of its container
   * @default false
   */
  isFullWidth?: boolean;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-blue-500',
  ghost: 'hover:bg-gray-100 focus-visible:ring-blue-500',
  link: 'text-blue-600 hover:text-blue-800 hover:underline focus-visible:ring-blue-500 p-0 h-auto',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0 flex items-center justify-center',
};

/**
 * A customizable button component with loading states and icons.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const showLoading = isLoading || false;
    const showLeftIcon = leftIcon && !showLoading;
    const showRightIcon = rightIcon && !showLoading;
    const showLoader = showLoading && !loadingText;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          buttonVariants[variant],
          buttonSizes[size],
          isFullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {showLoading && (
          <>
            <Loader2 
              className={cn(
                'animate-spin',
                loadingText ? 'mr-2' : '',
                size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
              )} 
              aria-hidden="true"
            />
            {loadingText && <span>{loadingText}</span>}
          </>
        )}
        
        {!showLoading && (
          <>
            {showLeftIcon && (
              <span 
                className={cn(
                  'inline-flex items-center',
                  children ? (size === 'sm' ? 'mr-1.5' : 'mr-2') : ''
                )}
              >
                {leftIcon}
              </span>
            )}
            
            {children}
            
            {showRightIcon && (
              <span 
                className={cn(
                  'inline-flex items-center',
                  children ? (size === 'sm' ? 'ml-1.5' : 'ml-2') : ''
                )}
              >
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
