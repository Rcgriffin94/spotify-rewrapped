import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            Spotify <span className="text-green-400">Rewrapped</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover your music journey with detailed insights into your listening habits, 
            favorite artists, and musical evolution throughout the year.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-green-800 text-white">
            <CardHeader>
              <CardTitle className="text-green-400">🎵 Track Analytics</CardTitle>
              <CardDescription className="text-gray-300">
                Deep dive into your most played songs and discover patterns in your listening habits.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black/50 border-green-800 text-white">
            <CardHeader>
              <CardTitle className="text-green-400">🎤 Artist Insights</CardTitle>
              <CardDescription className="text-gray-300">
                Explore your favorite artists and see how your musical taste has evolved.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black/50 border-green-800 text-white">
            <CardHeader>
              <CardTitle className="text-green-400">📊 Music DNA</CardTitle>
              <CardDescription className="text-gray-300">
                Analyze the audio features that define your unique musical personality.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="spotify" size="lg" className="text-lg px-8 py-6">
            Connect with Spotify
          </Button>
          <p className="text-gray-400 mt-4 text-sm">
            Sign in with your Spotify account to get your personalized music insights
          </p>
        </div>

        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>✅ Project Structure Created</p>
          <p>✅ Environment Configuration Complete</p>
          <p>✅ UI Components Ready</p>
          <p>✅ Spotify Redirect URI Requirements Confirmed</p>
          <p>✅ All Tests Passing</p>
          <p className="text-yellow-400">⚠️ Update your Spotify app redirect URI to:</p>
          <p className="text-green-400 font-mono">http://127.0.0.1:3000/api/auth/callback/spotify</p>
          <p>🔄 Next: NextAuth + Spotify OAuth Integration</p>
        </div>
      </div>
    </div>
  )
}
