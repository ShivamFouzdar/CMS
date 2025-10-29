import { cn } from '@/lib/utils';

type LoadingSpinnerProps = {
  /**
   * Additional class name for the spinner
   */
  className?: string;
  
  /**
   * The size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * The color of the spinner
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'muted';
};

/**
 * A customizable loading spinner component
 */
export function LoadingSpinner({
  className,
  size = 'md',
  color = 'primary',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };
  
  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    muted: 'text-gray-400',
  };
  
  return (
    <div 
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * A container for centering the loading spinner
 */
type LoadingSpinnerContainerProps = {
  /**
   * Whether to show the loading spinner
   * @default true
   */
  isLoading?: boolean;
  
  /**
   * The loading text to display below the spinner
   */
  loadingText?: string;
  
  /**
   * The content to display when not loading
   */
  children?: React.ReactNode;
  
  /**
   * Additional class name for the container
   */
  className?: string;
  
  /**
   * The size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * The color of the spinner
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'muted';
};

/**
 * A container that centers a loading spinner with optional text
 */
export function LoadingSpinnerContainer({
  isLoading = true,
  loadingText,
  children,
  className,
  size = 'md',
  color = 'primary',
}: LoadingSpinnerContainerProps) {
  if (!isLoading) {
    return <>{children}</>;
  }
  
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      <LoadingSpinner size={size} color={color} />
      {loadingText && (
        <p className={cn(
          'text-sm',
          color === 'white' ? 'text-white' : 'text-gray-600'
        )}>
          {loadingText}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
