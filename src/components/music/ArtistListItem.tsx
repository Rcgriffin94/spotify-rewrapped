import React from 'react';
import Image from 'next/image';
import { FormattedArtist } from '@/lib/spotify-api';

export interface ArtistListItemProps {
  artist: FormattedArtist;
  showRank?: boolean;
}

export default function ArtistListItem({ artist, showRank = true }: ArtistListItemProps) {
  // Helper function to format follower count
  const formatFollowers = (followers: number): string => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  // Helper function to format popularity as a percentage
  const formatPopularity = (popularity: number): string => {
    return `${popularity}%`;
  };

  return (
    <div className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:bg-black/50 transition-colors group">
      <div className="flex items-center gap-4">
        {/* Rank Number */}
        {showRank && (
          <div className="flex-shrink-0 w-8 text-center">
            <span className="text-2xl font-bold text-green-400">
              {artist.rank}
            </span>
          </div>
        )}

        {/* Artist Image */}
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800">
            {artist.image ? (
              <Image
                src={artist.image}
                alt={`${artist.name} artist photo`}
                fill
                sizes="64px"
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Artist Information */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Artist Name and Genres */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-white truncate text-lg group-hover:text-green-400 transition-colors">
                {artist.name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {artist.genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={genre}
                    className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                {artist.genres.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{artist.genres.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col md:items-end justify-center">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatFollowers(artist.followers)} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{formatPopularity(artist.popularity)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* External Link */}
        <div className="flex-shrink-0">
          {artist.external_url && (
            <a
              href={artist.external_url}
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
