import { 
  SpotifyTopTracksResponse, 
  SpotifyTopArtistsResponse, 
  SpotifyRecentlyPlayedResponse,
  SpotifyAudioFeatures,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyUser,
  SpotifyApiError,
  TimeRange,
  TopItemsParams,
  RecentlyPlayedParams
} from '@/types/spotify'

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1'

export class SpotifyApi {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error: SpotifyApiError = await response.json()
      throw new Error(`Spotify API error: ${error.error.status} ${error.error.message}`)
    }

    return response.json()
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.request<SpotifyUser>('/me')
  }

  async getTopTracks(params: TopItemsParams = {}): Promise<SpotifyTopTracksResponse> {
    const { time_range = 'medium_term', limit = 50, offset = 0 } = params
    return this.request<SpotifyTopTracksResponse>(
      `/me/top/tracks?time_range=${time_range}&limit=${limit}&offset=${offset}`
    )
  }

  async getTopArtists(params: TopItemsParams = {}): Promise<SpotifyTopArtistsResponse> {
    const { time_range = 'medium_term', limit = 50, offset = 0 } = params
    return this.request<SpotifyTopArtistsResponse>(
      `/me/top/artists?time_range=${time_range}&limit=${limit}&offset=${offset}`
    )
  }

  async getRecentlyPlayed(params: RecentlyPlayedParams = {}): Promise<SpotifyRecentlyPlayedResponse> {
    const { limit = 50, after, before } = params
    let query = `limit=${limit}`
    if (after) query += `&after=${after}`
    if (before) query += `&before=${before}`
    
    return this.request<SpotifyRecentlyPlayedResponse>(`/me/player/recently-played?${query}`)
  }

  async getAudioFeatures(trackIds: string[]): Promise<{ audio_features: (SpotifyAudioFeatures | null)[] }> {
    const ids = trackIds.join(',')
    return this.request<{ audio_features: (SpotifyAudioFeatures | null)[] }>(`/audio-features?ids=${ids}`)
  }

  async getTrack(id: string): Promise<SpotifyTrack> {
    return this.request<SpotifyTrack>(`/tracks/${id}`)
  }

  async getArtist(id: string): Promise<SpotifyArtist> {
    return this.request<SpotifyArtist>(`/artists/${id}`)
  }

  async getMultipleTracks(ids: string[]): Promise<{ tracks: SpotifyTrack[] }> {
    const trackIds = ids.join(',')
    return this.request<{ tracks: SpotifyTrack[] }>(`/tracks?ids=${trackIds}`)
  }

  async getMultipleArtists(ids: string[]): Promise<{ artists: SpotifyArtist[] }> {
    const artistIds = ids.join(',')
    return this.request<{ artists: SpotifyArtist[] }>(`/artists?ids=${artistIds}`)
  }

  // Helper method to get audio features for top tracks
  async getTopTracksWithAudioFeatures(params: TopItemsParams = {}): Promise<{
    tracks: SpotifyTopTracksResponse
    audioFeatures: (SpotifyAudioFeatures | null)[]
  }> {
    const tracks = await this.getTopTracks(params)
    const trackIds = tracks.items.map(track => track.id)
    const audioFeaturesResponse = await this.getAudioFeatures(trackIds)
    
    return {
      tracks,
      audioFeatures: audioFeaturesResponse.audio_features
    }
  }
}

export function createSpotifyApi(accessToken: string): SpotifyApi {
  return new SpotifyApi(accessToken)
}
