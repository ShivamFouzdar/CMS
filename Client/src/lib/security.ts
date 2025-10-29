/**
 * Security and Privacy Utilities
 * 
 * This module provides functions for handling security and privacy-related functionality,
 * including GDPR compliance, cookie consent, and secure data handling.
 */

import { trackEvent } from './analytics';

// Cookie names
const COOKIE_NAMES = {
  CONSENT: 'cookie_consent',
  PREFERENCES: 'cookie_preferences',
  SESSION: 'session_id',
  CSRF: 'csrftoken',
} as const;

// Cookie consent options
type CookieConsentOptions = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

// Default cookie consent options
const DEFAULT_CONSENT: CookieConsentOptions = {
  necessary: true, // Required for the site to function
  preferences: false,
  analytics: false,
  marketing: false,
};

/**
 * Check if the current connection is secure (HTTPS)
 * @returns boolean indicating if the connection is secure
 */
export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:';
}

/**
 * Set a secure cookie with proper attributes
 * @param name Cookie name
 * @param value Cookie value
 * @param daysUntilExpire Number of days until the cookie expires (default: 30)
 * @param sameSite SameSite attribute ('Strict', 'Lax', or 'None')
 */
export function setSecureCookie(
  name: string,
  value: string,
  daysUntilExpire = 30,
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax'
): void {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + daysUntilExpire * 24 * 60 * 60 * 1000);
  
  const expires = `expires=${date.toUTCString()}`;
  const secure = isSecureConnection() ? 'Secure; ' : '';
  const sameSiteAttr = sameSite ? `; SameSite=${sameSite}` : '';
  
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; ${secure}${sameSiteAttr}`;
}

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  
  return null;
}

/**
 * Delete a cookie by name
 * @param name Cookie name
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * Get the current cookie consent preferences
 * @returns Cookie consent options
 */
export function getCookieConsent(): CookieConsentOptions {
  if (typeof localStorage === 'undefined') return DEFAULT_CONSENT;
  
  try {
    const savedConsent = localStorage.getItem(COOKIE_NAMES.CONSENT);
    return savedConsent ? JSON.parse(savedConsent) : { ...DEFAULT_CONSENT };
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return { ...DEFAULT_CONSENT };
  }
}

/**
 * Save cookie consent preferences
 * @param consent Cookie consent options
 */
export function saveCookieConsent(consent: Partial<CookieConsentOptions>): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const currentConsent = getCookieConsent();
    const newConsent = { ...currentConsent, ...consent };
    
    // Always allow necessary cookies
    newConsent.necessary = true;
    
    localStorage.setItem(COOKIE_NAMES.CONSENT, JSON.stringify(newConsent));
    
    // Track the consent update in analytics if analytics are enabled
    if (newConsent.analytics) {
      trackEvent('cookie_consent_updated', {
        preferences: newConsent.preferences,
        analytics: newConsent.analytics,
        marketing: newConsent.marketing,
      });
    }
    
    // Set a cookie to remember the consent on the server side
    setSecureCookie(COOKIE_NAMES.CONSENT, 'true', 365, 'Strict');
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
}

/**
 * Check if the current page is being loaded in an iframe
 * @returns boolean indicating if the page is in an iframe
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    // Accessing window.top may throw an exception if the iframe is cross-origin
    return true;
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param html HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
  if (typeof DOMPurify !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }
  
  // Fallback for server-side rendering or if DOMPurify is not available
  return html.replace(/[<>]/g, (tag) => ({
    '<': '&lt;',
    '>': '&gt;',
  }[tag] || tag));
}

/**
 * Generate a CSRF token
 * @returns A random CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get the CSRF token from cookies
 * @returns CSRF token or null if not found
 */
export function getCSRFToken(): string | null {
  return getCookie(COOKIE_NAMES.CSRF);
}

/**
 * Initialize CSRF protection
 * This should be called when the application loads
 */
export function initCSRFProtection(): void {
  // Only set the CSRF token if it doesn't exist
  if (!getCSRFToken()) {
    const token = generateCSRFToken();
    setSecureCookie(COOKIE_NAMES.CSRF, token, 1, 'Strict');
  }
}

/**
 * Get the current session ID
 * @returns Session ID or null if not found
 */
export function getSessionId(): string | null {
  return getCookie(COOKIE_NAMES.SESSION);
}

/**
 * Mask sensitive data (e.g., for logging)
 * @param data The data to mask
 * @param fields Fields to mask
 * @returns Masked data
 */
export function maskSensitiveData<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[]
): T {
  const masked = { ...data };
  
  for (const field of fields) {
    if (field in masked && masked[field] !== undefined) {
      const value = String(masked[field]);
      masked[field] = '*'.repeat(Math.min(value.length, 10)) as any;
    }
  }
  
  return masked;
}

/**
 * Check if the current environment is production
 * @returns boolean indicating if the environment is production
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Sanitize a URL to prevent XSS and open redirect vulnerabilities
 * @param url The URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    
    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }
    
    // Prevent javascript: and data: URLs
    if (parsedUrl.protocol === 'javascript:' || parsedUrl.protocol === 'data:') {
      return null;
    }
    
    return parsedUrl.toString();
  } catch (e) {
    return null;
  }
}

/**
 * Add security headers to a response (for server-side rendering)
 * @param headers Headers object to modify
 */
export function addSecurityHeaders(headers: Headers): void {
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https://www.google-analytics.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://www.google-analytics.com; " +
    "frame-ancestors 'self'; " +
    "form-action 'self';"
  );
  
  // X-Frame-Options
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // X-Content-Type-Options
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Feature-Policy (deprecated but still supported)
  headers.set(
    'Feature-Policy',
    "geolocation 'self'; microphone 'none'; camera 'none'"
  );
  
  // Permissions-Policy (replaces Feature-Policy)
  headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );
}

/**
 * Initialize security features
 * This should be called when the application loads
 */
export function initializeSecurity(): void {
  // Initialize CSRF protection
  initCSRFProtection();
  
  // Apply security headers (for server-side rendering)
  if (typeof document !== 'undefined') {
    // Add security headers to fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      const headers = new Headers(init.headers);
      addSecurityHeaders(headers);
      
      // Add CSRF token to all non-GET requests
      if (init.method && init.method.toUpperCase() !== 'GET') {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          headers.set('X-CSRF-Token', csrfToken);
        }
      }
      
      return originalFetch(input, {
        ...init,
        headers,
        credentials: 'same-origin',
      });
    };
  }
}

// Initialize security when this module is imported
if (typeof window !== 'undefined') {
  // Use requestIdleCallback if available, otherwise use setTimeout
  const scheduleTask = window.requestIdleCallback || ((fn) => setTimeout(fn, 0));
  scheduleTask(initializeSecurity);
}
