"use client"

import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { Music, TrendingUp, Users, Clock, BarChart3, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

// Navigation items configuration
const navigationItems = [
  {
    name: "Top Songs",
    href: "/top-songs",
    icon: TrendingUp,
    description: "Your most played tracks"
  },
  {
    name: "Top Artists",
    href: "/top-artists", 
    icon: Users,
    description: "Your favorite artists"
  },
  {
    name: "Recently Played",
    href: "/recently-played",
    icon: Clock,
    description: "Your listening history"
  },
  {
    name: "Listening Stats",
    href: "/listening-stats",
    icon: BarChart3,
    description: "Detailed analytics"
  }
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
    }
  }

  // Handle keyboard navigation
  // const handleKeyDown = (event: React.KeyboardEvent, href: string) => {
  //   if (event.key === 'Enter' || event.key === ' ') {
  //     event.preventDefault()
  //     router.push(href)
  //   }
  // }

  // Handle navigation with router
  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <nav className="bg-spotify-black border-b border-spotify-gray/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="text-white text-xl font-bold">
              Spotify <span className="text-spotify-green">Rewrapped</span>
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 hover:bg-spotify-gray/10
                    ${isActive 
                      ? 'bg-spotify-green/20 text-spotify-green border border-spotify-green/30' 
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                  title={item.description}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-spotify-green' : ''}`} />
                  <span className="hidden md:inline">{item.name}</span>
                </button>
              )
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            {session?.user && (
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="hidden lg:flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{session.user.name || session.user.email}</span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
              className="
                border-spotify-gray/30 bg-transparent text-gray-300 
                hover:bg-spotify-gray/10 hover:text-white hover:border-spotify-gray/50
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoggingOut ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                  <span className="hidden sm:inline">Logging out...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Page Indicator Bar */}
      <div className="relative">
        {navigationItems.map((item) => {
          if (pathname !== item.href) return null
          
          return (
            <div
              key={item.href}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-spotify-green"
              style={{
                background: `linear-gradient(90deg, transparent 0%, #1DB954 20%, #1DB954 80%, transparent 100%)`
              }}
            />
          )
        })}
      </div>
    </nav>
  )
}
