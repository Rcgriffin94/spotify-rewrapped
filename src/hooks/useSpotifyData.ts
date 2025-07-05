import { useState, useEffect, useCallback, useRef } from 'react';
import { FormattedTrack, FormattedArtist } from '@/lib/spotify-api';
import type { TopTracksApiResponse, ApiError } from '@/types/ui';

// Hook state interface
export interface UseSpotifyDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  retryCount: number;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2,
  retryableErrors: ['NETWORK_ERROR', 'SERVER_ERROR', 'TIMEOUT', 'RATE_LIMITED']
};

// Helper function for retry delay with exponential backoff
const delay = (ms: number, attempt: number) => {
  const backoffMs = ms * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  const maxDelay = 10000; // 10 seconds max
  return new Promise(resolve => setTimeout(resolve, Math.min(backoffMs, maxDelay)));
};

// Helper function to determine if error is retryable
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504') ||
      message.includes('rate limit')
    );
  }
  return false;
};

// Top tracks hook
export function useTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term' | 'custom',
  limit: number,
  enabled: boolean = true,
  startDate?: string,
  endDate?: string
): UseSpotifyDataState<FormattedTrack[]> {
  const [data, setData] = useState<FormattedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (retryAttempt: number = 0) => {
    if (!enabled) return;
    
    // For custom time range, validate that both dates are provided and not empty
    if (timeRange === 'custom' && (!startDate || !endDate || startDate === '' || endDate === '')) {
      // Don't show error, just don't fetch yet - user might still be selecting dates
      setError(null);
      setIsLoading(false);
      setRetryCount(0);
      return;
    }

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setRetryCount(retryAttempt);

    try {
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: limit.toString()
      });

      // Add date parameters for custom range
      if (timeRange === 'custom' && startDate && endDate) {
        params.append('start_date', startDate);
        params.append('end_date', endDate);
      }

      const response = await fetch(`/api/spotify/top-tracks?${params}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData: TopTracksApiResponse = await response.json();
      setData(responseData.data.tracks);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracks';
      
      // Retry logic for non-client errors
      if (retryAttempt < RETRY_CONFIG.maxRetries && 
          err instanceof Error && 
          !errorMessage.includes('401') && // Don't retry auth errors
          !errorMessage.includes('403')) {  // Don't retry forbidden errors
        
        const delayMs = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryAttempt);
        await delay(delayMs, retryAttempt);
        
        // Check if component is still mounted before retrying
        if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
          return fetchData(retryAttempt + 1);
        }
      }

      setError(errorMessage);
      console.error('Error fetching top tracks:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, limit, enabled, startDate, endDate]);

  const refetch = useCallback(async () => {
    await fetchData(0);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    retryCount
  };
}

// Top artists hook
export function useTopArtists(
  timeRange: 'short_term' | 'medium_term' | 'long_term' | 'custom',
  limit: number,
  enabled: boolean = true,
  startDate?: string,
  endDate?: string
): UseSpotifyDataState<FormattedArtist[]> {
  const [data, setData] = useState<FormattedArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (retryAttempt: number = 0) => {
    if (!enabled) return;
    
    // For custom time range, validate that both dates are provided and not empty
    if (timeRange === 'custom' && (!startDate || !endDate || startDate === '' || endDate === '')) {
      // Don't show error, just don't fetch yet - user might still be selecting dates
      setError(null);
      setIsLoading(false);
      setRetryCount(0);
      return;
    }

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setRetryCount(retryAttempt);

    try {
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: limit.toString()
      });

      // Add date parameters for custom range
      if (timeRange === 'custom' && startDate && endDate) {
        params.append('start_date', startDate);
        params.append('end_date', endDate);
      }

      const response = await fetch(`/api/spotify/top-artists?${params}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setData(responseData.data.artists);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artists';
      
      // Retry logic for non-client errors
      if (retryAttempt < RETRY_CONFIG.maxRetries && 
          err instanceof Error && 
          !errorMessage.includes('401') && // Don't retry auth errors
          !errorMessage.includes('403')) {  // Don't retry forbidden errors
        
        const delayMs = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryAttempt);
        await delay(delayMs, retryAttempt);
        
        // Check if component is still mounted before retrying
        if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
          return fetchData(retryAttempt + 1);
        }
      }

      setError(errorMessage);
      console.error('Error fetching top artists:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, limit, enabled, startDate, endDate]);

  const refetch = useCallback(async () => {
    await fetchData(0);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    retryCount
  };
}

// Generic Spotify data hook for future use
export function useSpotifyData<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  enabled: boolean = true
): UseSpotifyDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (retryAttempt: number = 0) => {
    if (!enabled) return;

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setRetryCount(retryAttempt);

    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });

      const url = `${endpoint}?${searchParams}`;
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setData(responseData.data || responseData);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      
      // Retry logic for non-client errors
      if (retryAttempt < RETRY_CONFIG.maxRetries && 
          err instanceof Error && 
          !errorMessage.includes('401') && // Don't retry auth errors
          !errorMessage.includes('403')) {  // Don't retry forbidden errors
        
        const delayMs = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryAttempt);
        await delay(delayMs, retryAttempt);
        
        // Check if component is still mounted before retrying
        if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
          return fetchData(retryAttempt + 1);
        }
      }

      setError(errorMessage);
      console.error(`Error fetching data from ${endpoint}:`, err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, params, enabled]);

  const refetch = useCallback(async () => {
    await fetchData(0);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    retryCount
  };
}
