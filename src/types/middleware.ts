// Middleware-specific types for route protection

// Define the structure of protected and public routes
export interface RouteConfig {
  protected: string[]
  public: string[]
}

// Route protection result
export interface RouteProtectionResult {
  isAllowed: boolean
  redirectTo?: string
  reason?: string
}

// Middleware context for better debugging
export interface MiddlewareContext {
  pathname: string
  isAuthenticated: boolean
  hasToken: boolean
  tokenError?: string
}

// Default route configuration
export const DEFAULT_ROUTES: RouteConfig = {
  protected: [
    '/top-songs',
    '/top-artists', 
    '/recently-played',
    '/listening-stats'
  ],
  public: [
    '/',
    '/auth/error',
    '/api/auth'
  ]
}
