import { Session, DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

// Basic user authentication types
export interface AuthUser {
  id: string
  name: string
  email: string
  image: string
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expires: string
}

// Spotify token types
export interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  scope: string
}

// OAuth error types
export interface AuthError {
  error: string
  error_description?: string
  error_uri?: string
}

// Session status types
export type SessionStatus = "loading" | "authenticated" | "unauthenticated"

// Extend NextAuth types for Spotify integration
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    error?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }

  interface Account {
    access_token?: string
    refresh_token?: string
    expires_at?: number
    scope?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
    scope?: string
  }
}
