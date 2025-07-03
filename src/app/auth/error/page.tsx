"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a configuration error. Please check your environment variables."
      case "AccessDenied":
        return "Access was denied. You need to grant permission to use Spotify features."
      case "Verification":
        return "The verification token has expired or is invalid."
      case "OAuthSignin":
        return "Error during OAuth sign-in process."
      case "OAuthCallback":
        return "Error during OAuth callback."
      case "OAuthCreateAccount":
        return "Could not create OAuth account."
      case "EmailCreateAccount":
        return "Could not create email account."
      case "Callback":
        return "Error in callback handler."
      case "OAuthAccountNotLinked":
        return "The OAuth account is not linked to any existing account."
      case "EmailSignin":
        return "Error sending email."
      case "CredentialsSignin":
        return "Sign in was not successful. Check your credentials."
      case "SessionRequired":
        return "You must be signed in to access this page."
      default:
        return "An unknown authentication error occurred."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Card className="bg-black/50 border-red-800 text-white">
          <CardHeader>
            <CardTitle className="text-red-400 text-center">
              🚫 Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-gray-300">
                {getErrorMessage(error)}
              </p>
              {error && (
                <div className="bg-red-900/30 p-3 rounded text-sm">
                  <strong>Error Code:</strong> {error}
                </div>
              )}
              <div className="space-y-2">
                <Link href="/">
                  <Button variant="spotify" className="w-full">
                    Try Again
                  </Button>
                </Link>
                <p className="text-gray-400 text-xs">
                  Make sure you have added the correct redirect URI to your Spotify app:
                  <br />
                  <code className="text-green-400">http://127.0.0.1:3000/api/auth/callback/spotify</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
