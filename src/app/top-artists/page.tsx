"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, ErrorDisplay, LoadingState } from "@/components/ui"
import { EmptyState } from "@/components/ui/empty-state"
import { APIErrorBoundary } from "@/components/ErrorBoundary"
import { ListControls, ArtistListItem } from "@/components/music"
import { useTopArtists } from "@/hooks"
import { announceToScreenReader } from "@/lib/accessibility"

export default function TopArtistsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State for controls
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term' | 'custom'>('medium_term')
  const [limit, setLimit] = useState<number>(25)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Use the custom hook for data fetching
  const { data: artists, isLoading, error, refetch, retryCount } = useTopArtists(
    timeRange, 
    limit, 
    !!session, // Only fetch when we have a session
    startDate,
    endDate
  )

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push('/')
    }
  }, [session, status, router])

  const handleTimeRangeChange = (newTimeRange: 'short_term' | 'medium_term' | 'long_term' | 'custom') => {
    setTimeRange(newTimeRange)
    setHasUserInteracted(true)
    // Reset dates when switching away from custom
    if (newTimeRange !== 'custom') {
      setStartDate('')
      setEndDate('')
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setHasUserInteracted(true)
  }

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
    setHasUserInteracted(true)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Your Top Artists</h1>
          <p className="text-gray-400 mt-2">Discover your most played artists on Spotify</p>
        </div>

        {/* Controls */}
        <ListControls
          timeRange={timeRange}
          limit={limit}
          onTimeRangeChange={handleTimeRangeChange}
          onLimitChange={handleLimitChange}
          onDateRangeChange={handleDateRangeChange}
          startDate={startDate}
          endDate={endDate}
          isLoading={isLoading}
        />

        {/* Custom date range helper */}
        {timeRange === 'custom' && (!startDate || !endDate) && hasUserInteracted && (
          <div className="mb-6 p-4 bg-amber-900/50 border border-amber-700 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Custom Date Range Required</span>
            </div>
            <p className="text-amber-200 mt-2">
              Please select both start and end dates to see your top artists for a custom time period.
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <ErrorDisplay 
            error={error} 
            onRetry={refetch}
            retryCount={retryCount}
            isRetrying={isLoading}
            className="mb-6"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingState 
            message="Loading your top artists..." 
            showProgress={true}
            retryCount={retryCount}
          />
        )}

        {/* Artists List */}
        {!isLoading && !error && artists && artists.length > 0 && (
          <div className="space-y-3">
            {artists.map((artist) => (
              <ArtistListItem
                key={`${artist.id}-${artist.rank}`}
                artist={artist}
                showRank={true}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && artists && artists.length === 0 && hasUserInteracted && (
          <Card className="bg-black/50 border-gray-800 text-white">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <div className="text-gray-400 text-lg font-medium mb-2">
                    No artists found for the selected time period
                  </div>
                  <p className="text-gray-500">
                    Try selecting a different time range or make sure you have been listening to music on Spotify.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setTimeRange('medium_term')
                    setStartDate('')
                    setEndDate('')
                  }}
                  className="mt-4 px-4 py-2 bg-spotify-green hover:bg-green-500 text-black font-medium rounded-md transition-colors"
                >
                  View Last 6 Months
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
