import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Songs',
  description: 'Discover your most played tracks on Spotify with detailed listening statistics and personalized insights.',
  keywords: ['spotify', 'top songs', 'music analytics', 'listening stats', 'most played tracks'],
}

export default function TopSongsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
