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
