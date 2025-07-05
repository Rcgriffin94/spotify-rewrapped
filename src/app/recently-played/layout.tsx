import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recently Played',
  description: 'View your recent listening history on Spotify with timestamps and track details.',
  keywords: ['spotify', 'recently played', 'listening history', 'music history', 'track history'],
}

export default function RecentlyPlayedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
