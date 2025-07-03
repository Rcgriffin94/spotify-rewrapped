# Spotify Music Trends Website - Architecture Overview

## 🎯 Project Goal
Build a desktop web application that displays users' Spotify music listening trends including top artists, top songs, recently played tracks, and detailed listening statistics with secure OAuth authentication.

## 🏗️ Architecture Stack

### Frontend Framework
- **Next.js 14+** with App Router
- **React** components for UI
- **Tailwind CSS** with Spotify brand colors (green/black/white)
- **TypeScript** for type safety
- **Desktop-first responsive design**

### UI Components & Libraries
- **Recharts** for charts and time series graphs
- **Lucide React** for modern icons
- **React Hook Form** for date picker controls
- **React Hot Toast** for error notifications

### Authentication
- **NextAuth.js** with Spotify OAuth provider
- Handles login/logout flow
- Manages user sessions and token refresh
- Integrates with Spotify API permissions

### Backend (API Routes)
- **Next.js API Routes** (no separate backend needed)
- **Real-time data fetching** (no caching - fresh data every visit)
- Handles Spotify Web API calls with error handling
- Processes and aggregates user listening data

### Database & Storage
- **Vercel KV** (Redis) for session storage only
- **No long-term data storage** (fresh API calls each visit)
- Stores user tokens securely

### Hosting & Deployment
- **Vercel** (free tier)
- One-click deployment from GitHub
- Automatic HTTPS and global CDN
- Environment variable management

### External APIs
- **Spotify Web API** for music data only (no podcasts)
- Endpoints: top artists, top tracks, recently played, user profile

## 📁 Project Structure

```
spotify-music-trends/
├── app/
│   ├── page.tsx                  # Landing page with login
│   ├── top-songs/
│   │   └── page.tsx              # Top songs (default after login)
│   ├── top-artists/
│   │   └── page.tsx              # Top artists page
│   ├── recently-played/
│   │   └── page.tsx              # Recently played tracks
│   ├── listening-stats/
│   │   └── page.tsx              # Charts and statistics
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth configuration
│   │   └── spotify/
│   │       ├── top-artists/
│   │       │   └── route.ts      # GET top artists with timeframe/count
│   │       ├── top-tracks/
│   │       │   └── route.ts      # GET top tracks with timeframe/count
│   │       ├── recently-played/
│   │       │   └── route.ts      # GET last 25 recently played
│   │       └── listening-stats/
│   │           └── route.ts      # GET listening statistics & analytics
│   ├── globals.css               # Spotify brand colors & base styles
│   ├── layout.tsx                # Root layout with navigation menu
│   └── loading.tsx               # Global loading spinner
├── components/
│   ├── ui/
│   │   ├── toast.tsx             # Toast notification system
│   │   ├── date-picker.tsx       # Custom date range picker
│   │   ├── dropdown.tsx          # Count selection dropdown
│   │   └── spinner.tsx           # Loading spinner component
│   ├── layout/
│   │   ├── Navigation.tsx        # Top menu bar navigation
│   │   └── LoginBox.tsx          # Landing page login component
│   ├── music/
│   │   ├── TrackListItem.tsx     # Individual track row with ranking
│   │   ├── ArtistListItem.tsx    # Individual artist row with ranking
│   │   ├── RecentlyPlayedItem.tsx # Recently played track item
│   │   └── ListControls.tsx      # Date picker + count dropdown
│   ├── stats/
│   │   ├── ListeningTimeChart.tsx # Time series charts
│   │   ├── TopItemsChart.tsx     # Bar/pie charts for top items
│   │   ├── StatsTable.tsx        # Detailed statistics table
│   │   └── StatsCards.tsx        # Summary stat cards
│   └── ErrorBoundary.tsx         # Error handling wrapper
├── lib/
│   ├── auth.ts                   # NextAuth Spotify configuration
│   ├── spotify-api.ts            # Spotify API client & utilities
│   ├── date-utils.ts             # Date range handling
│   └── utils.ts                  # General helper functions
├── types/
│   ├── spotify.ts                # Spotify API response types
│   ├── auth.ts                   # Authentication types
│   └── ui.ts                     # UI component prop types
├── hooks/
│   ├── useSpotifyData.ts         # Custom hook for API calls
│   └── useToast.ts               # Toast notification hook
└── middleware.ts                 # Route protection & auth redirect
```

## 🔐 Authentication Flow

