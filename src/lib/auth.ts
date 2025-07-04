import { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

// Spotify OAuth scopes for accessing user music data
const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email", 
  "user-top-read",
  "user-read-recently-played"
].join(" ")

// Spotify token refresh URL
const SPOTIFY_REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token"

// Extended JWT interface to include Spotify tokens
interface SpotifyJWT extends JWT {
  accessToken?: string
  refreshToken?: string
  accessTokenExpires?: number
  error?: string
}

// Extended Session interface with Spotify access token
interface SpotifySession extends Session {
  accessToken?: string
  error?: string
}

// Function to refresh Spotify access token
async function refreshAccessToken(token: SpotifyJWT): Promise<SpotifyJWT> {
  try {
    const url = SPOTIFY_REFRESH_TOKEN_URL
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }): Promise<SpotifyJWT> {
      // Initial sign in
      if (account && user) {
        console.log("Initial sign in successful")
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at! * 1000,
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token as SpotifyJWT
      }

      // Access token has expired, try to update it
      console.log("Access token expired, refreshing...")
      return refreshAccessToken(token as SpotifyJWT)
    },
    async session({ session, token }): Promise<SpotifySession> {
      const spotifyToken = token as SpotifyJWT
      return {
        ...session,
        accessToken: spotifyToken.accessToken,
        error: spotifyToken.error,
      }
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign in
    error: "/auth/error", // Error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug to avoid console warnings
}

// Export types for use in other files
export type { SpotifySession, SpotifyJWT }
