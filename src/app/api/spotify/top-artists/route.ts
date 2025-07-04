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
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Validate limit parameter
    const validLimits = [10, 25, 50];
    if (!validLimits.includes(limit)) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be one of: 10, 25, 50' },
        { status: 400 }
      );
    }

    // Handle custom time range with date parameters
    if (timeRange === 'custom') {
      if (!startDate || !endDate) {
        return NextResponse.json(
          { error: 'Custom time range requires both start_date and end_date parameters in ISO format (YYYY-MM-DD)' },
          { status: 400 }
        );
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD format for start_date and end_date' },
          { status: 400 }
        );
      }

      // Validate date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date values. Please check your start_date and end_date' },
          { status: 400 }
        );
      }

      if (start >= end) {
        return NextResponse.json(
          { error: 'start_date must be before end_date' },
          { status: 400 }
        );
      }

      if (end > now) {
        return NextResponse.json(
          { error: 'end_date cannot be in the future' },
          { status: 400 }
        );
      }

      // Check if date range is too far in the past
      const fiftyDaysAgo = new Date();
      fiftyDaysAgo.setDate(now.getDate() - 50);
      
      if (start < fiftyDaysAgo) {
        return NextResponse.json(
          { 
            error: 'Custom date ranges are limited to the last 50 days due to Spotify API constraints',
            suggestion: 'Use predefined time ranges (short_term, medium_term, long_term) for older data'
          },
          { status: 400 }
        );
      }

      // For custom ranges, return not implemented for now
      return NextResponse.json(
        { 
          error: 'Custom date range functionality is coming soon. Please use predefined time ranges for now.',
          supported_time_ranges: ['short_term', 'medium_term', 'long_term']
        },
        { status: 501 }
      );
    }

    // Validate standard time_range parameter
    const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { 
          error: 'Invalid time_range. Must be one of: short_term, medium_term, long_term, custom',
          note: 'For custom time ranges, use time_range=custom with start_date and end_date parameters'
        },
        { status: 400 }
      );
    }

    // Call Spotify API using the standard time ranges
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
        time_range: timeRange,
        ...(startDate && endDate && { start_date: startDate, end_date: endDate })
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
