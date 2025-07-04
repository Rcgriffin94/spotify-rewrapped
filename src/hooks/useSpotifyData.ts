import { useState, useEffect, useCallback } from 'react';
import { FormattedTrack, FormattedArtist } from '@/lib/spotify-api';
import type { TopTracksApiResponse, ApiError } from '@/types/ui';

// Hook state interface
export interface UseSpotifyDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Top tracks hook
export function useTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term',
  limit: number,
  enabled: boolean = true
): UseSpotifyDataState<FormattedTrack[]> {
  const [data, setData] = useState<FormattedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: limit.toString()
      });

      const response = await fetch(`/api/spotify/top-tracks?${params}`);
      
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracks';
      setError(errorMessage);
      console.error('Error fetching top tracks:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}

// Top artists hook
export function useTopArtists(
  timeRange: 'short_term' | 'medium_term' | 'long_term',
  limit: number,
  enabled: boolean = true
): UseSpotifyDataState<FormattedArtist[]> {
  const [data, setData] = useState<FormattedArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: limit.toString()
      });

      const response = await fetch(`/api/spotify/top-artists?${params}`);
      
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artists';
      setError(errorMessage);
      console.error('Error fetching top artists:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
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

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });

      const url = `${endpoint}?${searchParams}`;
      const response = await fetch(url);
      
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error(`Error fetching data from ${endpoint}:`, err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, params, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
