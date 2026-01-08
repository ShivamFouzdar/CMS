import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-11 min-h-[44px] py-2.5 px-4',
        sm: 'h-10 min-h-[44px] px-3.5 rounded-md',
        lg: 'h-14 min-h-[44px] px-8 py-4 rounded-md',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, href, children, ...props },
    ref
  ) => {
    // If href is provided, render as Link
    if (href) {
      // Handle hash links (for same-page navigation)
      if (href.startsWith('#')) {
        return (
          <a
            href={href}
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="-ml-1 mr-2 text-white" />
                {children}
              </>
            ) : (
              children
            )}
          </a>
        );
      }
      // Handle regular routes - use React Router Link
      return (
        <Link
          to={href}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="-ml-1 mr-2 text-white" />
              {children}
            </>
          ) : (
            children
          )}
        </Link>
      );
    }

    // Default button behavior
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="-ml-1 mr-2 text-white" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
