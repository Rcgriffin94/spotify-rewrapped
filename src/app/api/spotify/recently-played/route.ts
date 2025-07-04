import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRecentlyPlayed } from '@/lib/spotify-api';
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

    // Extract query parameters (optional limit)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    // Validate limit parameter (Spotify's recently played max is 50)
    const validLimits = [10, 25, 50];
    if (!validLimits.includes(limit)) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be one of: 10, 25, 50' },
        { status: 400 }
      );
    }

    // Call the Spotify API
    const recentlyPlayedData = await getRecentlyPlayed(limit);

    return NextResponse.json({
      success: true,
      data: {
        tracks: recentlyPlayedData,
        total: recentlyPlayedData.length
      },
      metadata: {
        limit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error in recently-played API route:', error);

    // Handle specific Spotify API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Spotify authentication failed. Please sign in again.' },
        { status: 401 }
      );
    }

    if (error.status === 403) {
      return NextResponse.json(
        { error: 'Access forbidden. Check your Spotify account permissions.' },
        { status: 403 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.status === 500 || error.status === 502 || error.status === 503) {
      return NextResponse.json(
        { error: 'Spotify service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Unable to connect to Spotify. Please check your internet connection.' },
        { status: 503 }
      );
    }

    // Handle timeout errors
    if (error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred while fetching recently played tracks',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
