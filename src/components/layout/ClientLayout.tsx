"use client"

import { useSession } from "next-auth/react"
import { Navigation } from "@/components/layout/Navigation"
import { Toaster } from "react-hot-toast"
import { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { data: session, status } = useSession()
  
  // Show navigation only when user is authenticated
  const isAuthenticated = status === "authenticated" && session

  return (
    <>
      {isAuthenticated && <Navigation />}
      <main className={isAuthenticated ? "" : "min-h-screen"}>
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#191414',
            color: '#FFFFFF',
            border: '1px solid #1DB954',
          },
          success: {
            iconTheme: {
              primary: '#1DB954',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </>
  )
}
