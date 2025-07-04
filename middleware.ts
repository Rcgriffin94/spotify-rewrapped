import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/top-songs',
  '/top-artists', 
  '/recently-played',
  '/listening-stats'
]

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/error',
  '/api/auth'
]

// Helper function to check if a path is protected
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

// Main middleware function
export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Handle root path - redirect authenticated users to /top-songs
    if (pathname === '/' && token) {
      const redirectUrl = new URL('/top-songs', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Allow access to public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // For protected routes, ensure user is authenticated
    if (isProtectedRoute(pathname)) {
      if (!token) {
        // Redirect unauthenticated users to home page (login)
        const redirectUrl = new URL('/', req.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if token has error (e.g., refresh failed)
      if (token.error) {
        console.warn('Auth token error:', token.error)
        // Redirect to error page or force re-authentication
        const redirectUrl = new URL('/auth/error', req.url)
        return NextResponse.redirect(redirectUrl)
      }

      // User is authenticated, allow access
      return NextResponse.next()
    }

    // For any other routes, allow access
    return NextResponse.next()
  },
  {
    callbacks: {
      // Only run middleware for protected routes and root path
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always run middleware for root path to handle redirects
        if (pathname === '/') {
          return true
        }
        
        // Run middleware for protected routes
        if (isProtectedRoute(pathname)) {
          return true
        }
        
        // Skip middleware for public routes and API routes
        return true
      },
    },
    pages: {
      signIn: '/', // Redirect to home page for sign in
      error: '/auth/error', // Custom error page
    },
  }
)

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
