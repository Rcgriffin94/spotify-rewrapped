import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { SpotifySession } from "./auth"

export async function getSession(): Promise<SpotifySession | null> {
  return await getServerSession(authOptions) as SpotifySession | null
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession()
  return session?.accessToken || null
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}
