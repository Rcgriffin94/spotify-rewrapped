'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useListeningStats } from '@/hooks/useListeningStats';
import {
  StatsCard,
  GenreChart,
  ListeningActivityChart,
  TopItemsSummary,
} from '@/components/stats';
import LoadingState from '@/components/ui/loading-state';
import ErrorDisplay from '@/components/ui/error-display';

export default function ListeningStatsPage() {
  const { data: session, status } = useSession();
  const { stats, loading, error, refetch } = useListeningStats();

  // Redirect if not authenticated
  if (status === 'loading') {
    return <LoadingState message="Checking authentication..." />;
  }

  if (status === 'unauthenticated') {
    redirect('/');
  }

  if (loading) {
    return <LoadingState message="Loading your listening statistics..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Statistics Available</h1>
          <p className="text-gray-400 mb-6">
            We couldn't load your listening statistics. This might be because you don't have enough listening history.
          </p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-spotify-green text-black font-semibold rounded-full hover:bg-spotify-green/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Listening Statistics</h1>
        <p className="text-gray-400">
          A comprehensive look at your Spotify listening habits and preferences
        </p>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Top Tracks"
          value={stats.totalTopTracks}
          subtitle="In your library"
        />
        <StatsCard
          title="Top Artists"
          value={stats.totalTopArtists}
          subtitle="You're following"
        />
        <StatsCard
          title="Recent Plays"
          value={stats.totalRecentTracks}
          subtitle="Last 50 tracks"
        />
        <StatsCard
          title="Your Country"
          value={stats.userCountry}
          subtitle={`${stats.followerCount} followers`}
        />
      </div>

      {/* Popularity and Discovery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Track Popularity"
          value={`${stats.averageTrackPopularity}%`}
          subtitle="Average popularity score"
        />
        <StatsCard
          title="Artist Popularity"
          value={`${stats.averageArtistPopularity}%`}
          subtitle="Average popularity score"
        />
        <StatsCard
          title="Artist Discovery"
          value={`${stats.uniqueArtistsLastMonth}/${stats.uniqueArtistsAllTime}`}
          subtitle="Last month / All time"
        />
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GenreChart genres={stats.topGenres} />
        <ListeningActivityChart
          hourlyDistribution={stats.listeningActivity.hourlyDistribution}
          dayOfWeekDistribution={stats.listeningActivity.dayOfWeekDistribution}
          timeRange={stats.listeningActivity.timeRange}
        />
      </div>

      {/* Top Items Summary */}
      <TopItemsSummary
        monthlyTopTrack={stats.monthlyTopTrack}
        allTimeTopTrack={stats.allTimeTopTrack}
        monthlyTopArtist={stats.monthlyTopArtist}
        allTimeTopArtist={stats.allTimeTopArtist}
        className="mb-8"
      />

      {/* Audio Features */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Audio Profile</h3>
        <p className="text-sm text-gray-400 mb-4">
          Based on your listening preferences (placeholder data - would require additional API calls for real analysis)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-spotify-green mb-1">
              {stats.audioFeatures.danceable}%
            </div>
            <div className="text-sm text-gray-400">Danceability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-spotify-green mb-1">
              {stats.audioFeatures.energetic}%
            </div>
            <div className="text-sm text-gray-400">Energy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-spotify-green mb-1">
              {stats.audioFeatures.valence}%
            </div>
            <div className="text-sm text-gray-400">Positivity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
