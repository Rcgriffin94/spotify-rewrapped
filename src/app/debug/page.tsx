import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Debug Configuration</h1>
        
        <Card className="bg-black/50 border-green-800 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <p>SPOTIFY_CLIENT_ID: {process.env.SPOTIFY_CLIENT_ID ? '✅ Set' : '❌ Missing'}</p>
              <p>SPOTIFY_CLIENT_SECRET: {process.env.SPOTIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}</p>
              <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}</p>
              <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || '❌ Missing'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-800 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">Required Spotify App Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-yellow-400 font-semibold">Redirect URI (MUST match exactly):</p>
                <p className="font-mono bg-green-900/30 p-2 rounded mt-1">
                  {process.env.NEXTAUTH_URL}/api/auth/callback/spotify
                </p>
              </div>
              <div>
                <p className="text-yellow-400 font-semibold">Spotify App URL:</p>
                <a 
                  href="https://developer.spotify.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  https://developer.spotify.com/dashboard
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-800 text-white">
          <CardHeader>
            <CardTitle className="text-red-400">Common Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Redirect URI must use http://127.0.0.1:3000 (not localhost)</li>
              <li>• Redirect URI must end with /api/auth/callback/spotify</li>
              <li>• Client ID and Secret must be from the same Spotify app</li>
              <li>• Changes to Spotify app settings may take a few minutes to take effect</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