1. **User visits site** → Landing page with "Login with Spotify" box
2. **Clicks login** → NextAuth redirects to Spotify OAuth
3. **Spotify authorization** → User grants music data permissions
4. **Successful callback** → User redirected to Top Songs page (default)
5. **Session created** → Access token stored, navigation menu appears
6. **Protected routes** → All music data pages now accessible

## 📊 Data Flow & API Design

### Frontend to Backend Communication
1. **User navigates to page** → React component mounts
2. **Loading spinner displays** → While API request in progress
3. **API route called** → With timeframe & count parameters
4. **Fresh Spotify API call** → No caching, real-time data
5. **Data processed** → Format for UI display
6. **Component updates** → List/chart renders with data
7. **Error handling** → Toast notification if API fails

### API Endpoint Specifications

#### `/api/spotify/top-tracks`
```typescript
// Query Parameters
interface TopTracksParams {
  time_range: 'short_term' | 'medium_term' | 'long_term' | 'custom'
  start_date?: string  // For custom range (YYYY-MM-DD)
  end_date?: string    // For custom range (YYYY-MM-DD)
  limit: 10 | 25 | 50 | 100
}

// Response Format
interface TopTracksResponse {
  tracks: Array<{
    id: string
    name: string
    artist: string
    album: string
    image_url: string
    play_count?: number
    listening_time_ms?: number
  }>
  total_count: number
  time_period: string
}
```

#### `/api/spotify/top-artists`
```typescript
// Similar structure to tracks but for artists
interface TopArtistsResponse {
  artists: Array<{
    id: string
    name: string
    image_url: string
    genres: string[]
    play_count?: number
    listening_time_ms?: number
  }>
}
```

#### `/api/spotify/recently-played`
```typescript
// Fixed to last 25 tracks
interface RecentlyPlayedResponse {
  tracks: Array<{
    id: string
    name: string
    artist: string
    album: string
    image_url: string
    played_at: string  // ISO timestamp
  }>
}
```

#### `/api/spotify/listening-stats`
```typescript
interface ListeningStatsResponse {
  summary: {
    total_listening_time_ms: number
    total_tracks_played: number
    average_daily_listening_ms: number
    most_active_day: string
  }
  time_series: Array<{
    date: string
    listening_time_ms: number
    tracks_played: number
  }>
  top_genres: Array<{
    genre: string
    percentage: number
  }>
}
```

## 🎨 Frontend UI/UX Specifications

### Page Layout & Navigation
- **Landing Page**: Clean centered login box with Spotify branding
- **Post-Login**: Small top menu bar navigation (Top Songs, Top Artists, Recently Played, Listening Stats)
- **Default Landing**: Top Songs page after successful authentication

### List Display Components
- **Numbered Rankings**: 1, 2, 3... format for top tracks/artists
- **Row Structure**: Rank # + Album/Artist Art + Song/Artist Name + Album Name + Play Count/Time
- **Responsive Cards**: Each row as styled box component
- **Desktop Optimized**: Fixed width layout, no mobile considerations initially

### Interactive Controls
- **List Controls**: Date picker + Count dropdown (10/25/50/100) side by side at top
- **Auto-Apply**: Changes trigger immediate API calls and re-render
- **Date Picker**: Custom range selection for flexible timeframes
- **Loading States**: Spinner overlays during API requests

