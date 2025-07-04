"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

interface LoginBoxProps {
  title?: string
  description?: string
  className?: string
}

export function LoginBox({ 
  title = "Welcome to Spotify Rewrapped",
  description = "Connect your Spotify account to explore your personalized music insights",
  className = ""
}: LoginBoxProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('spotify', { callbackUrl: '/top-songs' })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Card className={`bg-black/80 border-green-500/30 backdrop-blur-sm shadow-2xl max-w-md w-full ${className}`}>
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <Music className="w-8 h-8 text-black" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300 text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Button 
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-6 text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5" />
              <span>Login with Spotify</span>
            </div>
          )}
        </Button>
        
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-400">
            By logging in, you agree to share your Spotify listening data
          </p>
          <p className="text-xs text-gray-500">
            We only access your music data - no personal information is stored
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
