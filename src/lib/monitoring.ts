// Performance monitoring and optimization utilities
import { useEffect, useCallback } from 'react';

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const { name } = entry;
      const value = (entry as any).value || (entry as any).duration || 0;
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name}: ${value}`);
      }
      
      // In production, you could send to analytics
      // analytics.track(name, { value });
    }
  });

  // Observe different metric types
  try {
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] });
  } catch (e) {
    // Some browsers might not support all entry types
    console.warn('Performance observer not fully supported:', e);
  }
};

// Image optimization helper
export const getOptimizedImageUrl = (
  originalUrl: string, 
  width: number, 
  height: number = width,
  quality: number = 75
): string => {
  // For Spotify images, we can't directly optimize them
  // But we can ensure proper sizing attributes are used
  return originalUrl;
};

// Bundle size monitoring
export const logBundleInfo = () => {
  if (typeof window === 'undefined') return;
  
  // Monitor the size of loaded resources
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(resource => 
    resource.name.includes('.js') && 
    !resource.name.includes('node_modules')
  );
  
  const totalJSSize = jsResources.reduce((total, resource) => 
    total + ((resource as any).transferSize || 0), 0
  );
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)} KB`);
  }
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) return;
    
    const logMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (process.env.NODE_ENV === 'development') {
        console.log('Memory usage:', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
        });
      }
    };

    // Log memory usage every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(logMemoryUsage, 30000);
      return () => clearInterval(interval);
    }
  }, []);
};

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    const updateConnectionType = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Update connection type on change
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionType);
      updateConnectionType(); // Initial check
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return { isOnline, connectionType };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const preloadFont = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  // Preload API endpoints that are likely to be used
  const preloadAPI = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  // Only preload in production to avoid interfering with development
  if (process.env.NODE_ENV === 'production') {
    // Preload likely API endpoints
    preloadAPI('/api/spotify/top-tracks');
    preloadAPI('/api/spotify/top-artists');
  }
};

// Service Worker registration for offline support
export const registerServiceWorker = async () => {
  if (
    typeof window === 'undefined' || 
    !('serviceWorker' in navigator) ||
    process.env.NODE_ENV !== 'production'
  ) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered: ', registration);
  } catch (registrationError) {
    console.log('SW registration failed: ', registrationError);
  }
};

// Error tracking and reporting
export const setupErrorTracking = () => {
  if (typeof window === 'undefined') return;

  // Global error handler
  window.addEventListener('error', (event) => {
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', errorInfo);
    }

    // In production, you could send to error tracking service
    // errorTrackingService.log(errorInfo);
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo = {
      reason: event.reason,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled promise rejection:', errorInfo);
    }

    // In production, send to error tracking service
    // errorTrackingService.log(errorInfo);
  });
};

import { useState } from 'react';
