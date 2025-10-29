import { useState, useEffect } from 'react';
import { Smartphone, Tablet, Laptop, Monitor, X, Maximize2, Minimize2 } from 'lucide-react';

// Common device presets
export const DEVICE_PRESETS = [
  {
    id: 'mobile',
    name: 'Mobile',
    width: 375,
    height: 812,
    icon: Smartphone,
  },
  {
    id: 'tablet',
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: Tablet,
  },
  {
    id: 'laptop',
    name: 'Laptop',
    width: 1024,
    height: 768,
    icon: Laptop,
  },
  {
    id: 'desktop',
    name: 'Desktop',
    width: 1440,
    height: 900,
    icon: Monitor,
  },
  {
    id: 'full',
    name: 'Full',
    width: '100%',
    height: '100%',
    icon: Maximize2,
  },
];

/**
 * Hook to get current viewport dimensions
 */
export function useViewport() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

/**
 * Component to display current breakpoint info
 */
export function BreakpointIndicator() {
  const { width } = useViewport();
  
  const getBreakpoint = () => {
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  };
  
  const breakpoint = getBreakpoint();
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full z-50 flex items-center space-x-2">
      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
      <span>{breakpoint.toUpperCase()} ({width}px)</span>
    </div>
  );
}

/**
 * Component to toggle device emulation
 */
export function DeviceEmulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState('full');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(console.error);
    }
    setIsFullscreen(!isFullscreen);
  };
  
  if (typeof window === 'undefined') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2">
          {DEVICE_PRESETS.map((device) => {
            const Icon = device.icon;
            return (
              <button
                key={device.id}
                onClick={() => setCurrentDevice(device.id)}
                className={`p-2 rounded ${
                  currentDevice === device.id 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={`${device.name} (${typeof device.width === 'number' ? `${device.width}×${device.height}` : 'Responsive'})`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
          title="Toggle device toolbar"
        >
          <Smartphone className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

/**
 * Component to display a grid overlay for layout debugging
 */
export function GridOverlay({ size = 8, color = 'rgba(0, 0, 0, 0.05)' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'g') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

/**
 * Component to display performance metrics
 */
export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    loadTime?: number;
    fcp?: number;
    lcp?: number;
    cls?: number;
  }>({});
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const getMetrics = () => {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;
      
      setMetrics({
        loadTime: timing.loadEventEnd - navigationStart,
        fcp: 0,
        lcp: 0,
        cls: 0,
      });
      
      if (typeof PerformanceObserver === 'function') {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach(entry => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }));
            } else if (entry.entryType === 'largest-contentful-paint') {
              setMetrics(prev => ({ ...prev, lcp: Math.round(entry.startTime) }));
            } else if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: ((prev.cls || 0) + (entry as any).value).toFixed(3) }));
            }
          });
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
        
        return () => observer.disconnect();
      }
    };
    
    if (document.readyState === 'complete') {
      getMetrics();
    } else {
      window.addEventListener('load', getMetrics);
      return () => window.removeEventListener('load', getMetrics);
    }
  }, []);
  
  if (Object.keys(metrics).length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-xs z-50 max-w-xs">
      <h3 className="font-semibold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        {metrics.loadTime && <div>Load Time: <span className="font-mono">{metrics.loadTime}ms</span></div>}
        {metrics.fcp && <div>First Paint: <span className="font-mono">{metrics.fcp}ms</span></div>}
        {metrics.lcp && <div>Largest Paint: <span className="font-mono">{metrics.lcp}ms</span></div>}
        {metrics.cls && <div>Layout Shift: <span className="font-mono">{metrics.cls}</span></div>}
      </div>
    </div>
  );
}
