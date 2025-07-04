import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { 
  SpotifyTrack, 
  SpotifyArtist, 
  SpotifyRecentlyPlayedItem,
  SpotifyTopTracksResponse,
  SpotifyTopArtistsResponse,
  SpotifyRecentlyPlayedResponse,
  ListeningStats 
} from "@/types/spotify"

// Spotify Web API Base URL
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'

// Rate limiting configuration
const RATE_LIMIT_DELAY = 100 // ms between requests
let lastRequestTime = 0

// Rate limiting helper
const withRateLimit = async () => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()
}

// Error classes for better error handling
export class SpotifyAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'SpotifyAPIError'
  }
}

export class SpotifyAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SpotifyAuthError'
  }
}

// Helper function to get user access token
export async function getUserAccessToken(): Promise<string> {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.accessToken) {
    throw new SpotifyAuthError('No valid session or access token found')
  }
  
  return session.accessToken
}

// Generic API request function with error handling
async function spotifyRequest<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  await withRateLimit()
  
  const url = `${SPOTIFY_API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle specific Spotify API errors
      switch (response.status) {
        case 401:
          throw new SpotifyAuthError('Access token expired or invalid')
        case 403:
          throw new SpotifyAPIError('Insufficient permissions or forbidden', response.status)
        case 429:
          const retryAfter = response.headers.get('Retry-After') || '1'
          throw new SpotifyAPIError(`Rate limited. Retry after ${retryAfter} seconds`, response.status)
        case 404:
          throw new SpotifyAPIError('Resource not found', response.status)
        case 500:
        case 502:
        case 503:
          throw new SpotifyAPIError('Spotify service temporarily unavailable', response.status)
        default:
          throw new SpotifyAPIError(
            errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.error?.reason
          )
      }
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof SpotifyAPIError || error instanceof SpotifyAuthError) {
      throw error
    }
    
    // Network or other errors
    throw new SpotifyAPIError(
      `Network error or unexpected issue: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// Helper function to validate time range
function validateTimeRange(timeRange: string): 'short_term' | 'medium_term' | 'long_term' {
  const validRanges = ['short_term', 'medium_term', 'long_term'] as const
  if (!validRanges.includes(timeRange as any)) {
    throw new Error(`Invalid time range: ${timeRange}. Must be one of: ${validRanges.join(', ')}`)
  }
  return timeRange as 'short_term' | 'medium_term' | 'long_term'
}

// Helper function to validate limit
function validateLimit(limit: number): number {
  const validLimits = [10, 25, 50, 100]
  if (!validLimits.includes(limit)) {
    throw new Error(`Invalid limit: ${limit}. Must be one of: ${validLimits.join(', ')}`)
  }
  return limit
}

// Data formatting helpers
export const formatters = {
  // Format track data for display
  formatTrack: (track: SpotifyTrack, index: number): FormattedTrack => ({
    id: track.id,
    rank: index + 1,
    name: track.name,
    artists: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '/placeholder-album.png',
    duration: track.duration_ms,
    popularity: track.popularity,
    preview_url: track.preview_url,
    external_url: track.external_urls.spotify,
    uri: track.uri
  }),
  
  // Format artist data for display
  formatArtist: (artist: SpotifyArtist, index: number): FormattedArtist => ({
    id: artist.id,
    rank: index + 1,
    name: artist.name,
    genres: artist.genres,
    followers: artist.followers.total,
    popularity: artist.popularity,
    image: artist.images[0]?.url || '/placeholder-artist.png',
    external_url: artist.external_urls.spotify,
    uri: artist.uri
  }),
  
  // Format recently played item
  formatRecentlyPlayed: (item: SpotifyRecentlyPlayedItem): FormattedRecentlyPlayed => ({
    played_at: item.played_at,
    track: formatters.formatTrack(item.track, 0)
  }),
  
  // Format duration from milliseconds to readable string
  formatDuration: (ms: number): string => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  },
  
  // Format number with commas
  formatNumber: (num: number): string => {
    return num.toLocaleString()
  },
  
  // Format date for display
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Type definitions for formatted data
export interface FormattedTrack {
  id: string
  rank: number
  name: string
  artists: string
  album: string
  albumArt: string
  duration: number
  popularity: number
  preview_url: string | null
  external_url: string
  uri: string
}

export interface FormattedArtist {
  id: string
  rank: number
  name: string
  genres: string[]
  followers: number
  popularity: number
  image: string
  external_url: string
  uri: string
}

export interface FormattedRecentlyPlayed {
  played_at: string
  track: FormattedTrack
}

