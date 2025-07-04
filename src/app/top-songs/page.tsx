"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, ErrorDisplay, LoadingState } from "@/components/ui"
import { ListControls, TrackListItem } from "@/components/music"
import { useTopTracks } from "@/hooks"

export default function TopSongsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State for controls
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term')
  const [limit, setLimit] = useState<number>(25)

  // Use the custom hook for data fetching
  const { data: tracks, isLoading, error, refetch } = useTopTracks(
    timeRange, 
    limit, 
    !!session // Only fetch when we have a session
  )

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push('/')
    }
  }, [session, status, router])

  const handleTimeRangeChange = (newTimeRange: 'short_term' | 'medium_term' | 'long_term') => {
    setTimeRange(newTimeRange)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
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
          <h1 className="text-4xl font-bold text-white">Your Top Songs</h1>
          <p className="text-gray-400 mt-2">Discover your most played tracks on Spotify</p>
        </div>

        {/* Controls */}
        <ListControls
          timeRange={timeRange}
          limit={limit}
          onTimeRangeChange={handleTimeRangeChange}
          onLimitChange={handleLimitChange}
          isLoading={isLoading}
        />

        {/* Error Display */}
        {error && (
          <ErrorDisplay 
            error={error} 
            onRetry={refetch}
            className="mb-6"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingState message="Loading your top songs..." />
        )}

        {/* Tracks List */}
        {!isLoading && !error && tracks && tracks.length > 0 && (
          <div className="space-y-3">
            {tracks.map((track) => (
              <TrackListItem
                key={`${track.id}-${track.rank}`}
                track={track}
                showRank={true}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tracks && tracks.length === 0 && (
          <Card className="bg-black/50 border-gray-800 text-white">
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 text-lg">
                No tracks found for the selected time period.
              </div>
              <p className="text-gray-500 mt-2">
                Try selecting a different time range or make sure you have been listening to music on Spotify.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
