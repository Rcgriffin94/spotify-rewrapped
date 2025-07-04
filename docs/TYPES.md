# TypeScript Types Documentation

This document provides an overview of the comprehensive TypeScript types used throughout the Spotify Rewrapped application.

## 📁 Type Organization

### `types/auth.ts` - Authentication Types
- **NextAuth Integration**: Extended types for NextAuth.js with Spotify OAuth
- **Session Management**: Types for user sessions, tokens, and authentication state
- **Error Handling**: Authentication error types and status management

### `types/spotify.ts` - Spotify API Types  
- **Core Spotify Objects**: User, Track, Artist, Album, Playlist
- **API Responses**: Paginated responses, top items, recently played
- **Audio Features**: Detailed audio analysis data
- **App-Specific Types**: Aggregated data types for our application logic

### `types/ui.ts` - UI Component Types
- **Component Props**: Props for all reusable UI components
- **State Management**: Loading states, API states, form states
- **Navigation**: Menu items, routing, layout components
- **Charts & Visualizations**: Props for data visualization components

## 🎯 Key Type Categories

### Authentication Flow
```typescript
import { SessionStatus, AuthSession, SpotifySession } from '@/types'

// Check authentication status
const status: SessionStatus = "authenticated" | "loading" | "unauthenticated"

// Access session data
const session: SpotifySession = {
  user: { id, name, email, image },
  accessToken: "spotify_access_token",
  error?: "RefreshAccessTokenError"
}
```

### Spotify Data Types
```typescript
import { SpotifyTrack, TopTrack, TimeRange } from '@/types'

// Raw Spotify API response
const track: SpotifyTrack = {
  id: "track_id",
  name: "Song Name", 
  artists: [{ id, name, external_urls }],
  album: { id, name, images, release_date },
  duration_ms: 180000,
  popularity: 85
}

// App-enhanced track with ranking
const topTrack: TopTrack = {
  rank: 1,
  track: track,
  playCount?: 150,
  lastPlayed?: "2024-01-01T12:00:00Z"
}

// Time ranges for Spotify API
const timeRange: TimeRange = "short_term" | "medium_term" | "long_term"
```

### UI Component Props
```typescript
import { TrackListItemProps, LoadingState, ApiState } from '@/types'

// Track list component
const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  rank,
  showRank = true,
  showPlayCount = false,
  onClick
}) => { /* component logic */ }

// API data state
const apiState: ApiState<TopTrack[]> = {
  data: null,
  loading: true,
  error: null,
  lastFetched?: new Date()
}
```

## 🛠️ Usage Examples

### Fetching Spotify Data
```typescript
import { SpotifyApi, TopItemsParams, SpotifyTopTracksResponse } from '@/types'

const params: TopItemsParams = {
  time_range: "medium_term",
  limit: 50,
  offset: 0
}

const response: SpotifyTopTracksResponse = await spotifyApi.getTopTracks(params)
```

### Component Development
```typescript
import { TrackListItemProps, ComponentSize, ComponentVariant } from '@/types'

interface MyComponentProps {
  size?: ComponentSize  // "xs" | "sm" | "md" | "lg" | "xl"
  variant?: ComponentVariant  // "default" | "primary" | "secondary" etc.
  tracks: TopTrack[]
  onTrackClick: (track: TopTrack) => void
}
```

### State Management
```typescript
import { UseSpotifyDataReturn, ListeningStats } from '@/types'

const useListeningStats = (): UseSpotifyDataReturn<ListeningStats> => {
  // Hook implementation with proper return types
  return {
    data: stats,
    loading: false,
    error: null,
    refetch: async () => { /* refetch logic */ },
    mutate: (newData) => { /* update logic */ }
  }
}
```

## 📊 Audio Features & Statistics

### Audio Features
All audio features are normalized between 0.0 and 1.0 (except tempo and key):
- **Danceability**: How suitable for dancing (0.0 - 1.0)
- **Energy**: Perceptual measure of intensity (0.0 - 1.0)  
- **Valence**: Musical positivity/happiness (0.0 - 1.0)
- **Acousticness**: Confidence track is acoustic (0.0 - 1.0)
- **Tempo**: BPM (typically 60-200)
- **Key**: Pitch class notation (-1 to 11)

### Listening Statistics
```typescript
import { ListeningStats } from '@/types'

const stats: ListeningStats = {
  totalTracks: 1500,
  totalArtists: 450,
  totalListeningTime: 5400000, // milliseconds
  topGenres: [
    { genre: "indie rock", count: 200, percentage: 13.3 }
  ],
  audioFeatureAverages: {
    danceability: 0.65,
    energy: 0.78,
    valence: 0.55
    // ... more features
  },
  discoveryScore: 85.5, // percentage
  yearInReview: {
    totalMinutes: 90000,
    topMonth: "December",
    totalGenres: 42,
    minutesPerDay: 246
  }
}
```

## 🎨 Theme & Styling

### Component Variants
- **Spotify Green**: `#1DB954` (primary actions, branding)
- **Spotify Black**: `#191414` (backgrounds, text)
- **Spotify White**: `#FFFFFF` (text on dark backgrounds)

### Size System
- **xs**: Extra small (mobile, compact views)
- **sm**: Small (secondary elements)
- **md**: Medium (default size)
- **lg**: Large (primary elements, headers)
- **xl**: Extra large (hero sections, main CTAs)

## 🔧 Best Practices

1. **Import from Index**: Use `@/types` for most imports
2. **Type Guards**: Always check for null/undefined in API responses
3. **Error Handling**: Use proper error types for user feedback
4. **Loading States**: Implement loading states for all async operations
5. **Accessibility**: Include ARIA types for screen readers

## 📚 Type Reference

For complete type definitions, see:
- `/src/types/auth.ts` - Authentication & session types
- `/src/types/spotify.ts` - Spotify API & music data types  
- `/src/types/ui.ts` - UI components & interaction types
- `/src/types/index.ts` - Consolidated exports

## 🚀 Next Steps

With these types in place, you can now:
1. Build components with full type safety
2. Implement Spotify API calls with proper error handling
3. Create reusable UI components with consistent interfaces
4. Add comprehensive testing with known data shapes
