import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Artists',
  description: 'Discover your most listened to artists on Spotify with detailed analytics and listening insights.',
  keywords: ['spotify', 'top artists', 'music analytics', 'listening stats', 'favorite artists'],
}

export default function TopArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
