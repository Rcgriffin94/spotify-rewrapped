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
  product: "free" | "premium"
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: {
    spotify: string
  }
}

export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifySimplifiedArtist[]
  album: SpotifySimplifiedAlbum
  duration_ms: number
  popularity: number
  preview_url: string | null
  explicit: boolean
  track_number: number
  disc_number: number
  is_local: boolean
  is_playable?: boolean
  external_urls: {
    spotify: string
  }
  external_ids: {
    isrc?: string
    ean?: string
    upc?: string
  }
  href: string
  type: "track"
  uri: string
}

// Simplified artist for tracks
export interface SpotifySimplifiedArtist {
  id: string
  name: string
  external_urls: {
    spotify: string
  }
  href: string
  type: "artist"
  uri: string
}

// Full artist object
export interface SpotifyArtist extends SpotifySimplifiedArtist {
  genres: string[]
  popularity: number
  followers: {
    total: number
  }
  images: SpotifyImage[]
}

// Simplified album for tracks
export interface SpotifySimplifiedAlbum {
  id: string
  name: string
  artists: SpotifySimplifiedArtist[]
  images: SpotifyImage[]
  release_date: string
  release_date_precision: "year" | "month" | "day"
  total_tracks: number
  album_type: "album" | "single" | "compilation"
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  type: "album"
  uri: string
}

// Full album object
export interface SpotifyAlbum extends SpotifySimplifiedAlbum {
  tracks: {
    items: SpotifySimplifiedTrack[]
    total: number
    limit: number
    offset: number
    href: string
    next: string | null
    previous: string | null
  }
  popularity: number
  genres: string[]
  label: string
  external_ids: {
    upc?: string
    ean?: string
  }
}

// Simplified track for albums
export interface SpotifySimplifiedTrack {
  id: string
  name: string
  artists: SpotifySimplifiedArtist[]
  duration_ms: number
  explicit: boolean
  preview_url: string | null
  track_number: number
  disc_number: number
  is_local: boolean
  external_urls: {
    spotify: string
  }
  href: string
  type: "track"
  uri: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string | null
  images: SpotifyImage[]
  tracks: {
    total: number
    items: {
      track: SpotifyTrack
      added_at: string
      added_by: {
        id: string
        external_urls: {
          spotify: string
        }
      }
    }[]
  }
  external_urls: {
    spotify: string
  }
  collaborative: boolean
  public: boolean | null
  owner: {
    id: string
    display_name: string
    external_urls: {
      spotify: string
    }
  }
  followers: {
    total: number
  }
  href: string
  type: "playlist"
  uri: string
  snapshot_id: string
}

// API Response wrappers
export interface SpotifyPaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  href: string
  next: string | null
  previous: string | null
}

// Specific response types
export interface SpotifyTopTracksResponse extends SpotifyPaginatedResponse<SpotifyTrack> {}
export interface SpotifyTopArtistsResponse extends SpotifyPaginatedResponse<SpotifyArtist> {}

// Time Range for Spotify API
export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

// Audio Features
export interface SpotifyAudioFeatures {
  id: string
  danceability: number // 0.0 to 1.0
  energy: number // 0.0 to 1.0
  key: number // -1 to 11
  loudness: number // typically -60 to 0 db
  mode: number // 0 or 1
  speechiness: number // 0.0 to 1.0
  acousticness: number // 0.0 to 1.0
  instrumentalness: number // 0.0 to 1.0
  liveness: number // 0.0 to 1.0
  valence: number // 0.0 to 1.0
  tempo: number // BPM
  duration_ms: number
  time_signature: number // 3 to 7
  analysis_url: string
  track_href: string
  type: "audio_features"
  uri: string
}

// Recently Played
export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack
  played_at: string // ISO 8601 timestamp
  context: {
    type: "artist" | "playlist" | "album" | "show"
    href: string | null
    external_urls: {
      spotify: string
    } | null
    uri: string
  } | null
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayedItem[]
  next: string | null
  cursors: {
    after: string
    before: string
  }
  limit: number
  href: string
}

// Error response
export interface SpotifyApiError {
  error: {
    status: number
    message: string
  }
}

// App-specific aggregated types
export interface TopTrack {
  rank: number
  track: SpotifyTrack
  playCount?: number
  lastPlayed?: string
}

export interface TopArtist {
  rank: number
  artist: SpotifyArtist
  playCount?: number
  lastPlayed?: string
  topTracks?: SpotifyTrack[]
}

export interface RecentlyPlayed {
  items: SpotifyRecentlyPlayedItem[]
  total: number
  timeRange: {
    start: string
    end: string
  }
}

export interface ListeningStats {
  totalTracks: number
  totalArtists: number
  totalListeningTime: number // in milliseconds
  averageTrackLength: number // in milliseconds
  topGenres: {
    genre: string
    count: number
    percentage: number
  }[]
  audioFeatureAverages: {
    danceability: number
    energy: number
    valence: number
    acousticness: number
    instrumentalness: number
    speechiness: number
    liveness: number
  }
  timeDistribution: {
    period: string // e.g., "morning", "afternoon", "evening", "night"
    count: number
    percentage: number
  }[]
  discoveryScore: number // percentage of unique artists vs total plays
  yearInReview: {
    totalMinutes: number
    topMonth: string
    totalGenres: number
    minutesPerDay: number
  }
}

// Additional Listening Statistics Types for Dashboard
export interface DashboardStats {
  totalTopTracks: number
  totalTopArtists: number
  totalRecentTracks: number
  followerCount: number
  userCountry: string
  topGenres: {
    genre: string
    count: number
    percentage: number
  }[]
  averageTrackPopularity: number
  averageArtistPopularity: number
  monthlyTopTrack: SpotifyTrack | null
  allTimeTopTrack: SpotifyTrack | null
  monthlyTopArtist: SpotifyArtist | null
  allTimeTopArtist: SpotifyArtist | null
  listeningActivity: ListeningActivity
  uniqueArtistsLastMonth: number
  uniqueArtistsAllTime: number
  audioFeatures: AudioFeaturesStats
}

export interface ListeningActivity {
  hourlyDistribution: Record<string, number>
  dayOfWeekDistribution: Record<string, number>
  timeRange: {
    earliest: string
    latest: string
    daysCovered: number
  }
}

export interface AudioFeaturesStats {
  danceable: number
  energetic: number
  valence: number
}

// API request parameters
export interface TopItemsParams {
  time_range?: TimeRange
  limit?: number
  offset?: number
}

export interface RecentlyPlayedParams {
  limit?: number
  after?: number // Unix timestamp
  before?: number // Unix timestamp
}

// User's aggregated music data
export interface UserMusicData {
  user: SpotifyUser
  topTracks: TopTrack[]
  topArtists: TopArtist[]
  recentlyPlayed: RecentlyPlayed
  audioFeatures: SpotifyAudioFeatures[]
  listeningStats: ListeningStats
  timeRange: TimeRange
  lastUpdated: string
}
