import React from 'react';
import Image from 'next/image';
import { FormattedRecentlyPlayed } from '@/lib/spotify-api';

export interface RecentlyPlayedItemProps {
  item: FormattedRecentlyPlayed;
  showTimestamp?: boolean;
}

export default function RecentlyPlayedItem({ item, showTimestamp = true }: RecentlyPlayedItemProps) {
  const { track } = item;
  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Helper function to format track duration
  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:bg-black/50 transition-colors group">
      <div className="flex items-center gap-4">
        {/* Timestamp */}
        {showTimestamp && (
          <div className="flex-shrink-0 w-20 text-center">
            <div className="text-xs text-gray-400">
              {formatTimestamp(item.played_at)}
            </div>
          </div>
        )}

        {/* Album Art */}
        <div className="flex-shrink-0">
          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-800">
            {track.albumArt ? (
              <Image
                src={track.albumArt}
                alt={`${track.name} album art`}
                fill
                sizes="48px"
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Track Information */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Track Name and Artist */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                {track.name}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                by {track.artists}
              </p>
              <p className="text-gray-500 text-xs truncate">
                {track.album}
              </p>
            </div>

            {/* Duration and Context */}
            <div className="flex flex-col md:items-end justify-center">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{formatDuration(track.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* External Link */}
        <div className="flex-shrink-0">
          {track.external_url && (
            <a
              href={track.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              title="Open in Spotify"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
