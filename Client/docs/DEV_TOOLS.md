# Development Tools Guide

This document provides an overview of the development tools and utilities available in the CareerMap Solutions application for testing and debugging.

## Table of Contents
- [DevTools Panel](#devtools-panel)
- [Responsive Testing](#responsive-testing)
- [Performance Monitoring](#performance-monitoring)
- [Development Utilities](#development-utilities)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## DevTools Panel

The DevTools panel provides quick access to various development tools and can be toggled using the gear icon in the bottom-right corner of the screen (only visible in development mode).

### Accessing DevTools

1. In development mode, look for the gear icon (⚙️) in the bottom-right corner
2. Click the icon to open the DevTools panel
3. Use the tabs to navigate between different tools

## Responsive Testing

### Device Emulation

1. Open the DevTools panel
2. Go to the "Responsive" tab
3. Select a device preset from the dropdown or enter custom dimensions
4. The viewport will update to match the selected device

### Breakpoint Indicator

Toggle the breakpoint indicator to see the current breakpoint and viewport dimensions:

1. Open the DevTools panel
2. Click the "Breakpoints" button in the "Responsive" tab

### Grid Overlay

Toggle the grid overlay to help with layout alignment:

1. Open the DevTools panel
2. Click the "Grid" button in the "Responsive" tab

**Keyboard Shortcut:** `Ctrl+Alt+G` (Windows/Linux) or `Cmd+Option+G` (Mac)

## Performance Monitoring

### Real-time Metrics

The Performance tab in the DevTools panel displays real-time metrics including:

- **FPS**: Frames per second (higher is better)
- **Memory**: JavaScript heap usage
- **Load Time**: Page load performance metrics

### Manual Performance Testing

To manually test performance:

1. Open the browser's built-in developer tools (`F12` or right-click → Inspect)
2. Go to the "Performance" tab
3. Click the record button and interact with the page
4. Stop recording to analyze the results

## Development Utilities

### useDevTools Hook

Access development utilities programmatically using the `useDevTools` hook:

```typescript
import { useDevTools } from '@/components/dev/DevToolsProvider';

function MyComponent() {
  const { log, measure, profile } = useDevTools();
  
  // Log a message to the console
  log('Component mounted');
  
  // Measure function execution time
  const result = measure('Expensive calculation', () => {
    // Expensive operation
    return calculateSomething();
  });
  
  // Profile a function
  const profiledResult = profile('Profiled function', () => {
    // Code to profile
    return processData();
  });
  
  return <div>...</div>;
}
```

### withDevTools HOC

Wrap components with the `withDevTools` HOC to add development features:

```typescript
import { withDevTools } from '@/components/dev/DevToolsProvider';

function MyComponent() {
  return <div>My Component</div>;
}

export default withDevTools(MyComponent, { 
  // Optional configuration
  logProps: true,  // Log props changes
  logRender: true  // Log component renders
});
```

## Usage Examples

### Testing Responsive Layouts

1. Open the DevTools panel
2. Go to the "Responsive" tab
3. Select different device presets to test layouts
4. Toggle the grid overlay to check alignment
5. Use the breakpoint indicator to verify responsive breakpoints

### Debugging Performance Issues

1. Open the DevTools panel
2. Go to the "Performance" tab
3. Monitor FPS and memory usage while interacting with the app
4. Look for performance regressions or memory leaks
5. Use the browser's Performance tab for detailed analysis

### Using the useDevTools Hook

```typescript
import { useEffect } from 'react';
import { useDevTools } from '@/components/dev/DevToolsProvider';

function DataFetcher() {
  const { log, measure } = useDevTools();
  
  useEffect(() => {
    const fetchData = async () => {
      log('Fetching data...');
      
      const data = await measure('API call', async () => {
        const response = await fetch('/api/data');
        return response.json();
      });
      
      log('Data received:', data);
    };
    
    fetchData();
  }, [log, measure]);
  
  return <div>Loading data...</div>;
}
```

## Best Practices

1. **Keep DevTools in Development Only**
   - The DevTools are automatically removed in production builds
   - Use environment variables for feature flags if needed

2. **Performance Testing**
   - Test on lower-end devices for accurate performance metrics
   - Use the "CPU throttling" feature in browser dev tools to simulate slower devices

3. **Responsive Design**
   - Test on multiple device sizes and orientations
   - Pay attention to touch targets on mobile devices

4. **Security**
   - Never include sensitive information in debug logs
   - Be cautious when using the file system access features

5. **Clean Up**
   - Remove or disable debug code before committing
   - Use feature flags for development-only features

## Troubleshooting

### DevTools Not Appearing
- Ensure you're in development mode (`NODE_ENV=development`)
- Check the browser console for any errors
- Verify that the DevTools component is properly imported and rendered

### Performance Issues
- Close other tabs and applications to free up system resources
- Use the browser's performance profiler for detailed analysis
- Check for memory leaks in long-running applications

### Responsive Issues
- Clear your browser cache and hard reload the page
- Test in incognito/private mode to rule out extension conflicts
- Verify that viewport meta tags are correctly set in the HTML

---

For more information or to report issues, please refer to the project's documentation or contact the development team.
