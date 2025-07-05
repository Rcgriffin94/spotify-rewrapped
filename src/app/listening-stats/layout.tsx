import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listening Statistics',
  description: 'Comprehensive analytics and insights into your Spotify listening patterns, habits, and music preferences.',
  keywords: ['spotify', 'listening statistics', 'music analytics', 'listening patterns', 'music insights', 'data visualization'],
}

export default function ListeningStatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
