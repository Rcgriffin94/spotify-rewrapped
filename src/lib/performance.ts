import React, { useState, useEffect, useCallback, useRef } from 'react';

// Performance utilities

// Debounce hook for search/filter inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll events, etc.
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastExecuted, setLastExecuted] = useState<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted + delay) {
      setThrottledValue(value);
      setLastExecuted(Date.now());
    } else {
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        setLastExecuted(Date.now());
      }, delay);

      return () => clearTimeout(timerId);
    }
  }, [value, delay, lastExecuted]);

  return throttledValue;
}

// Image optimization utility
export const optimizedImageProps = (src: string, alt: string, priority: boolean = false) => ({
  src,
  alt,
  loading: priority ? 'eager' as const : 'lazy' as const,
  decoding: 'async' as const,
  ...(priority && { priority: true })
});

// Local storage with error handling
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to get from localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to set localStorage:', error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }
};

// Session storage cache for API responses
export const apiCache = {
  get: <T>(key: string): T | null => {
    try {
      const cached = sessionStorage.getItem(`api_cache_${key}`);
      if (!cached) return null;
      
      const { data, timestamp, ttl } = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - timestamp > ttl) {
        sessionStorage.removeItem(`api_cache_${key}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to get from cache:', error);
      return null;
    }
  },
  
  set: <T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): boolean => { // 5 minutes default
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs
      };
      
      sessionStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.warn('Failed to set cache:', error);
      return false;
    }
  },
  
  clear: (pattern?: string): void => {
    try {
      const keys = Object.keys(sessionStorage);
      const prefix = `api_cache_${pattern || ''}`;
      
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
};

// Performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  },
  
  markEnd: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  },
  
  getMeasures: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      return performance.getEntriesByType('measure');
    }
    return [];
  }
};

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}