// Main API functions
export async function getTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 25
): Promise<FormattedTrack[]> {
  const accessToken = await getUserAccessToken()
  const validTimeRange = validateTimeRange(timeRange)
  const validLimit = validateLimit(limit)
  
  const endpoint = `/me/top/tracks?time_range=${validTimeRange}&limit=${validLimit}`
  
  try {
    const response = await spotifyRequest<SpotifyTopTracksResponse>(endpoint, accessToken)
    return response.items.map((track, index) => formatters.formatTrack(track, index))
  } catch (error) {
    console.error('Error fetching top tracks:', error)
    throw error
  }
}

export async function getTopArtists(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 25
): Promise<FormattedArtist[]> {
  const accessToken = await getUserAccessToken()
  const validTimeRange = validateTimeRange(timeRange)
  const validLimit = validateLimit(limit)
  
  const endpoint = `/me/top/artists?time_range=${validTimeRange}&limit=${validLimit}`
  
  try {
    const response = await spotifyRequest<SpotifyTopArtistsResponse>(endpoint, accessToken)
    return response.items.map((artist, index) => formatters.formatArtist(artist, index))
  } catch (error) {
    console.error('Error fetching top artists:', error)
    throw error
  }
}

export async function getRecentlyPlayed(limit: number = 25): Promise<FormattedRecentlyPlayed[]> {
  const accessToken = await getUserAccessToken()
  
  // Recently played has a max limit of 50
  const validLimit = Math.min(Math.max(1, limit), 50)
  const endpoint = `/me/player/recently-played?limit=${validLimit}`
  
  try {
    const response = await spotifyRequest<SpotifyRecentlyPlayedResponse>(endpoint, accessToken)
    return response.items.map(item => formatters.formatRecentlyPlayed(item))
  } catch (error) {
    console.error('Error fetching recently played:', error)
    throw error
  }
}

export async function getListeningStats(): Promise<ListeningStats> {
  try {
    // Get data from multiple endpoints to calculate stats
    const [
      shortTermTracks,
      mediumTermTracks,
      longTermTracks,
      shortTermArtists,
      mediumTermArtists,
      longTermArtists,
      recentlyPlayed
    ] = await Promise.all([
      getTopTracks('short_term', 50),
      getTopTracks('medium_term', 50),
      getTopTracks('long_term', 50),
      getTopArtists('short_term', 50),
      getTopArtists('medium_term', 50),
      getTopArtists('long_term', 50),
      getRecentlyPlayed(50)
    ])
    
    // Calculate statistics
    const totalTracks = new Set([
      ...shortTermTracks.map(t => t.id),
      ...mediumTermTracks.map(t => t.id),
      ...longTermTracks.map(t => t.id)
    ]).size
    
    const totalArtists = new Set([
      ...shortTermArtists.map(a => a.id),
      ...mediumTermArtists.map(a => a.id),
      ...longTermArtists.map(a => a.id)
    ]).size
    
    // Calculate total listening time (estimate based on track duration)
    const estimatedListeningTime = [
      ...shortTermTracks,
      ...mediumTermTracks,
      ...longTermTracks
    ].reduce((total, track) => total + track.duration, 0)
    
    // Get top genres from artists
    const allGenres = [
      ...shortTermArtists,
      ...mediumTermArtists,
      ...longTermArtists
    ].flatMap(artist => artist.genres)
    
    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([genre, count]) => ({ 
        genre, 
        count, 
        percentage: Math.round((count / allGenres.length) * 100) 
      }))
    
    return {
      totalTracks,
      totalArtists,
      totalListeningTime: estimatedListeningTime,
      averageTrackLength: Math.round(estimatedListeningTime / totalTracks) || 0,
      topGenres,
      audioFeatureAverages: {
        danceability: 0, // These would need audio features API calls
        energy: 0,
        valence: 0,
        acousticness: 0,
        instrumentalness: 0,
        speechiness: 0,
        liveness: 0
      },
      timeDistribution: [], // Would need more detailed listening data
      discoveryScore: Math.round((totalArtists / totalTracks) * 100) || 0,
      yearInReview: {
        totalMinutes: Math.round(estimatedListeningTime / 60000),
        topMonth: new Date().toLocaleString('default', { month: 'long' }),
        totalGenres: Object.keys(genreCounts).length,
        minutesPerDay: Math.round(estimatedListeningTime / 60000 / 365)
      }
    }
  } catch (error) {
    console.error('Error calculating listening stats:', error)
    throw error
  }
}

// Utility function to refresh token if needed
export async function refreshTokenIfNeeded(): Promise<void> {
  // This would typically be handled by NextAuth automatically
  // but can be implemented if manual refresh is needed
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new SpotifyAuthError('No access token available for refresh')
  }
  
  // Check if token is close to expiry and refresh if needed
  // This is usually handled by NextAuth's JWT callback
}
