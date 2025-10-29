import { useEffect, ReactNode, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
  /**
   * Whether to track page views automatically when the route changes
   * @default true
   */
  trackPageViews?: boolean;
  
  /**
   * Whether to track initial page view
   * @default true
   */
  trackInitialPageView?: boolean;
  
  /**
   * Whether to track page views on route changes
   * @default true
   */
  trackOnRouteChange?: boolean;
  
  /**
   * Whether to enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * AnalyticsProvider initializes and manages analytics for the application.
 * It handles page view tracking and provides analytics context to child components.
 */
export function AnalyticsProvider({
  children,
  trackPageViews = true,
  trackInitialPageView = true,
  trackOnRouteChange = true,
  debug = false,
}: AnalyticsProviderProps) {
  const location = useLocation();
  
  // Initialize analytics on mount
  useEffect(() => {
    if (debug) {
      console.log('[Analytics] Initializing analytics...');
    }
    
    try {
      initAnalytics();
      
      if (trackPageViews && trackInitialPageView) {
        trackPageView();
      }
      
      if (debug) {
        console.log('[Analytics] Analytics initialized');
      }
    } catch (error) {
      console.error('[Analytics] Failed to initialize analytics:', error);
    }
    
    // Cleanup function
    return () => {
      // Any cleanup code if needed
    };
  }, [debug, trackPageViews, trackInitialPageView]);
  
  // Track page views when the route changes
  useEffect(() => {
    if (!trackPageViews || !trackOnRouteChange) return;
    
    if (debug) {
      console.log(`[Analytics] Route changed to: ${location.pathname}`);
    }
    
    // Use setTimeout to ensure the page title is updated before tracking
    const timer = setTimeout(() => {
      trackPageView();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname, trackPageViews, trackOnRouteChange, debug]);
  
  // Provide analytics context to children
  return <>{children}</>;
}

/**
 * A higher-order component that wraps a component with AnalyticsProvider
 * @param WrappedComponent - The component to wrap
 * @param props - Props to pass to AnalyticsProvider
 */
export function withAnalytics<P>(
  WrappedComponent: React.ComponentType<P>,
  props?: Omit<AnalyticsProviderProps, 'children'>
) {
  return function WithAnalytics(wrappedProps: P) {
    return (
      <AnalyticsProvider {...props}>
        <WrappedComponent {...wrappedProps} />
      </AnalyticsProvider>
    );
  };
}

export default AnalyticsProvider;
