/**
 * Performance Monitoring Utilities
 * 
 * Lightweight utilities for monitoring and analyzing application performance.
 */

// Performance metrics interface
type PerformanceMetrics = {
  loadTime: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  tbt: number; // Total Blocking Time
  tti: number; // Time to Interactive
};

/**
 * Collects performance metrics from the browser's Performance API
 */
export function collectPerformanceMetrics(): PerformanceMetrics | null {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const { performance, PerformanceObserver } = window;
  const timing = performance.timing;
  const navigationStart = timing.navigationStart;
  
  const metrics: PerformanceMetrics = {
    loadTime: timing.loadEventEnd - navigationStart,
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    tbt: 0,
    tti: 0,
  };
  
  if (typeof PerformanceObserver === 'function') {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          metrics.fcp = Math.round(entry.startTime);
        } else if (entry.entryType === 'largest-contentful-paint') {
          metrics.lcp = Math.round(entry.startTime);
        } else if (entry.entryType === 'first-input') {
          metrics.fid = Math.round(entry.processingStart - entry.startTime);
        } else if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          metrics.cls += entry.value;
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    
    // Estimate TTI and TBT
    const longTasks = performance.getEntriesByType('longtask');
    metrics.tbt = longTasks.reduce((sum, task) => sum + task.duration - 50, 0);
    metrics.tti = timing.domContentLoadedEventEnd - navigationStart;
  }
  
  return metrics;
}

/**
 * Logs performance metrics to the console
 */
export function logPerformanceMetrics() {
  if (process.env.NODE_ENV === 'production') return;
  
  const metrics = collectPerformanceMetrics();
  if (!metrics) return;
  
  console.group('Performance Metrics');
  console.table({
    'Load Time': `${metrics.loadTime}ms`,
    'First Contentful Paint': `${metrics.fcp}ms`,
    'Largest Contentful Paint': `${metrics.lcp}ms`,
    'First Input Delay': `${metrics.fid}ms`,
    'Cumulative Layout Shift': metrics.cls.toFixed(3),
    'Total Blocking Time': `${Math.round(metrics.tbt)}ms`,
    'Time to Interactive': `${metrics.tti}ms`
  });
  console.groupEnd();
}

// Log metrics when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(logPerformanceMetrics, 1000);
  });
}
