/**
 * Format a phone number for display
 * @param value The phone number to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(value: string): string {
  if (!value) return '';
  
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  
  if (match) {
    return !match[2]
      ? match[1]
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
  
  return value;
}

/**
 * Remove formatting from a phone number
 * @param value The formatted phone number
 * @returns Unformatted phone number string
 */
export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validate an email address
 * @param email The email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @param decimals Number of decimal places to show
 * @returns Formatted file size string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Get the file extension from a filename
 * @param filename The filename to get the extension from
 * @returns The file extension in lowercase, or an empty string if no extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if a file type is allowed
 * @param file The file to check
 * @param allowedTypes Array of allowed MIME types or file extensions
 * @returns Whether the file type is allowed
 */
export function isFileTypeAllowed(
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
): boolean {
  if (!file) return false;
  
  // Check MIME type first
  if (file.type && allowedTypes.includes(file.type)) {
    return true;
  }
  
  // Fall back to file extension check
  const extension = getFileExtension(file.name);
  return allowedTypes.some(type => type.endsWith(extension));
}

/**
 * Convert a file to a base64 string
 * @param file The file to convert
 * @returns A promise that resolves with the base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove the data URL prefix
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Create a FormData object from an object
 * @param data The data to convert to FormData
 * @returns A FormData object with the data
 */
export function createFormData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else if (item !== null && item !== undefined) {
          formData.append(
            `${key}[${index}]`,
            typeof item === 'object' ? JSON.stringify(item) : String(item)
          );
        }
      });
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
  
  return formData;
}

/**
 * Get form validation error messages
 * @param error The error object from react-hook-form
 * @param fieldName The name of the field to get the error message for
 * @returns The error message, or undefined if no error
 */
export function getFormErrorMessage(
  error: Record<string, any> | undefined,
  fieldName: string
): string | undefined {
  if (!error) return undefined;
  
  const fieldError = error[fieldName];
  if (!fieldError) return undefined;
  
  if (fieldError.message) {
    return fieldError.message;
  }
  
  if (fieldError.type === 'required') {
    return 'This field is required';
  }
  
  if (fieldError.type === 'pattern') {
    return 'Invalid format';
  }
  
  if (fieldError.type === 'minLength') {
    return `Must be at least ${fieldError.minLength} characters`;
  }
  
  if (fieldError.type === 'maxLength') {
    return `Must be at most ${fieldError.maxLength} characters`;
  }
  
  if (fieldError.type === 'min') {
    return `Must be at least ${fieldError.min}`;
  }
  
  if (fieldError.type === 'max') {
    return `Must be at most ${fieldError.max}`;
  }
  
  return 'Invalid value';
}

/**
 * Debounce a function call
 * @param func The function to debounce
 * @param wait The number of milliseconds to wait
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function call
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
