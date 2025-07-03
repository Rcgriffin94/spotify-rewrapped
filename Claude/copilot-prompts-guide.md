# Copilot Prompts Guide - Spotify Music Trends Website

## 🎯 Build Strategy
Build incrementally with testing at each phase. Complete each step fully before moving to the next.

---

## Phase 1: Project Setup & Basic Authentication

### Step 1.1: Initialize Project
```
Create a new Next.js 14 project called "spotify-music-trends" with the following specifications:
- Use TypeScript
- Use Tailwind CSS
- Use App Router
- Install these additional dependencies: next-auth, @auth/core, lucide-react, react-hot-toast, recharts, @types/node

Include a package.json with all required dependencies and scripts for development.
```

### Step 1.2: Environment Setup
```
Create the following files for environment configuration:
1. .env.local template with Spotify OAuth variables
2. .env.example showing required environment variables
3. Update next.config.js to handle images from Spotify CDN domains

Include comments explaining what each environment variable is for and where to get the values.
```

### Step 1.3: Basic Project Structure
```
Set up the initial folder structure for our Spotify music trends app:
- Create the main directories: app/, components/, lib/, types/, hooks/
- Create subdirectories: components/ui/, components/layout/, components/music/, types/
- Add index.ts barrel exports for each major directory
- Create a basic globals.css with Spotify brand colors (#1DB954 green, #191414 black, #FFFFFF white)

Show the complete folder structure and basic CSS setup.
```

**🧪 Test Step 1:** Run `npm run dev` and verify the Next.js app starts without errors.

---

## Phase 2: Authentication Foundation

### Step 2.1: NextAuth Configuration
```
Set up NextAuth.js for Spotify OAuth with the following requirements:
- Create lib/auth.ts with Spotify provider configuration
- Create app/api/auth/[...nextauth]/route.ts
- Configure Spotify OAuth with proper scopes for music data access
- Set up session and JWT callbacks
- Include proper TypeScript types for the session

The Spotify scopes needed are: user-read-private, user-read-email, user-top-read, user-read-recently-played
```

### Step 2.2: TypeScript Types
```
Create comprehensive TypeScript types in types/ directory:
1. types/auth.ts - for NextAuth session and user types
2. types/spotify.ts - for Spotify API response types including tracks, artists, and stats
3. types/ui.ts - for component props and UI state

Include proper interfaces for TopTrack, TopArtist, RecentlyPlayed, and ListeningStats based on Spotify Web API documentation.
```

### Step 2.3: Landing Page with Login
```
Create a beautiful landing page (app/page.tsx) with:
- Centered login box with Spotify branding
- "Login with Spotify" button using NextAuth signIn
- Spotify green/black color scheme
- Modern, clean design using Tailwind CSS
- Loading state while authentication is processing

Also create components/layout/LoginBox.tsx as a reusable component.
```

**🧪 Test Step 2:** Set up Spotify Developer App, add environment variables, test OAuth login flow works and redirects properly.

---

## Phase 3: Protected Routes & Navigation

### Step 3.1: Route Protection Middleware
```
Create middleware.ts to protect authenticated routes:
- Redirect unauthenticated users to login page
- Allow access to authenticated pages only after login
- Redirect authenticated users to /top-songs after login (not home page)
- Handle edge cases and provide proper error handling

Include proper TypeScript types and NextAuth integration.
```

### Step 3.2: Navigation Menu
```
Create components/layout/Navigation.tsx with:
- Small top menu bar with 4 navigation items: Top Songs, Top Artists, Recently Played, Listening Stats
- Active state styling for current page
- Spotify brand colors and modern design
- Logout functionality
- Desktop-optimized layout (no mobile considerations yet)

Style with Tailwind CSS using our Spotify color palette.
```