### Visual Design System
- **Color Palette**: Spotify brand colors (Green #1DB954, Black #191414, White #FFFFFF)
- **Typography**: Modern, clean fonts with proper hierarchy
- **Layout**: Card-based design with subtle shadows and rounded corners
- **Icons**: Lucide React for consistent modern iconography

### Data Visualization (Stats Page)
- **Charts**: Recharts library for time series and bar charts
- **Tables**: Detailed breakdowns with sortable columns
- **Summary Cards**: Key metrics displayed prominently
- **Time Series**: Listening patterns over time periods

### Error Handling & Feedback
- **Toast Notifications**: Non-intrusive error messages (react-hot-toast)
- **Loading Spinners**: Visual feedback during API calls
- **Empty States**: Helpful messages when no data available
- **Error Boundaries**: Graceful failure handling

## 🚀 Deployment Process

1. **Development Setup**
   - `npx create-next-app@latest spotify-music-trends --typescript --tailwind --app`
   - Install dependencies: NextAuth.js, Recharts, React Hook Form, React Hot Toast
   - Configure Spotify Developer App credentials

2. **Local Development**
   - Code locally with `npm run dev`
   - Test Spotify OAuth integration
   - Verify API endpoints and data display

3. **GitHub Repository**
   - Push code to GitHub repository
   - Document environment variables in README

4. **Vercel Deployment**
   - Connect GitHub repo to Vercel
   - Configure environment variables in Vercel dashboard
   - Automatic deployment on every push to main branch

5. **Production Environment Variables**
   ```env
   SPOTIFY_CLIENT_ID="your_spotify_client_id"
   SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="https://your-app.vercel.app"
   KV_URL="your_vercel_kv_url"
   KV_REST_API_URL="your_kv_rest_api_url"
   KV_REST_API_TOKEN="your_kv_rest_api_token"
   ```

## 📱 Core Features & User Journey

### Authentication & Landing
- **First Visit**: Clean landing page with centered "Login with Spotify" box
- **OAuth Flow**: Secure Spotify authentication with music data permissions
- **Post-Login Redirect**: Automatic redirect to Top Songs page

### Top Songs Page (Default Landing)
- **Data Display**: Numbered list (1-100) of top tracks
- **Controls**: Date picker (custom range) + Count dropdown (10/25/50/100)
- **Track Info**: Rank, album art, song name, artist, album, play count/listening time
- **Real-time Updates**: Fresh API calls on every page visit

### Top Artists Page
- **Similar Layout**: Numbered list of top artists with artist images
- **Artist Info**: Rank, artist image, name, genres, play count/listening time
- **Same Controls**: Flexible timeframe and count selection

### Recently Played Page
- **Fixed Count**: Last 25 recently played tracks
- **Timestamp Display**: When each track was played
- **Track Details**: Album art, song name, artist, album
- **Chronological Order**: Most recent first

### Listening Statistics Page
- **Time Series Charts**: Listening patterns over time (Recharts)
- **Summary Statistics**: Total listening time, track count, daily averages
- **Genre Breakdown**: Top genres with percentage distribution
- **Interactive Tables**: Detailed statistics with sorting capabilities

### Navigation & UX
- **Menu Bar**: Small top navigation between all sections
- **Loading States**: Spinner animations during API requests
- **Error Handling**: Toast notifications for API failures
- **Desktop Focus**: Optimized for desktop use, mobile support later

## 📈 Technical Implementation Details

### State Management & Data Fetching
- **React Hooks**: useState, useEffect for component state
- **Custom Hooks**: useSpotifyData for API call management
- **SWR/React Query**: Not needed since fresh data preferred over caching
- **Error States**: Comprehensive error boundaries and fallback UI

### Performance Considerations
- **No Caching Strategy**: Fresh API calls prioritized over performance
- **Loading Optimization**: Skeleton screens and spinners
- **Image Optimization**: Next.js automatic image optimization for album art
- **Bundle Splitting**: Automatic code splitting via Next.js

### API Rate Limiting & Error Handling
- **Spotify API Limits**: Respect rate limits with proper error handling
- **Retry Logic**: Exponential backoff for failed requests
- **User Feedback**: Clear error messages via toast notifications
- **Graceful Degradation**: Fallback states when data unavailable

### Security Implementation
- **OAuth 2.0**: Secure Spotify authentication flow
- **Token Management**: Secure server-side token storage
- **Route Protection**: Middleware-based authentication checks
- **HTTPS Enforcement**: Vercel automatic SSL certificates
- **Environment Variables**: Secure credential management

### Development Workflow
- **TypeScript**: Full type safety across frontend and API routes
- **ESLint + Prettier**: Code quality and formatting standards
- **Git Workflow**: Feature branches with main branch protection
- **Testing Strategy**: Component testing with Jest/React Testing Library (future)

---

## 🎯 Success Metrics & Goals

### Primary Objectives
- **Functional Authentication**: Seamless Spotify OAuth integration
- **Data Accuracy**: Reliable real-time music trend data
- **User Experience**: Intuitive navigation and responsive interface
- **Performance**: Fast loading despite fresh API calls on each visit

### Technical Milestones
1. **Phase 1**: Basic authentication and Top Songs page
2. **Phase 2**: Complete all four main pages with navigation
3. **Phase 3**: Advanced statistics and data visualization
4. **Phase 4**: Polish, error handling, and production deployment

This architecture provides a solid foundation for your Spotify music trends website, balancing simplicity with functionality while maintaining room for future enhancements and scalability.