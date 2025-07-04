"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentlyPlayedPage() {
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
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Recently Played</h1>
        
        <Card className="bg-black/50 border-green-800 text-white">
          <CardHeader>
            <CardTitle className="text-green-400">🕒 Recent Activity Coming Soon!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We'll implement the recently played API and display functionality here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