### Step 3.3: Layout Structure
```
Update app/layout.tsx to:
- Include the Navigation component for authenticated users
- Set up proper HTML structure and metadata
- Include react-hot-toast Toaster component
- Add proper fonts and global styles
- Show navigation only when user is authenticated

Create a clean, professional layout that works across all pages.
```

**🧪 Test Step 3:** Verify navigation works, protected routes redirect properly, and layout displays correctly after login.

---

## Phase 4: Top Songs Page (Core Feature)

### Step 4.1: Spotify API Client
```
Create lib/spotify-api.ts with:
- Spotify Web API client functions
- Function to get top tracks with parameters (time_range, limit)
- Proper error handling and rate limiting awareness
- TypeScript interfaces for API responses
- Helper functions for data formatting

Include functions: getTopTracks, getTopArtists, getRecentlyPlayed, getListeningStats
```

### Step 4.2: Top Songs API Route
```
Create app/api/spotify/top-tracks/route.ts:
- GET endpoint that accepts query parameters: time_range, start_date, end_date, limit
- Validate user authentication using NextAuth
- Call Spotify Web API with user's access token
- Handle custom date ranges and standard time periods
- Return formatted JSON response
- Include comprehensive error handling

Support limits: 10, 25, 50, 100 and time ranges: short_term, medium_term, long_term, custom
```

### Step 4.3: List Controls Component
```
Create components/music/ListControls.tsx:
- Date picker for custom time ranges
- Dropdown for count selection (10, 25, 50, 100)
- Side-by-side layout as specified
- Auto-apply changes (no submit button)
- Proper TypeScript props and event handling
- Spotify-themed styling

Use React hooks for state management and include loading states.
```

### Step 4.4: Track List Item Component
```
Create components/music/TrackListItem.tsx:
- Display: Rank number, album art, song name, artist name, album name, play count/listening time
- Responsive card design with proper spacing
- Spotify brand colors and modern styling
- Handle missing data gracefully
- Proper image optimization for album art
- TypeScript interface for track data props

Style as a clean, professional list item component.
```

**🧪 Test Step 4:** Create basic top songs page, test API integration, verify data displays correctly in list format.

---

## Phase 5: Complete Top Songs Page

### Step 5.1: Top Songs Page Implementation
```
Create app/top-songs/page.tsx:
- Use ListControls component at the top
- Display list of TrackListItem components
- Handle loading states with spinner
- Implement error handling with toast notifications
- Use custom React hooks for data fetching
- Set as default page after login redirect

Include proper state management and user feedback for all interactions.
```

### Step 5.2: Custom Hooks for Data Fetching
```
Create hooks/useSpotifyData.ts:
- Custom hook for fetching top tracks data
- Handle loading, error, and success states
- Manage API calls with proper cleanup
- Include retry logic for failed requests
- TypeScript interfaces for hook return values

Create a reusable pattern for all Spotify API calls.
```

### Step 5.3: Loading and Error Components
```
Create components/ui/spinner.tsx and components/ui/toast.tsx:
- Professional loading spinner component
- Toast notification system for errors
- Consistent styling with Spotify brand colors
- Reusable across all pages
- Proper accessibility features

Style components to match our overall design system.
```

**🧪 Test Step 5:** Fully test top songs page with different time ranges, counts, error scenarios, and loading states.

---

## Phase 6: Top Artists Page

### Step 6.1: Top Artists API Route
```
Create app/api/spotify/top-artists/route.ts following the same pattern as top-tracks:
- Similar parameter handling and validation
- Call Spotify's top artists endpoint
- Format response data appropriately
- Include error handling and rate limiting

Use the established patterns from the top-tracks API route.
```

### Step 6.2: Artist List Item Component
```
Create components/music/ArtistListItem.tsx:
- Display: Rank number, artist image, artist name, genres, play count/listening time
- Similar styling to TrackListItem but adapted for artist data
- Handle multiple genres display
- Proper image handling for artist photos
- Consistent card design with track items

Maintain design consistency across all list components.
```

