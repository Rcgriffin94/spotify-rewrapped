// Spotify API Response Types
export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
  followers: {
    total: number
  }
  country: string
}

export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  popularity: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  followers: {
    total: number
  }
  images: SpotifyImage[]
  external_urls: {
    spotify: string
  }
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: SpotifyArtist[]
  images: SpotifyImage[]
  release_date: string
  total_tracks: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  tracks: {
    total: number
    items: {
      track: SpotifyTrack
    }[]
  }
  external_urls: {
    spotify: string
  }
}

// Top Items Response
export interface SpotifyTopItemsResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  href: string
  next: string | null
  previous: string | null
}

// Time Range for Spotify API
export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

// Audio Features
export interface SpotifyAudioFeatures {
  id: string
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  duration_ms: number
  time_signature: number
}

// Recently Played
export interface SpotifyRecentlyPlayed {
  items: {
    track: SpotifyTrack
    played_at: string
    context: {
      type: string
      href: string | null
      external_urls: {
        spotify: string
      } | null
      uri: string
    } | null
  }[]
  next: string | null
  cursors: {
    after: string
    before: string
  }
  limit: number
  href: string
}

// App Types
export interface UserMusicData {
  topTracks: SpotifyTrack[]
  topArtists: SpotifyArtist[]
  recentlyPlayed: SpotifyRecentlyPlayed
  audioFeatures: SpotifyAudioFeatures[]
  timeRange: TimeRange
}

export interface MusicInsights {
  totalListeningTime: number
  averagePopularity: number
  topGenres: { genre: string; count: number }[]
  audioFeatureAverages: {
    danceability: number
    energy: number
    valence: number
    acousticness: number
  }
  discoveryScore: number
  yearInReview: {
    totalTracks: number
    totalArtists: number
    totalMinutes: number
    topMonth: string
  }
}
