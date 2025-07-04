import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { ClientLayout } from "@/components/layout/ClientLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Spotify Rewrapped",
    template: "%s | Spotify Rewrapped",
  },
  description: "Discover your music journey with detailed insights into your listening habits and musical evolution. View your top songs, artists, recently played tracks, and listening statistics.",
  keywords: ["spotify", "music", "analytics", "listening", "stats", "wrapped", "top songs", "top artists"],
  authors: [{ name: "Spotify Rewrapped" }],
  creator: "Spotify Rewrapped",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Spotify Rewrapped",
    description: "Discover your music journey with detailed insights into your listening habits and musical evolution.",
    siteName: "Spotify Rewrapped",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Rewrapped",
    description: "Discover your music journey with detailed insights into your listening habits and musical evolution.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1DB954" />
      </head>
      <body className="antialiased bg-gradient-to-br from-green-900 via-black to-green-900 text-white font-sans">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