### Step 6.3: Top Artists Page
```
Create app/top-artists/page.tsx:
- Reuse ListControls component
- Display ArtistListItem components
- Same loading/error handling patterns
- Navigation integration
- Proper TypeScript types

Follow the exact same pattern as the top songs page for consistency.
```

**🧪 Test Step 6:** Test top artists page functionality, verify data accuracy, test all controls and error scenarios.

---

## Phase 7: Recently Played Page

### Step 7.1: Recently Played API & Components
```
Create the recently played functionality:
1. app/api/spotify/recently-played/route.ts - API route for last 25 tracks
2. components/music/RecentlyPlayedItem.tsx - component showing timestamp + track info
3. app/recently-played/page.tsx - page displaying recent tracks

Recently played should show: timestamp, album art, song name, artist, album
No controls needed - fixed to last 25 tracks
```

**🧪 Test Step 7:** Verify recently played data shows correctly with proper timestamps and formatting.

---

## Phase 8: Listening Statistics Page

### Step 8.1: Statistics API Route
```
Create app/api/spotify/listening-stats/route.ts:
- Aggregate listening data from various Spotify endpoints
- Calculate total listening time, play counts, daily averages
- Generate time series data for charts
- Include genre breakdown analysis
- Return comprehensive statistics object

Focus on meaningful statistics that can be visualized effectively.
```

### Step 8.2: Statistics Components
```
Create statistics visualization components:
1. components/stats/StatsCards.tsx - summary stat cards
2. components/stats/ListeningTimeChart.tsx - time series chart using Recharts
3. components/stats/TopItemsChart.tsx - bar/pie charts for top items
4. components/stats/StatsTable.tsx - detailed statistics table

Use Recharts for all visualizations with consistent styling.
```

### Step 8.3: Statistics Page
```
Create app/listening-stats/page.tsx:
- Combine all statistics components
- Grid layout for different chart types
- Loading states for each section
- Error handling for chart data
- Responsive design for different chart sizes

Create an engaging dashboard-style statistics page.
```

**🧪 Test Step 8:** Test all statistics display correctly, charts render properly, and data is meaningful.

---

## Phase 9: Polish & Production

### Step 9.1: Error Boundaries & Edge Cases
```
Create comprehensive error handling:
1. components/ErrorBoundary.tsx - React error boundary
2. Handle Spotify API rate limiting gracefully
3. Add proper loading states everywhere
4. Handle edge cases (no data, API down, etc.)
5. Improve toast notification messages

Focus on robust error handling and user experience.
```

### Step 9.2: Final Polish
```
Polish the entire application:
1. Consistent styling across all components
2. Proper loading states and transitions
3. Accessibility improvements
4. Performance optimizations
5. Final testing of all features

Ensure professional, production-ready quality.
```

**🧪 Final Test:** Complete end-to-end testing of entire application, all features, error scenarios, and user flows.

---

## 🚀 Deployment Prompts

### Deployment Setup
```
Prepare the application for Vercel deployment:
1. Create deployment configuration files
2. Document environment variables needed
3. Set up production build optimization
4. Create deployment checklist
5. Configure Spotify app for production URLs

Include step-by-step deployment instructions.
```

---

## 💡 Tips for Using These Prompts

1. **One step at a time**: Complete each step fully before moving to the next
2. **Test everything**: Use the test steps to verify functionality
3. **Ask follow-ups**: If Copilot's response isn't complete, ask for clarification
4. **Modify as needed**: Adjust prompts based on what Copilot generates
5. **Save progress**: Commit code after each working step

## 🔧 Debugging Prompts

If something doesn't work, use these follow-up prompts:
- "The code you generated has an error: [paste error]. How do I fix this?"
- "This component isn't displaying correctly. Help me debug the styling."
- "The API call is failing. Help me add better error handling."
- "How do I test this functionality to make sure it works?"

Good luck building your Spotify trends website! 🎵