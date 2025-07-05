import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SpotifyApiError } from '@/types/spotify';

// Helper function to make Spotify API requests
async function spotifyApiRequest(
  endpoint: string,
  accessToken: string,
  params?: Record<string, string>
) {
  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in with Spotify' },
        { status: 401 }
      );
    }

    // Fetch data from multiple Spotify endpoints
    const [
      topTracksShort,
      topTracksLong,
      topArtistsShort,
      topArtistsLong,
      recentlyPlayed,
      userProfile
    ] = await Promise.all([
      spotifyApiRequest('me/top/tracks', session.accessToken, {
        time_range: 'short_term',
        limit: '50'
      }),
      spotifyApiRequest('me/top/tracks', session.accessToken, {
        time_range: 'long_term',
        limit: '50'
      }),
      spotifyApiRequest('me/top/artists', session.accessToken, {
        time_range: 'short_term',
        limit: '50'
      }),
      spotifyApiRequest('me/top/artists', session.accessToken, {
        time_range: 'long_term',
        limit: '50'
      }),
      spotifyApiRequest('me/player/recently-played', session.accessToken, {
        limit: '50'
      }),
      spotifyApiRequest('me', session.accessToken)
    ]);

    // Calculate listening statistics
    const stats = {
      // Basic counts
      totalTopTracks: topTracksLong.items?.length || 0,
      totalTopArtists: topArtistsLong.items?.length || 0,
      totalRecentTracks: recentlyPlayed.items?.length || 0,
      
      // User profile info
      followerCount: userProfile.followers?.total || 0,
      userCountry: userProfile.country || 'Unknown',
      
      // Genre analysis from top artists
      topGenres: extractTopGenres(topArtistsLong.items || []),
      
      // Popularity metrics
      averageTrackPopularity: calculateAveragePopularity(topTracksLong.items || []),
      averageArtistPopularity: calculateAveragePopularity(topArtistsLong.items || []),
      
      // Time-based insights
      monthlyTopTrack: topTracksShort.items?.[0] || null,
      allTimeTopTrack: topTracksLong.items?.[0] || null,
      monthlyTopArtist: topArtistsShort.items?.[0] || null,
      allTimeTopArtist: topArtistsLong.items?.[0] || null,
      
      // Listening patterns (based on recently played)
      listeningActivity: analyzeListeningActivity(recentlyPlayed.items || []),
      
      // Discovery metrics
      uniqueArtistsLastMonth: countUniqueArtists(topTracksShort.items || []),
      uniqueArtistsAllTime: countUniqueArtists(topTracksLong.items || []),
      
      // Audio features (placeholder - would need additional API calls for detailed analysis)
      audioFeatures: {
        danceable: Math.floor(Math.random() * 100), // Placeholder
        energetic: Math.floor(Math.random() * 100), // Placeholder
        valence: Math.floor(Math.random() * 100), // Placeholder
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching listening stats:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch listening statistics' },
      { status: 500 }
    );
  }
}

// Helper functions
function extractTopGenres(artists: any[]): { genre: string; count: number; percentage: number }[] {
  const genreCount: Record<string, number> = {};
  let totalGenres = 0;
  
  artists.forEach(artist => {
    if (artist.genres && Array.isArray(artist.genres)) {
      artist.genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
        totalGenres++;
      });
    }
  });
  
  return Object.entries(genreCount)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / totalGenres) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 genres
}

function calculateAveragePopularity(items: any[]): number {
  if (items.length === 0) return 0;
  
  const total = items.reduce((sum, item) => sum + (item.popularity || 0), 0);
  return Math.round(total / items.length);
}

function analyzeListeningActivity(recentItems: any[]): {
  hourlyDistribution: Record<string, number>;
  dayOfWeekDistribution: Record<string, number>;
} {
  const hourlyDistribution: Record<string, number> = {};
  const dayOfWeekDistribution: Record<string, number> = {};
  
  recentItems.forEach(item => {
    if (item.played_at) {
      const playedAt = new Date(item.played_at);
      const hour = playedAt.getHours().toString().padStart(2, '0');
      const dayOfWeek = playedAt.toLocaleDateString('en-US', { weekday: 'long' });
      
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      dayOfWeekDistribution[dayOfWeek] = (dayOfWeekDistribution[dayOfWeek] || 0) + 1;
    }
  });
  
  return { hourlyDistribution, dayOfWeekDistribution };
}

function countUniqueArtists(tracks: any[]): number {
  const uniqueArtists = new Set();
  
  tracks.forEach(track => {
    if (track.artists && Array.isArray(track.artists)) {
      track.artists.forEach((artist: any) => {
        if (artist.id) {
          uniqueArtists.add(artist.id);
        }
      });
    }
  });
  
  return uniqueArtists.size;
}
