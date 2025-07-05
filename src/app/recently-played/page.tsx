"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, ErrorDisplay, LoadingState } from "@/components/ui"
import { RecentlyPlayedItem } from "@/components/music"
import { FormattedRecentlyPlayed } from "@/lib/spotify-api"

export default function RecentlyPlayedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State for data
  const [tracks, setTracks] = useState<FormattedRecentlyPlayed[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push('/')
    }
  }, [session, status, router])

  // Fetch recently played tracks
  const fetchRecentlyPlayed = useCallback(async (retryAttempt: number = 0) => {
    if (!session) return

    setIsLoading(true)
    setError(null)
    setRetryCount(retryAttempt)

    try {
      const response = await fetch('/api/spotify/recently-played?limit=25')
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      setTracks(responseData.data.tracks)
      setError(null)
      setRetryCount(0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recently played tracks'
      
      // Retry logic for non-client errors
      if (retryAttempt < 3 && 
          err instanceof Error && 
          !errorMessage.includes('401') && // Don't retry auth errors
          !errorMessage.includes('403')) {  // Don't retry forbidden errors
        
        const delayMs = 1000 * Math.pow(2, retryAttempt) // Exponential backoff
        setTimeout(() => {
          fetchRecentlyPlayed(retryAttempt + 1)
        }, delayMs)
        return
      }

      setError(errorMessage)
      console.error('Error fetching recently played tracks:', err)
      setTracks([])
    } finally {
      setIsLoading(false)
    }
  }, [session])

  const handleRetry = () => {
    fetchRecentlyPlayed(0)
  }

  useEffect(() => {
    if (session) {
      fetchRecentlyPlayed()
    }
  }, [session, fetchRecentlyPlayed])

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
          <h1 className="text-4xl font-bold text-white">Recently Played</h1>
          <p className="text-gray-400 mt-2">Your last 25 played tracks on Spotify</p>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorDisplay 
            error={error} 
            onRetry={handleRetry}
            retryCount={retryCount}
            isRetrying={isLoading}
            className="mb-6"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingState 
            message="Loading your recently played tracks..." 
            showProgress={true}
            retryCount={retryCount}
          />
        )}

        {/* Recently Played List */}
        {!isLoading && !error && tracks && tracks.length > 0 && (
          <div className="space-y-3">
            {tracks.map((item, index) => (
              <RecentlyPlayedItem
                key={`${item.track.id}-${item.played_at}-${index}`}
                item={item}
                showTimestamp={true}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tracks && tracks.length === 0 && (
          <Card className="bg-black/50 border-gray-800 text-white">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <div>
                  <div className="text-gray-400 text-lg font-medium mb-2">
                    No recently played tracks found
                  </div>
                  <p className="text-gray-500">
                    Start listening to music on Spotify to see your recently played tracks here.
                  </p>
                </div>
                <button 
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-spotify-green hover:bg-green-500 text-black font-medium rounded-md transition-colors"
                >
                  Refresh
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
