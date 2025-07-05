"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ErrorDisplay, LoadingState } from "@/components/ui"
import { EmptyState } from "@/components/ui/empty-state"
import { APIErrorBoundary } from "@/components/ErrorBoundary"
import { ListControls, TrackListItem } from "@/components/music"
import { useTopTracks } from "@/hooks"
import { accessibilityProps, announceToScreenReader } from "@/lib/accessibility"

export default function TopSongsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State for controls
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term' | 'custom'>('medium_term')
  const [limit, setLimit] = useState<number>(25)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Use the custom hook for data fetching
  const { data: tracks, isLoading, error, refetch, retryCount } = useTopTracks(
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
        <header className="mb-8">
          <h1 
            className="text-4xl font-bold text-white"
            {...accessibilityProps.heading(1, 'Your Top Songs page')}
          >
            Your Top Songs
          </h1>
          <p className="text-gray-400 mt-2" role="doc-subtitle">
            Discover your most played tracks on Spotify
          </p>
        </header>

        <APIErrorBoundary>
          {/* Controls */}
          <section 
            {...accessibilityProps.region('Music filtering controls')}
            className="mb-6"
          >
            <ListControls
              timeRange={timeRange}
              limit={limit}
              onTimeRangeChange={handleTimeRangeChange}
              onLimitChange={handleLimitChange}
              onDateRangeChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
            />
          </section>

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
                Please select both start and end dates to see your top songs for a custom time period.
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
              message="Loading your top songs..." 
              showProgress={true}
              retryCount={retryCount}
            />
          )}

          {/* Tracks List */}
          {!isLoading && !error && tracks && tracks.length > 0 && (
            <section 
              aria-label="Your top songs"
              role="region"
            >
              <div className="space-y-3">
                {tracks.map((track, index) => (
                  <div
                    key={`${track.id}-${track.rank}`}
                    role="listitem"
                    aria-posinset={index + 1}
                    aria-setsize={tracks.length}
                  >
                    <TrackListItem
                      track={track}
                      showRank={true}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!isLoading && !error && tracks && tracks.length === 0 && hasUserInteracted && (
            <EmptyState
              type="tracks"
              action={{
                label: 'View Last 6 Months',
                onClick: () => {
                  setTimeRange('medium_term');
                  setStartDate('');
                  setEndDate('');
                  announceToScreenReader('Time range changed to last 6 months');
                }
              }}
            />
          )}
        </APIErrorBoundary>
      </div>
    </div>
  )
}
