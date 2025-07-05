'use client';

import { useEffect } from 'react';
import { 
  trackWebVitals, 
  setupErrorTracking, 
  useMemoryMonitor, 
  preloadCriticalResources,
  registerServiceWorker 
} from '@/lib/monitoring';

export function ProductionMonitoring() {
  useMemoryMonitor();

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Initialize monitoring
    trackWebVitals();
    setupErrorTracking();
    preloadCriticalResources();
    registerServiceWorker();
  }, []);

  return null; // This component doesn't render anything
}

export default ProductionMonitoring;
