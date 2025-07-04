import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTopArtists } from '@/lib/spotify-api';
import type { Session } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('time_range') || 'medium_term';
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    // Validate time_range parameter
    const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time_range. Must be one of: short_term, medium_term, long_term' },
        { status: 400 }
      );
    }

    // Validate limit parameter
    const validLimits = [10, 25, 50];
    if (!validLimits.includes(limit)) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be one of: 10, 25, 50' },
        { status: 400 }
      );
    }

    // Call Spotify API using the current function signature
    const topArtists = await getTopArtists(
      timeRange as 'short_term' | 'medium_term' | 'long_term',
      limit
    );

    // Return formatted response
    return NextResponse.json({
      success: true,
      data: {
        artists: topArtists,
        total: topArtists.length,
        limit: limit,
        offset: 0,
        time_range: timeRange
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching top artists:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check for Spotify API rate limiting
      if (error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMITED'
          },
          { status: 429 }
        );
      }

      // Check for invalid/expired token
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { 
            error: 'Invalid or expired token. Please log in again.',
            code: 'TOKEN_EXPIRED'
          },
          { status: 401 }
        );
      }

      // Check for forbidden access
      if (error.message.includes('403')) {
        return NextResponse.json(
          { 
            error: 'Access forbidden. Please check your Spotify permissions.',
            code: 'FORBIDDEN'
          },
          { status: 403 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      { 
        error: 'Failed to fetch top artists. Please try again.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
