/**
 * Responsive Testing Utilities
 * 
 * This module provides utilities for testing and debugging responsive designs.
 * It includes components and functions to help identify and fix responsive issues.
 */

import { useEffect, useState } from 'react';
import { X, Smartphone, Tablet, Laptop, Monitor, Maximize2, Minimize2 } from 'lucide-react';

/**
 * Available device presets for responsive testing
 */
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

type ResponsiveTesterProps = {
  /**
   * Whether the tester is active
   * @default false
   */
  isActive?: boolean;
  
  /**
   * Callback when the tester is toggled
   */
  onToggle?: (isActive: boolean) => void;
  
  /**
   * The default device preset ID to use
   * @default 'responsive'
   */
  defaultDevice?: string;
};

/**
 * A component that helps test responsive designs by simulating different device sizes
 */
export function ResponsiveTester({
  isActive: externalIsActive,
  onToggle,
  defaultDevice = 'responsive',
}: ResponsiveTesterProps) {
  const [isControlled] = useState(externalIsActive !== undefined);
  const [isActive, setIsActive] = useState(externalIsActive ?? false);
  const [currentDevice, setCurrentDevice] = useState(defaultDevice);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [originalStyles, setOriginalStyles] = useState<{
    position: string;
    width: string;
    height: string;
    margin: string;
    overflow: string;
  } | null>(null);
  
  // Handle both controlled and uncontrolled state
  const active = isControlled ? externalIsActive : isActive;
  
  // Toggle the responsive tester
  const toggleTester = () => {
    const newActive = !active;
    if (!isControlled) {
      setIsActive(newActive);
    }
    onToggle?.(newActive);
  };
  
  // Apply responsive styles to the preview iframe
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const iframe = document.getElementById('responsive-preview-iframe') as HTMLIFrameElement | null;
    if (!iframe) return;
    
    if (!active) {
      // Reset styles when deactivating
      if (originalStyles) {
        Object.assign(iframe.style, originalStyles);
      }
      return;
    }
    
    // Save original styles if not already saved
    if (!originalStyles) {
      setOriginalStyles({
        position: iframe.style.position,
        width: iframe.style.width,
        height: iframe.style.height,
        margin: iframe.style.margin,
        overflow: iframe.style.overflow,
      });
    }
    
    // Apply responsive styles
    const device = DEVICE_PRESETS.find(d => d.id === currentDevice) || DEVICE_PRESETS[0];
    
    if (currentDevice === 'full') {
      // Full viewport
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.margin = '0';
      iframe.style.border = 'none';
      iframe.style.zIndex = '9999';
      iframe.style.overflow = 'auto';
    } else {
      // Device-specific view
      iframe.style.position = 'fixed';
      iframe.style.top = '50%';
      iframe.style.left = '50%';
      iframe.style.width = `${device.width}px`;
      iframe.style.height = `${device.height}px`;
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.border = '16px solid #1f2937';
      iframe.style.borderRadius = '32px';
      iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
      iframe.style.zIndex = '9999';
      iframe.style.overflow = 'hidden';
      iframe.style.backgroundColor = 'white';
    }
    
    // Cleanup function to reset styles
    return () => {
      if (originalStyles) {
        Object.assign(iframe.style, originalStyles);
      }
    };
  }, [active, currentDevice, originalStyles]);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    
    const iframe = document.getElementById('responsive-preview-iframe') as HTMLIFrameElement | null;
    if (!iframe) return;
    
    if (newFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    }
  };
  
  // Don't render anything on the server
  if (typeof document === 'undefined') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[10000] flex flex-col items-end space-y-2">
      {/* Device selector */}
      {active && (
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 space-x-2">
          {DEVICE_PRESETS.map((device) => {
            const Icon = device.icon;
            return (
              <button
                key={device.id}
                onClick={() => setCurrentDevice(device.id)}
                className={`p-2 rounded-md transition-colors ${currentDevice === device.id ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                title={`${device.name} (${typeof device.width === 'number' ? `${device.width}×${device.height}` : 'Responsive'})`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
          
          <button
            onClick={toggleTester}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            title="Close responsive tester"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Toggle button */}
      {!active && (
        <button
          onClick={toggleTester}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
          title="Open responsive tester"
        >
          <Smartphone className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

/**
 * A component that wraps your app to enable responsive testing
 */
type ResponsiveTestWrapperProps = {
  children: React.ReactNode;
  
  /**
   * Whether the responsive tester is enabled by default
   * @default false
   */
  enabledByDefault?: boolean;
};

export function ResponsiveTestWrapper({
  children,
  enabledByDefault = false,
}: ResponsiveTestWrapperProps) {
  const [isTesterActive, setIsTesterActive] = useState(enabledByDefault);
  
  return (
    <>
      {children}
      <ResponsiveTester 
        isActive={isTesterActive} 
        onToggle={setIsTesterActive} 
      />
    </>
  );
}

/**
 * A hook to get the current viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return viewport;
}

/**
 * A component that displays the current viewport size for debugging
 */
export function ViewportSize() {
  const { width, height } = useViewport();
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs px-2 py-1 rounded z-50">
      {width} × {height}px
    </div>
  );
}

/**
 * A component that renders a grid overlay for visual alignment testing
 */
type GridOverlayProps = {
  /**
   * The grid size in pixels
   * @default 8
   */
  size?: number;
  
  /**
   * The grid color
   * @default 'rgba(0, 0, 0, 0.05)'
   */
  color?: string;
  
  /**
   * Whether to show the grid by default
   * @default false
   */
  defaultVisible?: boolean;
};

export function GridOverlay({
  size = 8,
  color = 'rgba(0, 0, 0, 0.05)',
  defaultVisible = false,
}: GridOverlayProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const { width } = useViewport();
  
  // Toggle grid visibility with Ctrl+Alt+G (Cmd+Alt+G on Mac)
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
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

/**
 * A component that adds a visual outline to all elements for debugging layout
 */
export function DebugLayout() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = `
      *:not(g):not(path):not(rect) {
        outline: 1px solid rgba(255, 0, 0, 0.1) !important;
      }
    `;
    
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
}

/**
 * A component that shows the current breakpoint
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
