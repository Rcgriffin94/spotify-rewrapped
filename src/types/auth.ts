import { Session, DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

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

export interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  scope: string
}

// Extend NextAuth types for Spotify integration
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    error?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}
