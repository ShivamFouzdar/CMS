import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/forms/Button';
import { cn } from '@/lib/utils';

type FormErrorProps = {
  /**
   * The error message to display
   */
  error?: string | null;
  
  /**
   * Callback function called when the error is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Additional class name for the error message
   */
  className?: string;
  
  /**
   * Whether to show a dismiss button
   * @default true
   */
  dismissible?: boolean;
};

/**
 * A component to display form errors in a user-friendly way
 */
export function FormError({
  error,
  onDismiss,
  className,
  dismissible = true,
}: FormErrorProps) {
  if (!error) return null;
  
  return (
    <div
      className={cn(
        'bg-red-50 border-l-4 border-red-400 p-4 rounded-md',
        'flex items-start justify-between',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
      {dismissible && (
        <div className="ml-4 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}

type FormErrorsProps = {
  /**
   * An object containing form errors from react-hook-form
   */
  errors: Record<string, any>;
  
  /**
   * The field names to display errors for
   */
  fieldNames: string[];
  
  /**
   * Additional class name for the error list
   */
  className?: string;
};

/**
 * A component to display a list of form field errors
 */
export function FormErrors({ errors, fieldNames, className }: FormErrorsProps) {
  const fieldErrors = fieldNames
    .filter((fieldName) => errors[fieldName]?.message)
    .map((fieldName) => ({
      fieldName,
      message: errors[fieldName].message,
    }));
  
  if (fieldErrors.length === 0) return null;
  
  return (
    <div
      className={cn(
        'bg-red-50 border-l-4 border-red-400 p-4 rounded-md',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There {fieldErrors.length === 1 ? 'is' : 'are'} {fieldErrors.length} error{fieldErrors.length !== 1 ? 's' : ''} with your submission
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {fieldErrors.map((error) => (
                <li key={error.fieldName}>{error.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
