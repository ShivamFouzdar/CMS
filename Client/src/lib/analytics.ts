// Analytics utility for tracking user interactions and page views
// Supports Google Analytics (GA4) and Hotjar out of the box

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Google Analytics configuration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    hj?: (...args: any[]) => void;
    _hjSettings?: {
      hjid: string;
      hjsv: number;
    };
  }
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Check if Google Analytics is available
const isGAvailable = isBrowser && typeof window.gtag === 'function';

// Check if Hotjar is available
const isHotjarAvailable = isBrowser && typeof window.hj === 'function';

/**
 * Initialize analytics services
 */
export function initAnalytics() {
  if (!isBrowser) return;

  // Initialize Google Analytics if available
  if (isGAvailable && window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
      page_path: window.location.pathname,
      send_page_view: false, // We'll handle page views manually
    });
  }

  // Initialize Hotjar if available
  if (isHotjarAvailable && import.meta.env.VITE_HOTJAR_ID) {
    const hotjarId = import.meta.env.VITE_HOTJAR_ID;
    const hotjarVersion = 6; // Hotjar tracking code version
    
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: hotjarId, hjsv: hotjarVersion };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }
}

/**
 * Track a page view
 * @param path - The path of the page (defaults to current path)
 * @param title - The title of the page (defaults to document title)
 */
export function trackPageView(path?: string, title?: string) {
  if (!isBrowser) return;

  const pagePath = path || window.location.pathname;
  const pageTitle = title || document.title;

  // Google Analytics
  if (isGAvailable && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  // Hotjar
  if (isHotjarAvailable && window.hj) {
    window.hj('stateChange', pagePath);
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] Page view: ${pageTitle} (${pagePath})`);
  }
}

/**
 * Track an event
 * @param event - The event to track
 */
export function trackEvent(event: AnalyticsEvent) {
  if (!isBrowser) return;

  const { action, category, label, value, ...rest } = event;

  // Google Analytics
  if (isGAvailable && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }

  // Hotjar
  if (isHotjarAvailable && window.hj) {
    window.hj('event', `${category}_${action}`, {
      label,
      value,
      ...rest,
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics] Event:', { action, category, label, value, ...rest });
  }
}

/**
 * Track a form submission
 * @param formId - The ID of the form
 * @param formName - The name of the form (optional)
 */
export function trackFormSubmission(formId: string, formName?: string) {
  trackEvent({
    action: 'form_submit',
    category: 'Form',
    label: formName || formId,
    form_id: formId,
    form_name: formName,
  });
}

/**
 * Track a button click
 * @param buttonId - The ID of the button
 * @param buttonText - The text of the button (optional)
 */
export function trackButtonClick(buttonId: string, buttonText?: string) {
  trackEvent({
    action: 'button_click',
    category: 'UI',
    label: buttonText || buttonId,
    button_id: buttonId,
    button_text: buttonText,
  });
}

/**
 * Track an outbound link click
 * @param url - The URL being linked to
 * @param linkText - The text of the link (optional)
 */
export function trackOutboundLink(url: string, linkText?: string) {
  trackEvent({
    action: 'outbound_link_click',
    category: 'Outbound Link',
    label: url,
    link_url: url,
    link_text: linkText,
  });

  // For external links, we'll open in a new tab after a short delay
  // to allow the event to be tracked
  if (isBrowser) {
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
    return false;
  }
}

/**
 * Track a file download
 * @param fileName - The name of the file being downloaded
 * @param fileType - The type of the file (e.g., 'pdf', 'docx')
 */
export function trackFileDownload(fileName: string, fileType: string) {
  trackEvent({
    action: 'file_download',
    category: 'Download',
    label: fileName,
    file_name: fileName,
    file_type: fileType,
  });
}

/**
 * Track a search query
 * @param query - The search query
 * @param resultCount - The number of results (optional)
 */
export function trackSearch(query: string, resultCount?: number) {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: query,
    search_term: query,
    search_results_count: resultCount,
  });
}

// Export types for use in other files
export type { AnalyticsEvent };
