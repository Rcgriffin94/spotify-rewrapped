"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoginBox } from "@/components/layout/LoginBox"
import { TrendingUp, Users, Clock, BarChart3 } from "lucide-react"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect to top-songs if already authenticated
  useEffect(() => {
    if (session) {
      router.push('/top-songs')
    }
  }, [session, router])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Your Music
                  <br />
                  <span className="text-spotify-green">Rewrapped</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-lg">
                  Dive deep into your Spotify listening habits with beautiful visualizations 
                  and personalized insights about your musical journey.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 text-gray-300">
                  <TrendingUp className="w-5 h-5 text-spotify-green" />
                  <span className="text-sm">Top Tracks</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="w-5 h-5 text-spotify-green" />
                  <span className="text-sm">Favorite Artists</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-5 h-5 text-spotify-green" />
                  <span className="text-sm">Recent Plays</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <BarChart3 className="w-5 h-5 text-spotify-green" />
                  <span className="text-sm">Listening Stats</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <p>🔒 Your data stays private and secure</p>
                <p>📊 Real-time insights from your Spotify account</p>
                <p>🎵 Discover patterns in your music taste</p>
              </div>
            </div>

            {/* Right side - Login box */}
            <div className="flex justify-center lg:justify-end">
              <LoginBox 
                title="Connect Your Spotify"
                description="Sign in to unlock personalized insights about your music listening habits"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
