"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/AppLayout"

export default function TopSongsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push('/')
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">Your Top Songs</h1>
          </div>
        </div>

        <Card className="bg-black/50 border-green-800 text-white">
          <CardHeader>
            <CardTitle className="text-green-400">🎉 Authentication Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Your Spotify OAuth integration is working correctly.</p>
              <div className="bg-green-900/30 p-4 rounded-lg">
                <p className="text-sm text-green-300">
                  <strong>Session Info:</strong>
                </p>
                <ul className="text-sm text-gray-300 mt-2 space-y-1">
                  <li>User: {session.user?.name || 'N/A'}</li>
                  <li>Email: {session.user?.email || 'N/A'}</li>
                  <li>Access Token: {session.accessToken ? '✅ Available' : '❌ Missing'}</li>
                  <li>Scopes: user-read-private, user-read-email, user-top-read, user-read-recently-played</li>
                </ul>
              </div>
              {session.error && (
                <div className="bg-red-900/30 p-4 rounded-lg">
                  <p className="text-red-300">
                    <strong>Error:</strong> {session.error}
                  </p>
                </div>
              )}
              <p className="text-gray-400 text-sm">
                🔄 Next: We'll implement the actual top songs API and display functionality in Step 4.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
