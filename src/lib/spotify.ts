import { SpotifyTopItemsResponse, SpotifyTrack, SpotifyArtist, SpotifyAudioFeatures, SpotifyRecentlyPlayed, TimeRange } from '@/types/spotify'

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
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCurrentUser() {
    return this.request('/me')
  }

  async getTopTracks(timeRange: TimeRange = 'medium_term', limit: number = 50): Promise<SpotifyTopItemsResponse<SpotifyTrack>> {
    return this.request(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`)
  }

  async getTopArtists(timeRange: TimeRange = 'medium_term', limit: number = 50): Promise<SpotifyTopItemsResponse<SpotifyArtist>> {
    return this.request(`/me/top/artists?time_range=${timeRange}&limit=${limit}`)
  }

  async getRecentlyPlayed(limit: number = 50): Promise<SpotifyRecentlyPlayed> {
    return this.request(`/me/player/recently-played?limit=${limit}`)
  }

  async getAudioFeatures(trackIds: string[]): Promise<{ audio_features: SpotifyAudioFeatures[] }> {
    const ids = trackIds.join(',')
    return this.request(`/audio-features?ids=${ids}`)
  }

  async getTrack(id: string): Promise<SpotifyTrack> {
    return this.request(`/tracks/${id}`)
  }

  async getArtist(id: string): Promise<SpotifyArtist> {
    return this.request(`/artists/${id}`)
  }
}

export function createSpotifyApi(accessToken: string): SpotifyApi {
  return new SpotifyApi(accessToken)
}
