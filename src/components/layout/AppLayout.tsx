"use client"

import { useSession } from "next-auth/react"
import { Navigation } from "@/components/layout/Navigation"
import { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
  showNavigation?: boolean
}

export function AppLayout({ children, showNavigation = true }: AppLayoutProps) {
  const { data: session, status } = useSession()
  
  // Don't show navigation if not authenticated or still loading
  const shouldShowNav = showNavigation && status === "authenticated" && session

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900">
      {shouldShowNav && <Navigation />}
      {children}
    </div>
  )
}
